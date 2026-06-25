import { ChefHat, Flame, TimerReset, Utensils } from "lucide-react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatTime } from "../utils/format.js";

const kitchenFlow = ["accepted", "preparing", "ready"];

export function KitchenDashboard() {
  const { menuItems, orders, tables, updateOrderStatus } = useZed();
  const activeOrders = orders.filter((order) => ["placed", "accepted", "preparing"].includes(order.orderStatus));
  const readyOrders = orders.filter((order) => order.orderStatus === "ready");
  const unavailable = menuItems.filter((item) => !item.availability);

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Kitchen display system"
        title="Active kitchen queue"
        description="Move orders through accepted, preparing, and ready while staff handles service and billing."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard icon={ChefHat} label="Active tickets" value={activeOrders.length} />
        <StatCard icon={Utensils} label="Ready to serve" value={readyOrders.length} tone="saffron" />
        <StatCard icon={Flame} label="Unavailable items" value={unavailable.length} tone="ember" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {activeOrders.map((order) => (
          <article key={order._id} className="panel-pad">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label">Kitchen ticket</p>
                <h2 className="mt-1 text-xl font-bold">{order._id.replace("_", " #")}</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <TimerReset size={15} />
                  {formatTime(order.createdAt)} at {tables.find((table) => table._id === order.tableId)?.tableNumber}
                </p>
              </div>
              <StatusBadge value={order.orderStatus} />
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div key={item.menuItemId} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold text-ink">{item.name}</span>
                    <span className="font-bold text-leaf">x{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {kitchenFlow.map((status) => (
                <button
                  key={status}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold ${
                    order.orderStatus === status
                      ? "border-leaf bg-mint text-leaf"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                  onClick={() => updateOrderStatus(order._id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="panel-pad">
        <h2 className="text-xl font-bold text-ink">Ready orders</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {readyOrders.map((order) => (
            <div key={order._id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900">{order._id.replace("_", " #")}</span>
                <StatusBadge value="ready" />
              </div>
              <p className="mt-2 text-sm text-emerald-700">
                {tables.find((table) => table._id === order.tableId)?.tableNumber}, {order.items.length} items
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
