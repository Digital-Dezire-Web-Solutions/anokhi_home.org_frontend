import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./BottomNav.css";

/* One-path icons (stroke style) so no extra icon imports are needed. */
const Icon = ({ d }) => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

/* TODO: match every `to` with the routes in your router.
   Known from your app: /dashboard, /management, /bookings, /commission, /offers-discounts */
const MENU = [
  { label: "Dashboard", to: "/dashboard", d: "M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" },
  { label: "Leads", to: "/management", d: "M3 3v18h18M7 15l4-4 3 3 5-6" },
  { label: "Site Visits", to: "/site-visits", d: "M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Plots", to: "/plot", d: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { label: "Bookings", to: "/bookings", d: "M6 3h12v18l-6-4-6 4z" },
  { label: "Transactions", group: "tx", d: "M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h2" },
  { label: "Users", to: "/user", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6" },
  { label: "Teams", to: "/teams", d: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a3 3 0 1 0 0-6M17 15c3 0 4 2 4 5" },
  { label: "Commission", to: "/commission", d: "M19 5L5 19M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { label: "Offers", to: "/offers-discounts", d: "M3 12V3h9l9 9-9 9zM7.5 7.5h.01" },
  { label: "Settings", to: "/settings", d: "M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4" },
];

const TRANSACTIONS = [
  { label: "Payments", to: "/payments" },
  { label: "Income", to: "/income" },
  { label: "Expense", to: "/expense" },
  { label: "Payout", to: "/payout" },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const [txOpen, setTxOpen] = useState(false);
  const txRef = useRef(null);
  const txActive = TRANSACTIONS.some((t) => pathname.startsWith(t.to));

  useEffect(() => setTxOpen(false), [pathname]);

  useEffect(() => {
    const close = (e) => {
      if (txRef.current && !txRef.current.contains(e.target)) setTxOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <div className="bn-spacer" />
      <nav className="bn" aria-label="Main menu">
        <div className="bn-scroll">
          {MENU.map((item) =>
            item.group === "tx" ? (
              <div className="bn-tx" ref={txRef} key={item.label}>
                <button
                  type="button"
                  className={`bn-item ${txActive || txOpen ? "active" : ""}`}
                  aria-expanded={txOpen}
                  onClick={() => setTxOpen((v) => !v)}
                >
                  <Icon d={item.d} />
                  {item.label}
                </button>
                {txOpen && (
                  <div className="bn-pop">
                    {TRANSACTIONS.map((t) => (
                      <NavLink
                        key={t.to}
                        to={t.to}
                        className={({ isActive }) =>
                          "bn-pop-link" + (isActive ? " active" : "")
                        }
                      >
                        {t.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => "bn-item" + (isActive ? " active" : "")}
              >
                <Icon d={item.d} />
                {item.label}
              </NavLink>
            ),
          )}
        </div>
      </nav>
    </>
  );
}