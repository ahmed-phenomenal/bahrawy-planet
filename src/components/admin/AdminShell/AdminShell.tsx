"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookPlus,
  CalendarCheck,
  CalendarClock,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import "../admin-common.css";
import "./AdminShell.css";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Add Book", href: "/admin/promotions", icon: BookPlus },
  { label: "Sales", href: "/admin/sales", icon: ShoppingCart },
  { label: "Stock", href: "/admin/stock", icon: Package },
  { label: "Employees", href: "/admin/employees", icon: UserPlus },
  { label: "Attendance", href: "/admin/attendance", icon: CalendarCheck },
  { label: "Schedule", href: "/admin/schedule", icon: CalendarClock },
  { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false); // desktop
  const [open, setOpen] = useState(false); // mobile
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => {
    setCollapsed((c) => !c);
    setOpen((o) => !o);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="adm-root">
      <header className="adm-topbar">
        <div className="adm-topbar-left">
          <button
            className="adm-burger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <Menu size={26} />
          </button>
          <Link href="/admin" className="adm-brand">
            <Image src="/logo.png" alt="Logo" width={36} height={36} />
            <span>Bahrawy Planet Admin</span>
          </Link>
        </div>

        <div className="adm-topbar-right">
          <ThemeToggle />
          <button className="adm-logout" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div
        className={`adm-overlay ${open ? "open" : ""}`}
        onClick={() => {
          setOpen(false);
          setCollapsed(false);
        }}
      />

      <aside
        className={`adm-sidebar ${collapsed ? "collapsed" : ""} ${
          open ? "open" : ""
        }`}
      >
        <nav>
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`adm-nav-link ${active ? "active" : ""}`}
                onClick={() => {
                  setOpen(false);
                  setCollapsed(false);
                }}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={`adm-content ${collapsed ? "full" : ""}`}>{children}</div>
    </div>
  );
}