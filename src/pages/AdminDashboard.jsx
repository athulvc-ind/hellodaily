import { Building2, CircleDollarSign, Save, ToggleLeft, Trash2, Users } from "lucide-react";
import { useState } from "react";

import { SectionHeader } from "../components/SectionHeader.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

const blankMenuItem = {
  name: "",
  description: "",
  category: "Starters",
  price: 0,
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  availability: true,
  preparationTime: 15,
  rating: 4.5
};

const blankEmployee = {
  name: "",
  role: "staff",
  phone: "",
  email: "",
  status: "active"
};

export function AdminDashboard() {
  const {
    analytics,
    deleteMenuItem,
    employees,
    menuItems,
    restaurants,
    saveEmployee,
    saveMenuItem,
    tables,
    toggleMenuAvailability
  } = useZed();
  const [menuForm, setMenuForm] = useState(blankMenuItem);
  const [employeeForm, setEmployeeForm] = useState(blankEmployee);

  const submitMenu = (event) => {
    event.preventDefault();
    saveMenuItem({ ...menuForm, price: Number(menuForm.price), preparationTime: Number(menuForm.preparationTime) });
    setMenuForm(blankMenuItem);
  };

  const submitEmployee = (event) => {
    event.preventDefault();
    saveEmployee(employeeForm);
    setEmployeeForm(blankEmployee);
  };

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Admin control"
        title="Restaurant management"
        description="Manage menu items, employee records, tables, and the operating snapshot for each restaurant."
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Building2} label="Restaurants" value={restaurants.length} />
        <StatCard icon={Users} label="Employees" value={employees.length} />
        <StatCard icon={CircleDollarSign} label="Revenue" value={formatMoney(analytics.revenue)} tone="saffron" />
        <StatCard icon={ToggleLeft} label="Tables" value={tables.length} tone="ember" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="panel-pad">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">Menu items</h2>
            <span className="text-sm font-semibold text-slate-500">{menuItems.length} records</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3 pr-4">Item</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-ink">{item.name}</p>
                          <p className="line-clamp-1 text-xs text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.category}</td>
                    <td className="py-3 pr-4 font-semibold">{formatMoney(item.price)}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge value={item.availability ? "available" : "inactive"} />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button className="icon-button h-9 w-9" onClick={() => toggleMenuAvailability(item._id)} title="Toggle availability">
                          <ToggleLeft size={16} />
                        </button>
                        <button className="icon-button h-9 w-9" onClick={() => deleteMenuItem(item._id)} title="Delete item">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel-pad h-fit">
          <h2 className="text-xl font-bold text-ink">Add menu item</h2>
          <form className="mt-5 space-y-4" onSubmit={submitMenu}>
            <input
              className="field"
              placeholder="Item name"
              value={menuForm.name}
              onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <textarea
              className="field min-h-24"
              placeholder="Description"
              value={menuForm.description}
              onChange={(event) => setMenuForm((current) => ({ ...current, description: event.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="field"
                value={menuForm.category}
                onChange={(event) => setMenuForm((current) => ({ ...current, category: event.target.value }))}
              >
                <option>Starters</option>
                <option>Main Course</option>
                <option>Desserts</option>
                <option>Beverages</option>
              </select>
              <input
                className="field"
                type="number"
                min="0"
                placeholder="Price"
                value={menuForm.price}
                onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))}
              />
            </div>
            <button className="primary-button w-full">
              <Save size={17} />
              Save Item
            </button>
          </form>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <aside className="panel-pad h-fit">
          <h2 className="text-xl font-bold text-ink">Add employee</h2>
          <form className="mt-5 space-y-4" onSubmit={submitEmployee}>
            <input
              className="field"
              placeholder="Employee name"
              value={employeeForm.name}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <select
              className="field"
              value={employeeForm.role}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="staff">Staff</option>
              <option value="kitchen">Kitchen</option>
              <option value="manager">Manager</option>
            </select>
            <input
              className="field"
              placeholder="Phone"
              value={employeeForm.phone}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, phone: event.target.value }))}
            />
            <input
              className="field"
              type="email"
              placeholder="Email"
              value={employeeForm.email}
              onChange={(event) => setEmployeeForm((current) => ({ ...current, email: event.target.value }))}
            />
            <button className="primary-button w-full">
              <Save size={17} />
              Save Employee
            </button>
          </form>
        </aside>

        <div className="panel-pad">
          <h2 className="text-xl font-bold text-ink">Employees</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {employees.map((employee) => (
              <div key={employee._id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-ink">{employee.name}</p>
                    <p className="text-sm text-slate-500">{employee.email}</p>
                  </div>
                  <StatusBadge value={employee.status} />
                </div>
                <p className="mt-3 text-sm font-semibold uppercase text-slate-500">{employee.role}</p>
                <p className="mt-1 text-sm text-slate-500">{employee.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
