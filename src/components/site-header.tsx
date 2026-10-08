"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, navLeft, navRight, type NavItem } from "@/content/wedding";

function NavLinks({ items, className }: { items: NavItem[]; className: string }) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="nav-link"
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.documentElement.dataset.menu = "open";
    window.addEventListener("keydown", onKey);
    return () => {
      delete document.documentElement.dataset.menu;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="masthead" data-solid={solid || undefined}>
      <nav className="nav-bar" aria-label="Primary">
        <NavLinks items={navLeft} className="nav-group nav-group--left" />
        <Link href="/" className="nav-logo-link" aria-label="Home">
          <Image
            src="/images/monogram.png"
            alt=""
            width={632}
            height={468}
            priority
            className="nav-logo"
          />
        </Link>
        <NavLinks items={navRight} className="nav-group nav-group--right" />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </nav>

      <div
        className="menu-sheet"
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={menuOpen || undefined}
        inert={!menuOpen}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <button type="button" className="menu-close" onClick={() => setMenuOpen(false)}>
          Close
        </button>
        <NavLinks items={[{ href: "/", label: "Home" }, ...navItems]} className="menu-links" />
      </div>
    </header>
  );
}
