import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Order = {
  id: string; created_at: string; total: number; status: string;
  payment_method: string | null; shipping_city: string | null; phone: string | null;
};

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";
const fd = (s: string) => new Date(s).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pending:   { label: "En attente",   bg: "#fffbeb", color: "#d97706" },
  confirmed: { label: "Confirmée",    bg: "#eff6ff", color: "#2563eb" },
  preparing: { label: "En prépa.",    bg: "#fff7ed", color: "#ea580c" },
  shipped:   { label: "En livraison", bg: "#eff6ff", color: "#0284c7" },
  delivered: { label: "Livrée",       bg: "#ecfdf5", color: "#059669" },
  cancelled: { label: "Annulée",      bg: "#fef2f2", color: "#dc2626" },
};

const PAGE_SIZE = 15;

export default function PageVentes({ orders }: { orders: Order[] }) {
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const [page,   setPage]   = useState(0);

  const now    = new Date();
  const cutoff = new Date(now.getTime() - parseInt(period) * 86_400_000);

  const validOrders  = useMemo(() => orders.filter(o => o.status !== "cancelled"), [orders]);
  const periodValid  = useMemo(() => validOrders.filter(o => new Date(o.created_at) >= cutoff), [validOrders, period]);
  const periodOrders = useMemo(() => orders.filter(o => new Date(o.created_at) >= cutoff), [orders, period]);

  const revenue   = periodValid.reduce((s, o) => s + o.total, 0);
  const avgBasket = periodValid.length > 0 ? Math.round(revenue / periodValid.length) : 0;
  const totalAll  = validOrders.reduce((s, o) => s + o.total, 0);

  const dailyData = useMemo(() => {
    const daysCount = Math.min(parseInt(period), 30);
    const days: Record<string, { label: string; revenue: number; count: number }> = {};
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86_400_000);
      const k = d.toISOString().slice(0, 10);
      days[k] = { label: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }), revenue: 0, count: 0 };
    }
    validOrders.filter(o => new Date(o.created_at) >= cutoff).forEach(o => {
      const k = o.created_at.slice(0, 10);
      if (days[k]) { days[k].revenue += o.total; days[k].count++; }
    });
    return Object.values(days);
  }, [validOrders, period]);

  const byPayment = useMemo(() => {
    const m: Record<string, number> = {};
    periodValid.forEach(o => { const k = o.payment_method ?? "autre"; m[k] = (m[k] ?? 0) + o.total; });
    return Object.entries(m).map(([k, v]) => ({
      method: k === "wave" ? "Wave" : k === "orange_money" ? "Orange Money" : k,
      amount: v,
    }));
  }, [periodValid]);

  const byCity = useMemo(() => {
    const m: Record<string, number> = {};
    periodValid.forEach(o => { if (o.shipping_city) m[o.shipping_city] = (m[o.shipping_city] ?? 0) + o.total; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [periodValid]);

  const totalPages     = Math.ceil(orders.length / PAGE_SIZE);
  const paginatedOrders = orders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-headline font-black text-base text-gray-900">Analyse des Ventes</p>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {(["7","30","90"] as const).map(p => (
            <button key={p} onClick={() => { setPeriod(p); setPage(0); }}
              className={`px-3 py-1.5 text-[12px] font-semibold transition-colors ${period === p ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
              {p}j
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "CA Période",        value: fp(revenue),              icon: "payments",               note: `${period} derniers jours` },
          { label: "Commandes",         value: periodOrders.length,      icon: "receipt_long",           note: `${periodValid.length} validées` },
          { label: "Panier Moyen",      value: fp(avgBasket),            icon: "shopping_cart",          note: "Commandes validées" },
          { label: "CA Total Cumulé",   value: fp(totalAll),             icon: "account_balance_wallet", note: "Toutes périodes" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] leading-tight">{k.label}</p>
              <span className="material-symbols-outlined text-[16px] text-gray-300" style={{ fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
            </div>
            <p className="font-headline font-black text-lg text-gray-900">{k.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <p className="font-headline font-black text-sm text-gray-900 mb-4">
            Revenue — {period === "7" ? "7 derniers jours" : period === "30" ? "30 derniers jours" : "30 jours (sur 90)"}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                interval={period === "7" ? 0 : 4}/>
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000)+"k"}/>
              <Tooltip formatter={(v: number) => fp(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}/>
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#gSales)" name="CA"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-headline font-black text-sm text-gray-900 mb-3">Par mode de paiement</p>
            {byPayment.length === 0 ? (
              <p className="text-[12px] text-gray-400">Aucune vente sur la période</p>
            ) : byPayment.map(m => (
              <div key={m.method} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-[12px] text-gray-600">{m.method}</span>
                <span className="text-[12px] font-bold text-gray-800">{fp(m.amount)}</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-headline font-black text-sm text-gray-900 mb-3">Top villes</p>
            {byCity.length === 0 ? (
              <p className="text-[12px] text-gray-400">Aucune donnée ville</p>
            ) : byCity.map(([city, amount], i) => (
              <div key={city} className="flex items-center gap-2.5 py-2 border-b border-gray-50 last:border-0">
                <span className="text-[11px] font-black text-gray-200 w-4">{i+1}</span>
                <span className="text-[12px] text-gray-600 flex-1">{city}</span>
                <span className="text-[12px] font-bold text-gray-800">{fp(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full orders table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <p className="font-headline font-black text-sm text-gray-900">Toutes les ventes</p>
          <span className="text-[11px] text-gray-400">{orders.length} commande{orders.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Date","Référence","Ville","Montant","Paiement","Statut"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(o => {
                const s = STATUS_LABELS[o.status] ?? { label: o.status, bg: "#f3f4f6", color: "#6b7280" };
                return (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-[12px] text-gray-500 whitespace-nowrap">{fd(o.created_at)}</td>
                    <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{o.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3 text-[12px] text-gray-600">{o.shipping_city ?? "—"}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-gray-900">{fp(o.total)}</td>
                    <td className="px-4 py-3 text-[12px] text-gray-500 capitalize">
                      {o.payment_method === "orange_money" ? "Orange Money" : o.payment_method ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold whitespace-nowrap"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-500 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              ← Précédent
            </button>
            <span className="text-[12px] text-gray-400">Page {page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-gray-500 disabled:opacity-30 hover:bg-gray-100 transition-colors">
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
