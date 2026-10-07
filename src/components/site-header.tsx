"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLeft, navRight, type NavItem } from "@/content/wedding";

function NavLinks({ items, side }: { items: NavItem[]; side: "left" | "right" }) {
  const pathname = usePathname();
  return (
    <ul className={`nav-group ${side}`}>
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
  return (
    <header className="masthead">
      <nav className="nav-bar" aria-label="Primary">
        <NavLinks items={navLeft} side="left" />
        <Link href="/" className="nav-logo-link" aria-label="Home">
          <Image
            src="/images/logo.png"
            alt=""
            width={640}
            height={592}
            priority
            className="nav-logo"
          />
        </Link>
        <NavLinks items={navRight} side="right" />
      </nav>
    </header>
  );
}
