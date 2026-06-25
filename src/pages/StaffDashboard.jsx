import { Banknote, CheckCircle2, Clock3, ReceiptText, Table2 } from "lucide-react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney, formatTime } from "../utils/format.js";

const staffStatuses = ["accepted", "preparing", "ready", "served", "completed", "cancelled"];
const tableStatuses = ["available", "booked", "occupied", "maintenance"];

export function StaffDashboard() {
  const { analytics, markPaid, orders, tables, updateOrderStatus, updateTableStatus } = useZed();
  const openOrders = orders.filter((order) => !["completed", "cancelled"].includes(order.orderStatus));
  const pendingBills = orders.filter((order) => order.paymentStatus === "pending");

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Staff operations"
        title="Order and billing desk"
        description="Accept incoming orders, coordinate table status, and mark bills as paid after service."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={ReceiptText} label="Open orders" value={openOrders.length} />
        <StatCard icon={Banknote} label="Pending bills" value={pendingBills.length} tone="ember" />
        <StatCard icon={Table2} label="Occupied tables" value={tables.filter((table) => table.status === "occupied").length} />
        <StatCard icon={CheckCircle2} label="AOV" value={formatMoney(analytics.averageOrderValue)} tone="saffron" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {openOrders.map((order) => (
            <article key={order._id} className="panel-pad">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="label">Incoming order</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{order._id.replace("_", " #")}</h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={15} />
                    {formatTime(order.createdAt)} at {tables.find((table) => table._id === order.tableId)?.tableNumber}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={order.orderStatus} />
                  <StatusBadge value={order.paymentStatus} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
                <div className="rounded-lg bg-slate-50 p-4">
                  {order.items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between py-1 text-sm text-slate-600">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>{formatMoney(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-bold">
                    <span>Bill total</span>
                    <span>{formatMoney(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block">
                    <span className="label">Order status</span>
                    <select
                      className="field mt-1"
                      value={order.orderStatus}
                      onChange={(event) => updateOrderStatus(order._id, event.target.value)}
                    >
                      <option value={order.orderStatus}>{order.orderStatus}</option>
                      {staffStatuses
                        .filter((status) => status !== order.orderStatus)
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </label>
                  <button
                    className="secondary-button w-full"
                    disabled={order.paymentStatus === "paid"}
                    onClick={() => markPaid(order._id)}
                  >
                    <Banknote size={17} />
                    Mark Paid
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="panel-pad h-fit">
          <h2 className="text-xl font-bold text-ink">Table status</h2>
          <div className="mt-4 space-y-3">
            {tables.map((table) => (
              <div key={table._id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{table.tableNumber}</p>
                    <p className="text-sm text-slate-500">
                      {table.zone}, {table.capacity} seats
                    </p>
                  </div>
                  <StatusBadge value={table.status} />
                </div>
                <select
                  className="field mt-3"
                  value={table.status}
                  onChange={(event) => updateTableStatus(table._id, event.target.value)}
                >
                  {tableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
