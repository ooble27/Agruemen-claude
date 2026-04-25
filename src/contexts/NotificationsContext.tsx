import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  order_id?: string;
};

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "created_at">) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
};

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  confirmed: { title: "Commande confirmée ✓", body: "Votre commande a été confirmée par Agrumen." },
  preparing: { title: "Commande en préparation 📦", body: "L'équipe prépare votre commande avec soin." },
  shipped: { title: "En livraison 🚚", body: "Votre commande est en route !" },
  delivered: { title: "Commande livrée ! 🎉", body: "Votre commande a été livrée. Bon appétit !" },
  cancelled: { title: "Commande annulée", body: "Votre commande a été annulée." },
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    try {
      const stored = localStorage.getItem(`notifs_${user.id}`);
      if (stored) setNotifications(JSON.parse(stored));
    } catch { setNotifications([]); }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`notifs_${user.id}`, JSON.stringify(notifications));
  }, [notifications, user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`orders_notifs_${user.id}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `buyer_id=eq.${user.id}`,
      }, (payload) => {
        const msg = STATUS_MESSAGES[payload.new.status];
        if (!msg) return;
        const notif: Notification = {
          id: `${payload.new.id}_${payload.new.status}_${Date.now()}`,
          title: msg.title,
          body: msg.body,
          read: false,
          created_at: new Date().toISOString(),
          order_id: payload.new.id,
        };
        setNotifications(prev => [notif, ...prev].slice(0, 50));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "created_at">) => {
    const notif: Notification = {
      ...n,
      id: `${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev].slice(0, 50));
  }, []);

  const markAllRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);
  const markRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};
