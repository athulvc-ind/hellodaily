import { ClipboardList } from "lucide-react";

import { EmptyState } from "../components/EmptyState.jsx";
import { OrderTimeline } from "../components/OrderTimeline.jsx";
import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney, formatTime } from "../utils/format.js";

export function OrderTracking() {
  const { currentUser, orders, tables } = useZed();
  const customerOrders = orders.filter((order) => order.userId === currentUser._id);

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Real-time tracking"
        title="Order status"
        description="Every status change from staff or kitchen appears in the customer view."
      />

      {!customerOrders.length ? (
        <EmptyState icon={ClipboardList} title="No orders yet" description="Placed orders will appear here." />
      ) : (
        <div className="space-y-4">
          {customerOrders.map((order) => (
            <article key={order._id} className="panel-pad">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label">Order</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{order._id.replace("_", " #")}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {tables.find((table) => table._id === order.tableId)?.tableNumber} at {formatTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={order.orderStatus} />
                  <StatusBadge value={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-5">
                <OrderTimeline status={order.orderStatus} />
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                {order.items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between py-1 text-sm text-slate-600">
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>{formatMoney(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold">
                  <span>Total</span>
                  <span>{formatMoney(order.totalAmount)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
