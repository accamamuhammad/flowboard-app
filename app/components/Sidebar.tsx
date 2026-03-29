"use client";

// src/components/Sidebar.tsx
// - Desktop (≥1024px): always visible, static in layout
// - Tablet (<1024px): hidden by default, slides in as overlay when open
//   controlled via `isOpen` + `onClose` props passed from the page

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { boardColors } from "@/lib/boardColors";
import type { Board } from "@/types/flowboard";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

interface SidebarProps {
  boards: Board[];
  userName?: string;
  userInitials?: string;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "All Boards", icon: "⊞", href: "/boards" },
  { label: "Starred",    icon: "✦", href: "/starred" },
  { label: "Recent",     icon: "◷", href: "/recent" },
  { label: "My Tasks",   icon: "◈", href: "/tasks" },
];

export default function Sidebar({
  boards,
  userName = "Alex Okafor",
  userInitials = "AO",
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Close sidebar on route change (tablet)
  useEffect(() => { onClose(); }, [pathname]);

  // Lock body scroll when overlay is open on tablet
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Backdrop (tablet only) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full
          lg:static lg:z-auto lg:translate-x-0 lg:flex
          flex flex-col py-7 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ width: "200px", minWidth: "200px", background: "#1a1714" }}
      >
        {/* Logo */}
        <div className="px-6 pb-6 mb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="font-display text-xl font-semibold tracking-tight" style={{ color: "#f7f3ee" }}>
            Flowboard
          </div>
          <div className="text-[10.5px] mt-0.5 tracking-wider" style={{ color: "rgba(247,243,238,0.35)" }}>
            Task &amp; board manager
          </div>
        </div>

        {/* Main nav */}
        <div className="px-3.5 mb-2">
          <div className="text-[9.5px] uppercase tracking-widest px-2.5 mb-1.5"
            style={{ color: "rgba(247,243,238,0.28)" }}>
            Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] transition-colors duration-150 select-none"
                style={
                  active
                    ? { background: "#c8862a", color: "#1a1714", fontWeight: 600 }
                    : { color: "rgba(247,243,238,0.55)" }
                }
              >
                <span className="w-4 text-center text-sm">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-6 my-3.5" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

        {/* Board list */}
        <div className="px-3.5 flex-1 overflow-hidden">
          <div className="text-[9.5px] uppercase tracking-widest px-2.5 mb-1.5"
            style={{ color: "rgba(247,243,238,0.28)" }}>
            Boards
          </div>
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-[7px] text-[12.5px] transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ color: "rgba(247,243,238,0.45)" }}
            >
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{ background: boardColors[board.color].hex }}
              />
              {board.name}
            </Link>
          ))}
        </div>

      
      </aside>
    </>
  );
}