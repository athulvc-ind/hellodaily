import { ArrowRight, CalendarClock, Clock3, QrCode, Star, Table2 } from "lucide-react";
import { Link } from "react-router-dom";

import { OrderTimeline } from "../components/OrderTimeline.jsx";
import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

export function CustomerDashboard() {
  const { activeTable, currentUser, menuItems, orders, restaurants, selectedRestaurantId, setSelectedRestaurantId } =
    useZed();
  const restaurant = restaurants.find((item) => item._id === selectedRestaurantId) || restaurants[0];
  const latestOrder = orders.find((order) => order.userId === currentUser._id);
  const recommended = menuItems.filter((item) => item.availability).slice(0, 3);

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Customer ordering"
        title={`Welcome, ${currentUser.name.split(" ")[0]}`}
        description="Order from your scanned table and watch the kitchen status update in real time."
        action={
          <Link to="/menu" className="primary-button">
            <QrCode size={17} />
            Open Menu
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Table2}
          label="Table"
          value={activeTable?.tableNumber || "Scan QR"}
          detail={activeTable ? `${activeTable.zone}, ${activeTable.capacity} seats` : "Required before ordering"}
        />
        <StatCard icon={Clock3} label="Fastest item" value="5 min" detail="Mango Basil Cooler" tone="saffron" />
        <StatCard icon={Star} label="Membership" value={currentUser.membership} detail="10% dining benefit" tone="ember" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="grid min-h-80 lg:grid-cols-[1fr_1.1fr]">
            <img
              src={restaurant.image}
              alt={restaurant.restaurantName}
              className="h-64 w-full object-cover lg:h-full"
            />
            <div className="flex flex-col justify-between gap-6 p-5">
              <div>
                <p className="label">Selected restaurant</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">{restaurant.restaurantName}</h2>
                <p className="mt-2 text-sm text-slate-600">{restaurant.address}</p>
                <p className="mt-1 text-sm text-slate-600">{restaurant.openingHours}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  className="field"
                  value={selectedRestaurantId}
                  onChange={(event) => setSelectedRestaurantId(event.target.value)}
                >
                  {restaurants.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.restaurantName}
                    </option>
                  ))}
                </select>
                <Link to="/booking" className="secondary-button">
                  <CalendarClock size={17} />
                  Reserve Table
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-pad">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Current order</p>
              <h2 className="mt-1 text-xl font-bold text-ink">
                {latestOrder ? latestOrder._id.replace("_", " #") : "No active order"}
              </h2>
            </div>
            {latestOrder ? <StatusBadge value={latestOrder.orderStatus} /> : null}
          </div>

          {latestOrder ? (
            <div className="mt-5 space-y-5">
              <OrderTimeline status={latestOrder.orderStatus} />
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">Total</span>
                  <span className="font-bold text-ink">{formatMoney(latestOrder.totalAmount)}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {latestOrder.items.map((item) => (
                    <div key={item.menuItemId} className="flex items-center justify-between text-sm text-slate-600">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>{formatMoney(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/tracking" className="primary-button w-full">
                Track Details
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              Your next order will appear here as soon as it is placed.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">Recommended now</h2>
          <Link to="/menu" className="text-sm font-semibold text-leaf">
            View full menu
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommended.map((item) => (
            <article key={item._id} className="panel overflow-hidden">
              <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-ink">{item.name}</h3>
                  <span className="text-sm font-bold text-leaf">{formatMoney(item.price)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
