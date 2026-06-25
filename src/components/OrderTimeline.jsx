import { CheckCircle2, Circle } from "lucide-react";

import { titleCase } from "../utils/format.js";

const steps = ["placed", "accepted", "preparing", "ready", "served", "completed"];

export function OrderTimeline({ status }) {
  const activeIndex = Math.max(0, steps.indexOf(status));

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {steps.map((step, index) => {
        const complete = index <= activeIndex;
        return (
          <div
            key={step}
            className={`rounded-lg border px-3 py-2 ${
              complete ? "border-leaf/30 bg-mint text-leaf" : "border-slate-200 bg-white text-slate-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {complete ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              <span className="text-xs font-semibold">{titleCase(step)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
