import { ArrowRight, QrCode, Table2, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useZed } from "../state/ZedContext.jsx";

const normalizeTableCode = (value) => {
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, "");
  if (!cleaned) return "";

  const match = cleaned.match(/^(?:table_|t)?0*(\d+)$/);
  if (!match) return cleaned;

  return `table_${match[1].padStart(2, "0")}`;
};

export function CustomerLoginPage() {
  const { activeTable, login, setActiveTableFromQr } = useZed();
  const [tableCode, setTableCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const nextPath = useMemo(() => {
    const from = location.state?.from;
    if (from?.pathname && from.pathname !== "/customer-login" && from.pathname !== "/login") {
      return `${from.pathname}${from.search || ""}`;
    }
    return "/menu";
  }, [location.state]);

  const continueAsCustomer = () => {
    if (!activeTable) {
      setError("Scan the QR code on your table first.");
      return;
    }

    login("customer");
    navigate(nextPath, { replace: true });
  };

  const submitTableCode = (event) => {
    event.preventDefault();
    const tableId = normalizeTableCode(tableCode);
    const table = setActiveTableFromQr(tableId);

    if (!table) {
      setError("Enter a valid table code, like T01.");
      return;
    }

    setError("");
  };

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <p className="text-xl font-bold">HelloDaily</p>
            <p className="text-xs text-slate-500">Customer order</p>
          </div>
        </div>

        <section className="panel-pad">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-mint text-leaf">
            <QrCode size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-ink">Scan your table QR</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use the QR code on your table to open the menu and place your order.
          </p>

          {activeTable ? (
            <div className="mt-6 rounded-lg bg-mint p-4">
              <p className="label text-leaf">Ready to order</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-leaf">
                  <Table2 size={19} />
                </div>
                <div>
                  <p className="font-bold text-ink">{activeTable.tableNumber}</p>
                  <p className="text-sm text-slate-600">
                    {activeTable.zone}, seats {activeTable.capacity}
                  </p>
                </div>
              </div>
              <button className="primary-button mt-4 w-full" onClick={continueAsCustomer}>
                Open menu
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              Point your mobile camera at the table QR, then tap the link that appears.
            </div>
          )}

          <form className="mt-5 space-y-3" onSubmit={submitTableCode}>
            <label className="block">
              <span className="label">Table code</span>
              <input
                className="field mt-1"
                placeholder="Example: T01"
                value={tableCode}
                onChange={(event) => setTableCode(event.target.value)}
              />
            </label>
            {error ? <p className="text-sm font-semibold text-ember">{error}</p> : null}
            <button className="secondary-button w-full">
              Use table code
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
