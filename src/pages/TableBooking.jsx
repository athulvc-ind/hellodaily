import { CalendarCheck2, CircleSlash2, QrCode, Users } from "lucide-react";
import { useState } from "react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";

export function TableBooking() {
  const { bookTable, bookings, currentUser, tables } = useZed();
  const firstAvailable = tables.find((table) => table.status === "available")?._id || "";
  const customerBookings = bookings.filter((booking) => booking.userId === currentUser._id);
  const [form, setForm] = useState({
    tableId: firstAvailable,
    bookingDate: new Date().toISOString().slice(0, 10),
    startTime: "19:30",
    endTime: "21:00",
    guests: 2
  });
  const [lastBooking, setLastBooking] = useState(null);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.tableId) return;
    setLastBooking(bookTable(form));
  };

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Table booking"
        title="Book a table"
        description="Choose an available table and reserve a time slot from your customer account."
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => {
            const isAvailable = table.status === "available";
            return (
              <article
                key={table._id}
                className={`panel-pad transition ${
                  form.tableId === table._id ? "ring-2 ring-leaf/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="label">{table.zone}</p>
                    <h2 className="mt-1 text-2xl font-bold">{table.tableNumber}</h2>
                  </div>
                  <StatusBadge value={table.status} />
                </div>
                <div className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                  <Users size={17} />
                  Seats {table.capacity}
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                  <QrCode size={17} />
                  QR linked
                </div>
                <button
                  className="secondary-button mt-5 w-full"
                  disabled={!isAvailable}
                  onClick={() => updateForm("tableId", table._id)}
                >
                  {isAvailable ? "Select Table" : "Unavailable"}
                </button>
              </article>
            );
          })}
        </div>

        <aside className="panel-pad h-fit">
          <h2 className="text-xl font-bold text-ink">Reservation details</h2>
          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="label">Table</span>
              <select
                className="field mt-1"
                value={form.tableId}
                onChange={(event) => updateForm("tableId", event.target.value)}
              >
                {tables
                  .filter((table) => table.status === "available")
                  .map((table) => (
                    <option key={table._id} value={table._id}>
                      {table.tableNumber} - {table.zone}
                    </option>
                  ))}
              </select>
            </label>
            <label className="block">
              <span className="label">Date</span>
              <input
                className="field mt-1"
                type="date"
                value={form.bookingDate}
                onChange={(event) => updateForm("bookingDate", event.target.value)}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="label">Start</span>
                <input
                  className="field mt-1"
                  type="time"
                  value={form.startTime}
                  onChange={(event) => updateForm("startTime", event.target.value)}
                />
              </label>
              <label className="block">
                <span className="label">End</span>
                <input
                  className="field mt-1"
                  type="time"
                  value={form.endTime}
                  onChange={(event) => updateForm("endTime", event.target.value)}
                />
              </label>
            </div>
            <label className="block">
              <span className="label">Guests</span>
              <input
                className="field mt-1"
                type="number"
                min="1"
                max="12"
                value={form.guests}
                onChange={(event) => updateForm("guests", Number(event.target.value))}
              />
            </label>
            <button className="primary-button w-full" disabled={!form.tableId}>
              <CalendarCheck2 size={17} />
              Confirm Booking
            </button>
          </form>

          {lastBooking ? (
            <div className="mt-5 rounded-lg bg-mint p-4 text-sm text-leaf">
              Booking confirmed for table {tables.find((table) => table._id === lastBooking.tableId)?.tableNumber}.
            </div>
          ) : null}

          <div className="mt-6">
            <h3 className="font-semibold text-ink">Recent bookings</h3>
            <div className="mt-3 space-y-3">
              {customerBookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">
                      {tables.find((table) => table._id === booking.tableId)?.tableNumber}
                    </span>
                    <StatusBadge value={booking.status} />
                  </div>
                  <p className="mt-2 text-slate-500">
                    {booking.bookingDate}, {booking.startTime} - {booking.endTime}
                  </p>
                </div>
              ))}
              {!customerBookings.length ? (
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                  <CircleSlash2 size={16} />
                  No bookings yet.
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
