"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/status", label: "Status" },
  { href: "/settings", label: "Settings" },
];

export default function Nav() {
  const path = usePathname();

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      gap: "24px",
      padding: "16px 32px",
      borderBottom: "1px solid var(--border)",
      background: "var(--surface)",
    }}>
      <span style={{ fontWeight: 600, letterSpacing: "0.05em", color: "var(--accent)", marginRight: 8 }}>
        Elizabeth
      </span>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            color: path === href ? "var(--accent)" : "var(--muted)",
            fontWeight: path === href ? 600 : 400,
            fontSize: 14,
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
