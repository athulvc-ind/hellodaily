import { AlertCircle, ArrowRight, QrCode, Table2, UtensilsCrossed } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { StatusBadge } from "../components/StatusBadge.jsx";
import { useZed } from "../state/ZedContext.jsx";

export function TableScanPage() {
  const { currentUser, login, setActiveTableFromQr, tables } = useZed();
  const { tableId } = useParams();
  const navigate = useNavigate();
  const table = tables.find((candidate) => candidate._id === tableId);

  useEffect(() => {
    if (table?._id) setActiveTableFromQr(table._id);
  }, [setActiveTableFromQr, table?._id]);

  const continueToMenu = () => {
    if (!table) return;
    if (currentUser?.role !== "customer") login("customer");
    navigate("/menu", { replace: true });
  };

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg flex-col justify-center">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <p className="text-xl font-bold">HelloDaily</p>
            <p className="text-xs text-slate-500">Table access</p>
          </div>
        </div>

        {table ? (
          <section className="panel-pad">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-leaf">
                  <Table2 size={23} />
                </div>
                <div>
                  <p className="label">Table scanned</p>
                  <h1 className="mt-1 text-3xl font-bold text-ink">{table.tableNumber}</h1>
                </div>
              </div>
              <StatusBadge value={table.status} />
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Zone</span>
                <span className="font-bold text-ink">{table.zone}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span>Seats</span>
                <span className="font-bold text-ink">{table.capacity}</span>
              </div>
            </div>

            <button className="primary-button mt-6 w-full" onClick={continueToMenu}>
              Open menu
              <ArrowRight size={17} />
            </button>
          </section>
        ) : (
          <section className="panel-pad text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-ember">
              <AlertCircle size={23} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-ink">Table not found</h1>
            <p className="mt-2 text-sm text-slate-600">
              This QR code is not connected to an active table in HelloDaily.
            </p>
            <Link to="/customer-login" className="secondary-button mt-6 w-full">
              <QrCode size={17} />
              Back to login
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
