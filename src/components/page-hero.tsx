import Image from "next/image";

export function PageHero({
  title,
  lede,
  eyebrow,
  compact,
}: {
  title: string;
  lede?: string;
  eyebrow?: string;
  compact?: boolean;
}) {
  return (
    <header className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <Image
        className="hero-photo"
        src="/images/background.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className="page-hero-content">
        {eyebrow && <p className="eyebrow eyebrow--light">{eyebrow}</p>}
        <h1 className="page-hero-title">{title}</h1>
        {lede && <p className="page-hero-lede">{lede}</p>}
      </div>
    </header>
  );
}
