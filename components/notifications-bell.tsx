"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { NotificationInboxResponse, NotificationItem } from "@/types/notifications";

function formatRelative(value: string): string {
  const timestamp = new Date(value).getTime();
  const deltaMs = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(deltaMs / (60 * 1000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadNotifications() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notifications", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) return;
      const payload = (await response.json()) as NotificationInboxResponse;
      setItems(payload.items);
      setUnreadCount(payload.unreadCount);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadNotifications();
    const intervalId = window.setInterval(() => void loadNotifications(), 45_000);
    return () => window.clearInterval(intervalId);
  }, []);

  async function markRead(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "read" } : item))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const response = await fetch("/api/notifications", {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      void loadNotifications();
    }
  }

  async function markAllRead() {
    try {
      setIsMarkingAll(true);
      setItems((prev) => prev.map((item) => ({ ...item, status: "read" })));
      setUnreadCount(0);

      const response = await fetch("/api/notifications", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (!response.ok) {
        void loadNotifications();
      }
    } finally {
      setIsMarkingAll(false);
    }
  }

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="apple-ghost-btn relative inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--db-text)]"
        onClick={() => setIsOpen((value) => !value)}
        type="button"
      >
        <svg
          aria-hidden
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--db-accent)] px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-30 w-[min(92vw,360px)] rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)]/95 p-2 shadow-[var(--db-shadow)] backdrop-blur-md">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--db-muted)]">Notifications</p>
            <button
              className="text-xs text-[var(--db-muted)] transition-colors hover:text-[var(--db-text)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isMarkingAll || unreadCount === 0}
              onClick={() => void markAllRead()}
              type="button"
            >
              Mark all read
            </button>
          </div>

          <div className="mt-1 max-h-[420px] overflow-y-auto pr-1">
            {isLoading ? (
              <p className="px-2 py-3 text-sm text-[var(--db-muted)]">Loading notifications...</p>
            ) : !hasItems ? (
              <p className="px-2 py-3 text-sm text-[var(--db-muted)]">No notifications yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <div
                      className={`rounded-xl border px-3 py-2.5 transition-colors ${
                        item.status === "unread"
                          ? "border-[color-mix(in_oklab,var(--db-accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--db-accent)_8%,transparent)]"
                          : "border-[var(--db-border)] bg-[var(--db-surface-subtle)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--db-text)]">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-[var(--db-muted)]">{item.body}</p>
                        </div>
                        <span className="whitespace-nowrap text-[11px] text-[var(--db-muted)]">
                          {formatRelative(item.createdAt)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        {item.ctaUrl ? (
                          <Link
                            className="text-xs font-medium text-[var(--db-accent)] transition-colors hover:text-[var(--db-text)]"
                            href={item.ctaUrl}
                            onClick={() => setIsOpen(false)}
                          >
                            Open
                          </Link>
                        ) : null}
                        {item.status === "unread" ? (
                          <button
                            className="text-xs text-[var(--db-muted)] transition-colors hover:text-[var(--db-text)]"
                            onClick={() => void markRead(item.id)}
                            type="button"
                          >
                            Mark read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
