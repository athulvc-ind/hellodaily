import { CreditCard, Minus, Plus, QrCode, ReceiptText, Smartphone, Table2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/EmptyState.jsx";
import { SectionHeader } from "../components/SectionHeader.jsx";
import { useZed } from "../state/ZedContext.jsx";
import { formatMoney } from "../utils/format.js";

const paymentMethods = [
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "cash", label: "Cash", icon: Wallet }
];

export function CartCheckout() {
  const { activeTable, cart, placeOrder, updateCartQuantity } = useZed();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [createdOrder, setCreatedOrder] = useState(null);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + serviceCharge;

  const submit = (event) => {
    event.preventDefault();
    if (!cart.length || !activeTable) return;
    setCreatedOrder(placeOrder({ tableId: activeTable._id, paymentMethod }));
  };

  return (
    <div className="page-shell">
      <SectionHeader
        eyebrow="Billing and checkout"
        title="Cart"
        description="Review selected items and place the order for the table scanned on this device."
      />

      {!activeTable ? (
        <EmptyState
          icon={QrCode}
          title="Scan a table QR"
          description="Customer checkout opens only after a table QR has been scanned."
        />
      ) : !cart.length && !createdOrder ? (
        <EmptyState
          icon={ReceiptText}
          title="Your cart is empty"
          description="Open the QR menu to add dishes before moving to checkout."
        />
      ) : (
        <section className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="space-y-3">
            {cart.map((item) => (
              <article key={item.menuItemId} className="panel-pad flex gap-4">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-ink">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{formatMoney(item.price)} each</p>
                    </div>
                    <p className="font-bold text-leaf">{formatMoney(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="icon-button h-9 w-9"
                      onClick={() => updateCartQuantity(item.menuItemId, item.quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      className="icon-button h-9 w-9"
                      onClick={() => updateCartQuantity(item.menuItemId, item.quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="panel-pad h-fit">
            <h2 className="text-xl font-bold text-ink">Invoice</h2>
            <form className="mt-5 space-y-4" onSubmit={submit}>
              <div>
                <p className="label">Scanned table</p>
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-leaf">
                    <Table2 size={19} />
                  </div>
                  <div>
                    <p className="font-bold text-ink">{activeTable.tableNumber}</p>
                    <p className="text-sm text-slate-500">
                      {activeTable.zone}, seats {activeTable.capacity}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="label">Payment method</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method.value}
                      className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                        paymentMethod === method.value
                          ? "border-leaf bg-mint text-leaf"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <method.icon className="mx-auto mb-1" size={18} />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service charge</span>
                  <span className="font-semibold">{formatMoney(serviceCharge)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-bold">Payable</span>
                    <span className="font-bold text-leaf">{formatMoney(total)}</span>
                  </div>
                </div>
              </div>

              <button className="primary-button w-full" disabled={!cart.length || !activeTable}>
                <ReceiptText size={17} />
                Place Order
              </button>
            </form>

            {createdOrder ? (
              <div className="mt-5 rounded-lg bg-mint p-4 text-sm text-leaf">
                Order {createdOrder._id.replace("_", " #")} has been sent to the kitchen.
                <Link className="mt-2 block font-bold" to="/tracking">
                  Track order
                </Link>
              </div>
            ) : null}
          </aside>
        </section>
      )}
    </div>
  );
}
