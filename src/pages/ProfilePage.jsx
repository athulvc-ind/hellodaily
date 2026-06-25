import { CalendarClock, Crown, Mail, Phone, ReceiptText } from "lucide-react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

export function ProfilePage() {
  const { bookings, currentUser, orders, tables } = useZed();
  const customerOrders = orders.filter((order) => order.userId === currentUser._id);
  const customerBookings = bookings.filter((booking) => booking.userId === currentUser._id);

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Customer profile"
        title="Membership and history"
        description="A single place for booking history, order history, contact details, and membership state."
      />

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="panel-pad h-fit">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-ink text-2xl font-bold text-white">
            {currentUser.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-ink">{currentUser.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{currentUser.role}</p>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Mail size={16} />
              {currentUser.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={16} />
              {currentUser.phone}
            </p>
            <p className="flex items-center gap-2">
              <Crown size={16} />
              {currentUser.membership || "Team account"}
            </p>
          </div>
        </aside>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="panel-pad">
            <div className="flex items-center gap-2">
              <ReceiptText size={19} className="text-leaf" />
              <h2 className="text-lg font-bold text-ink">Order history</h2>
            </div>
            <div className="mt-4 space-y-3">
              {customerOrders.map((order) => (
                <div key={order._id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{order._id.replace("_", " #")}</span>
                    <StatusBadge value={order.orderStatus} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {order.items.length} items, {formatMoney(order.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel-pad">
            <div className="flex items-center gap-2">
              <CalendarClock size={19} className="text-leaf" />
              <h2 className="text-lg font-bold text-ink">Booking history</h2>
            </div>
            <div className="mt-4 space-y-3">
              {customerBookings.map((booking) => (
                <div key={booking._id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">
                      {tables.find((table) => table._id === booking.tableId)?.tableNumber}
                    </span>
                    <StatusBadge value={booking.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {booking.bookingDate}, {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
