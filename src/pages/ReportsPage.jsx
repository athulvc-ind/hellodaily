import { BarChart3, CalendarDays, IndianRupee, ShoppingBag, TrendingUp } from "lucide-react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

export function ReportsPage() {
  const { analytics, orders, tables } = useZed();
  const maxQuantity = Math.max(...analytics.topItems.map((item) => item.quantity), 1);
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid");

  const statusCounts = tables.reduce((result, table) => {
    result[table.status] = (result[table.status] || 0) + 1;
    return result;
  }, {});

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Reports and analytics"
        title="Sales insights"
        description="Track daily revenue, top-selling items, payment progress, and table utilization from the operating data."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={IndianRupee} label="Paid revenue" value={formatMoney(analytics.revenue)} />
        <StatCard icon={ShoppingBag} label="Orders" value={analytics.orderCount} tone="ember" />
        <StatCard icon={TrendingUp} label="Average order" value={formatMoney(analytics.averageOrderValue)} tone="saffron" />
        <StatCard icon={CalendarDays} label="Paid orders" value={paidOrders.length} tone="ink" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="panel-pad">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-leaf" />
            <h2 className="text-xl font-bold text-ink">Top selling items</h2>
          </div>
          <div className="mt-6 space-y-5">
            {analytics.topItems.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-ink">{item.name}</span>
                  <span className="text-slate-500">{item.quantity} sold</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-leaf"
                    style={{ width: `${Math.max(12, (item.quantity / maxQuantity) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel-pad h-fit">
          <h2 className="text-xl font-bold text-ink">Table utilization</h2>
          <div className="mt-5 space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-slate-700">{status}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-ember"
                    style={{ width: `${(count / tables.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="panel-pad">
        <h2 className="text-xl font-bold text-ink">Recent sales ledger</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Items</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Payment</th>
                <th className="py-3 pr-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-3 pr-4 font-semibold">{order._id.replace("_", " #")}</td>
                  <td className="py-3 pr-4 text-slate-600">{order.items.length}</td>
                  <td className="py-3 pr-4 text-slate-600">{order.orderStatus}</td>
                  <td className="py-3 pr-4 text-slate-600">{order.paymentStatus}</td>
                  <td className="py-3 pr-4 font-bold">{formatMoney(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
