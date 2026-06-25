import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

export function getTableScanUrl(tableId) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/scan/${tableId}`;
}

export function TableQrCode({ table, size = 132 }) {
  const [src, setSrc] = useState("");
  const scanUrl = useMemo(() => getTableScanUrl(table._id), [table._id]);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(scanUrl, {
      width: size,
      margin: 1,
      color: {
        dark: "#14211f",
        light: "#ffffff"
      }
    }).then((url) => {
      if (!cancelled) setSrc(url);
    });

    return () => {
      cancelled = true;
    };
  }, [scanUrl, size]);

  return (
    <a
      href={scanUrl}
      className="block rounded-lg border border-slate-200 bg-white p-2 transition hover:border-leaf"
      aria-label={`Open scan link for ${table.tableNumber}`}
    >
      {src ? (
        <img
          src={src}
          alt={`QR code for ${table.tableNumber}`}
          className="mx-auto aspect-square rounded-md"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="flex aspect-square items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-500"
          style={{ width: size, height: size }}
        >
          QR
        </div>
      )}
    </a>
  );
}
