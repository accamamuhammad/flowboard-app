"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LayoutGrid, Star, Plus, Settings } from "lucide-react";
import type { Board } from "@/types/flowboard";

const BOARD_COLORS = ["#c8862a", "#3a7d5c", "#2d5f8a", "#b94040", "#7a5da8"];
function getBoardColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffffffff;
  return BOARD_COLORS[Math.abs(hash) % BOARD_COLORS.length];
}

interface SidebarProps {
  boards: Board[];
  isOpen: boolean;
  onClose: () => void;
  onNewBoard?: () => void;
}

const S = {
  bg:        "#1a1714",
  border:    "rgba(255,255,255,0.08)",
  divider:   "rgba(255,255,255,0.07)",
  label:     "rgba(247,243,238,0.28)",
  text:      "rgba(247,243,238,0.55)",
  paper:     "#f7f3ee",
  board:     "rgba(247,243,238,0.45)",
  user:      "rgba(247,243,238,0.70)",
  activeBg:  "#c8862a",
  activeText:"#1a1714",
  hoverBg:   "rgba(255,255,255,0.07)",
};

// Starred board IDs stored in localStorage
function useStarredBoards() {
  const [starred, setStarred] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fb_starred");
      if (saved) setStarred(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function toggleStar(boardId: string) {
    setStarred(prev => {
      const next = new Set(prev);
      next.has(boardId) ? next.delete(boardId) : next.add(boardId);
      try { localStorage.setItem("fb_starred", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  return { starred, toggleStar };
}

export default function Sidebar({ boards, isOpen, onClose, onNewBoard }: SidebarProps) {
  const pathname           = usePathname();
  
  const { starred, toggleStar } = useStarredBoards();
  const displayName = "My Workspace";

  useEffect(() => { onClose(); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const NAV_ITEMS = [
    { label: "All Boards", icon: LayoutGrid, href: "/boards"  },
    { label: "Starred",    icon: Star,        href: "/starred" },
    { label: "New Board",  icon: Plus,        href: null, action: onNewBoard },
    { label: "Settings",   icon: Settings,    href: "/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(26,23,20,0.4)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full flex flex-col overflow-y-auto lg:static lg:z-auto lg:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ width: 200, minWidth: 200, background: S.bg, paddingTop: 28, paddingBottom: 24 }}
      >
        {/* Logo */}
        <div style={{ padding: "0 24px 24px", borderBottom: `1px solid ${S.border}`, marginBottom: 20 }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 600, color: S.paper, letterSpacing: "-0.3px" }}>
            Flowboard
          </div>
          <div style={{ fontSize: 10.5, color: S.label, marginTop: 2, letterSpacing: "0.04em" }}>
            Task &amp; board manager
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "0 14px", marginBottom: 8 }}>
          <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", color: S.label, padding: "0 10px", marginBottom: 6 }}>
            Menu
          </div>
          {NAV_ITEMS.map(({ label, icon: Icon, href, action }) => {
            const active = href ? pathname === href : false;
            const el = (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-[7px] select-none transition-colors duration-150"
                style={{ padding: "8px 10px", fontSize: 13, background: active ? S.activeBg : "transparent", color: active ? S.activeText : S.text, fontWeight: active ? 600 : 400, cursor: "pointer" }}
                onClick={action ?? undefined}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = S.hoverBg; e.currentTarget.style.color = S.paper; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.text; } }}
              >
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </div>
            );
            return href ? <Link key={label} href={href} style={{ textDecoration: "none" }}>{el}</Link> : el;
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: S.divider, margin: "14px 24px" }} />

        {/* Board list */}
        <div style={{ padding: "0 14px", flex: 1, overflowY: "auto" }}>
          <div className="flex items-center justify-between" style={{ padding: "0 10px", marginBottom: 6 }}>
            <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", color: S.label }}>Boards</span>
            {boards.length > 0 && <span style={{ fontSize: 9.5, color: S.label }}>{boards.length}</span>}
          </div>

          {boards.length === 0 ? (
            <div style={{ padding: "8px 10px", fontSize: 12, color: S.label, fontStyle: "italic" }}>No boards yet</div>
          ) : (
            boards.map((board) => {
              const active    = pathname === `/boards/${board.id}`;
              const isStarred = starred.has(board.id);
              return (
                <div key={board.id} className="group/sb flex items-center gap-0 rounded-[7px] overflow-hidden"
                  style={{ background: active ? "rgba(255,255,255,0.09)" : "transparent" }}>
                  <Link
                    href={`/boards/${board.id}`}
                    className="flex items-center gap-2.5 flex-1 overflow-hidden transition-colors duration-150"
                    style={{ padding: "6px 6px 6px 10px", fontSize: 12.5, color: active ? S.paper : S.board, textDecoration: "none", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = S.paper; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = S.board; }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: getBoardColor(board.id), flexShrink: 0 }} />
                    <span className="truncate">{board.name}</span>
                  </Link>

                  {/* Star toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); toggleStar(board.id); }}
                    className="opacity-0 group-hover/sb:opacity-100 transition-opacity flex-shrink-0"
                    style={{ padding: "6px 8px", border: "none", background: "transparent", cursor: "pointer", color: isStarred ? "#c8862a" : "rgba(247,243,238,0.35)", display: "flex", alignItems: "center" }}
                    title={isStarred ? "Unstar" : "Star"}
                  >
                    <Star size={11} fill={isStarred ? "#c8862a" : "none"} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* User footer */}
        <div style={{ padding: "14px 14px 0", borderTop: `1px solid ${S.divider}` }}>
          <div className="flex items-center gap-2.5 w-full rounded-[7px] transition-colors duration-150"
            style={{ padding: "8px 10px" }}
            onMouseEnter={e => (e.currentTarget.style.background = S.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c8862a", color: "#1a1714", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              F
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="truncate" style={{ fontSize: 12.5, color: S.user, fontWeight: 500 }}>{displayName}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}