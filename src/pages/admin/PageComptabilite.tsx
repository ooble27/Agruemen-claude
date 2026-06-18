import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Expense = { id: string; category: string; amount: number; expense_date: string };
type Order   = { id: string; created_at: string; total: number; status: string };

const fp = (n: number) => n.toLocaleString("fr-FR") + " FCFA";

const EXPENSE_CATS: Record<string, { label: string; color: string }> = {
  achats_produits: { label: "Achats produits",     color: "#3b82f6" },
  logistique:      { label: "Logistique",           color: "#8b5cf6" },
  marketing:       { label: "Marketing / Pub",      color: "#ec4899" },
  salaires:        { label: "Salaires",             color: "#f59e0b" },
  charges:         { label: "Charges fixes",        color: "#6b7280" },
  autre:           { label: "Autre",                color: "#9ca3af" },
};

export default function PageComptabilite({ orders }: { orders: Order[] }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    supabase.from("expenses").select("id,category,amount,expense_date")
      .then(({ data }) => { if (data) setExpenses(data as Expense[]); });
  }, []);

  const validOrders    = orders.filter(o => o.status !== "cancelled");
  const totalRevenue   = validOrders.reduce((s, o) => s + o.total, 0);
  const totalExpenses  = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit      = totalRevenue - totalExpenses;
  const margin         = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const monthlyData = useMemo(() => {
    const months: Record<string, { month: string; revenue: number; expenses: number }> = {};
    validOrders.forEach(o => {
      const k = o.created_at.slice(0, 7);
      if (!months[k]) months[k] = { month: k, revenue: 0, expenses: 0 };
      months[k].revenue += o.total;
    });
    expenses.forEach(e => {
      const k = e.expense_date.slice(0, 7);
      if (!months[k]) months[k] = { month: k, revenue: 0, expenses: 0 };
      months[k].expenses += e.amount;
    });
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(m => ({
        ...m,
        profit: m.revenue - m.expenses,
        label: new Date(m.month + "-01").toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      }));
  }, [validOrders, expenses]);

  const kpis = [
    { label: "Chiffre d'Affaires", value: fp(totalRevenue), icon: "trending_up",          color: "#10b981", bg: "#ecfdf5", note: `${validOrders.length} commandes` },
    { label: "Total Dépenses",     value: fp(totalExpenses), icon: "trending_down",         color: "#ef4444", bg: "#fef2f2", note: `${expenses.length} entrées` },
    { label: "Bénéfice Net",       value: fp(netProfit),     icon: "account_balance",       color: netProfit >= 0 ? "#10b981" : "#ef4444", bg: netProfit >= 0 ? "#ecfdf5" : "#fef2f2", note: "CA − Dépenses" },
    { label: "Marge Bénéficiaire", value: margin + "%",      icon: "percent",               color: margin >= 20 ? "#10b981" : margin >= 0 ? "#f59e0b" : "#ef4444", bg: "#f8fafc", note: "Sur le CA total" },
  ];

  return (
    <div className="space-y-4">

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] leading-tight">{k.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: k.bg }}>
                <span className="material-symbols-outlined text-[16px]" style={{ color: k.color, fontVariationSettings: "'FILL' 1" }}>{k.icon}</span>
              </div>
            </div>
            <p className="font-headline font-black text-xl text-gray-900">{k.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{k.note}</p>
          </div>
        ))}
      </div>

      {/* Chart + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <p className="font-headline font-black text-sm text-gray-900 mb-0.5">Évolution mensuelle — 6 mois</p>
          <p className="text-[11px] text-gray-400 mb-4">Chiffre d'Affaires vs Dépenses</p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => (v/1000)+"k"}/>
                <Tooltip formatter={(v: number) => fp(v)} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}/>
                <Area type="monotone" dataKey="revenue"  stroke="#10b981" strokeWidth={2} fill="url(#gRev)" name="CA"/>
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gExp)" name="Dépenses"/>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm text-gray-400">Pas encore de données</div>
          )}
          <div className="flex gap-5 mt-2">
            {[["#10b981","CA"],["#ef4444","Dépenses"]].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }}/>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="font-headline font-black text-sm text-gray-900 mb-4">Dépenses par type</p>
          <div className="space-y-3.5">
            {Object.entries(EXPENSE_CATS).map(([key, cat]) => {
              const total = expenses.filter(e => e.category === key).reduce((s, e) => s + e.amount, 0);
              const pct   = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
              if (total === 0) return null;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-gray-600 font-medium">{cat.label}</span>
                    <span className="text-[12px] font-bold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: pct + "%", background: cat.color }}/>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fp(total)}</p>
                </div>
              );
            })}
            {expenses.length === 0 && (
              <p className="text-[12px] text-gray-400 text-center py-4">Aucune dépense enregistrée</p>
            )}
          </div>
        </div>
      </div>

      {/* Monthly P&L table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-gray-100">
          <p className="font-headline font-black text-sm text-gray-900">Tableau de Résultat Mensuel</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Mois","Chiffre d'Affaires","Dépenses","Bénéfice Net","Marge"].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10.5px] font-semibold text-gray-400 uppercase tracking-[0.08em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...monthlyData].reverse().map((m, i) => {
                const marg = m.revenue > 0 ? Math.round((m.profit / m.revenue) * 100) : 0;
                return (
                  <tr key={m.month} className={`border-b border-gray-50 ${i === 0 ? "bg-gray-50/60" : ""}`}>
                    <td className="px-4 py-3 text-[13px] font-semibold text-gray-700 capitalize">{m.label}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-emerald-600">{fp(m.revenue)}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-red-500">{fp(m.expenses)}</td>
                    <td className="px-4 py-3 text-[13px] font-black" style={{ color: m.profit >= 0 ? "#10b981" : "#ef4444" }}>{fp(m.profit)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ background: marg >= 0 ? "#ecfdf5" : "#fef2f2", color: marg >= 0 ? "#10b981" : "#ef4444" }}>
                        {marg}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {monthlyData.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Pas encore de données</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
