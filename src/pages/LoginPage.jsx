import { ChefHat, LockKeyhole, ShieldCheck, UserCog, UtensilsCrossed } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useZed } from "../state/ZedContext.jsx";
import { roleHome, roleLabels } from "../utils/access.js";

const teamRoles = [
  { role: "staff", title: "Staff desk", icon: UserCog, detail: "Orders, bills, and tables" },
  { role: "kitchen", title: "Kitchen display", icon: ChefHat, detail: "Tickets and preparation queue" },
  { role: "admin", title: "Admin console", icon: ShieldCheck, detail: "Menu, employees, and reports" }
];

export function LoginPage() {
  const { login } = useZed();
  const navigate = useNavigate();
  const location = useLocation();

  const nextPathFor = (role) => {
    const from = location.state?.from;
    if (from?.pathname && !["/login", "/customer-login"].includes(from.pathname)) {
      return `${from.pathname}${from.search || ""}`;
    }
    return roleHome[role] || "/";
  };

  const signIn = (role) => {
    if (!login(role)) return;
    navigate(nextPathFor(role), { replace: true });
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80"
            alt="Restaurant dining room"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-ink">
                <UtensilsCrossed size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold">HelloDaily</p>
                <p className="text-sm text-white/80">Restaurant operations</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                <UtensilsCrossed size={22} />
              </div>
              <div>
                <p className="text-xl font-bold">HelloDaily</p>
                <p className="text-xs text-slate-500">Restaurant operations</p>
              </div>
            </div>

            <div>
              <p className="label">Team access</p>
              <h1 className="mt-2 text-3xl font-bold text-ink">Staff login</h1>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Open the workspace for your restaurant role.
              </p>
            </div>

            <section className="panel-pad mt-8">
              <div className="flex items-center gap-2">
                <LockKeyhole size={19} className="text-leaf" />
                <h2 className="text-lg font-bold text-ink">Team login</h2>
              </div>
              <div className="mt-4 space-y-3">
                {teamRoles.map((item) => (
                  <button
                    key={item.role}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-leaf hover:bg-mint/40"
                    onClick={() => signIn(item.role)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-ink">
                        <item.icon size={19} />
                      </span>
                      <span>
                        <span className="block font-bold text-ink">{item.title}</span>
                        <span className="block text-sm text-slate-500">{item.detail}</span>
                      </span>
                    </span>
                    <span className="text-xs font-semibold uppercase text-slate-400">
                      {roleLabels[item.role]}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
