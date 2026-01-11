import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      <div
        className={cx(
          "fixed inset-0 z-40 bg-black/40 transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cx(
          "fixed z-50 bg-white shadow-2xl transition-transform",
          isMobile ? "inset-0 rounded-none" : "top-0 right-0 h-full w-[520px] max-w-[92vw] rounded-l-2xl",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{title}</h2>
            <p className="text-xs text-neutral-500">Upload images + save URLs automatically.</p>
          </div>
          <button
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-neutral-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className={cx("h-[calc(100%-56px)] overflow-auto", isMobile && "pb-24")}>
          {children}
        </div>
      </div>
    </>
  );
}
