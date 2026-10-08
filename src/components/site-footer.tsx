import Image from "next/image";
import Link from "next/link";
import { navItems, wedding } from "@/content/wedding";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Image
          className="footer-mark"
          src="/images/monogram.png"
          alt=""
          width={632}
          height={468}
          sizes="96px"
        />
        <p className="footer-names">{wedding.couple}</p>
        <p className="footer-when">
          {wedding.dateLabel} <span aria-hidden="true">·</span> {wedding.venueShort}
        </p>
        <p className="footer-address">{wedding.address}</p>
        <ul className="footer-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p className="footer-note">
          Questions? Start with the <Link href="/faq">FAQ</Link>, or reach out to either of us
          anytime.
        </p>
      </div>
    </footer>
  );
}
