import { Clock3, Minus, Plus, Search, Star, Table2 } from "lucide-react";
import { useMemo, useState } from "react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

export function MenuPage() {
  const { activeTable, addToCart, cart, menuItems, role, toggleMenuAvailability } = useZed();
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const queryMatch = `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  }, [category, menuItems, query]);

  const quantityInCart = (itemId) =>
    cart.find((item) => item.menuItemId === itemId)?.quantity || 0;

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow={role === "admin" ? "Menu management" : "QR menu"}
        title={role === "admin" ? "Manage menu availability" : "Browse menu"}
        description={
          role === "admin"
            ? "Toggle availability and review item pricing before syncing to Cloudinary-backed menu records."
            : "Filter by category, inspect preparation time, and add dishes directly to your cart."
        }
        action={
          role === "customer" && activeTable ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              <Table2 size={17} />
              {activeTable.tableNumber}
            </div>
          ) : null
        }
      />

      <section className="panel-pad">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="field pl-10"
              placeholder="Search dishes, descriptions, or categories"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item}
                className={`min-w-fit rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  category === item ? "bg-ink text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article key={item._id} className="panel overflow-hidden">
            <div className="relative">
              <img src={item.image} alt={item.name} className="h-52 w-full object-cover" />
              <div className="absolute left-3 top-3">
                <StatusBadge value={item.availability ? "available" : "inactive"} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label">{item.category}</p>
                  <h2 className="mt-1 text-lg font-bold text-ink">{item.name}</h2>
                </div>
                <span className="text-base font-bold text-leaf">{formatMoney(item.price)}</span>
              </div>
              <p className="mt-3 min-h-10 text-sm text-slate-600">{item.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={15} />
                  {item.preparationTime} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star size={15} />
                  {item.rating}
                </span>
              </div>
              <div className="mt-5 flex gap-2">
                {role === "admin" ? (
                  <button className="secondary-button w-full" onClick={() => toggleMenuAvailability(item._id)}>
                    {item.availability ? "Mark Unavailable" : "Mark Available"}
                  </button>
                ) : (
                  <button className="primary-button w-full" disabled={!item.availability} onClick={() => addToCart(item)}>
                    <Plus size={17} />
                    Add
                  </button>
                )}
                {role === "customer" ? (
                  <div className="inline-flex min-w-14 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-bold text-ink">
                    {quantityInCart(item._id) ? (
                      <span className="inline-flex items-center gap-1">
                        <Minus size={12} />
                        {quantityInCart(item._id)}
                      </span>
                    ) : (
                      "0"
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
