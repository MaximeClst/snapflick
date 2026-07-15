import mascot from "../assets/budget-copain.png";

const AD_URL = "https://budgetcopain.com";

const VARIANTS = {
  left: {
    hook: "Sache enfin où part ton argent.",
    sub: "Suis tes dépenses en 2 taps.",
    cta: "Télécharger",
  },
  right: {
    hook: "Ton budget, sans prise de tête.",
    sub: "Gratuit, privé, sur iOS.",
    cta: "Découvrir",
  },
};

/**
 * Bannière verticale d'auto-promo (skyscraper) pour Budget Copain.
 * Fixée sur le côté, visible uniquement sur très grands écrans.
 */
export default function BudgetCopainAd({ side = "left" }) {
  const v = VARIANTS[side] ?? VARIANTS.left;
  const posClass = side === "left" ? "left-5" : "right-5";

  return (
    <a
      href={AD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Budget Copain — application de budget sur iOS (publicité)"
      className={[
        "group hidden 2xl:flex fixed top-1/2 -translate-y-1/2 z-30",
        posClass,
        "w-[168px] flex-col overflow-hidden rounded-[26px]",
        "bg-linear-to-b from-[#6366f1] to-[#8b5cf6] text-white",
        "shadow-[0_20px_50px_-15px_rgba(99,102,241,0.6)] ring-1 ring-white/15",
        "transition duration-300 hover:-translate-y-[calc(50%+4px)] hover:shadow-[0_28px_60px_-15px_rgba(99,102,241,0.75)]",
      ].join(" ")}
    >
      {/* Label honnête */}
      <span className="absolute top-3 right-3 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
        Pub
      </span>

      {/* Mascotte */}
      <div className="relative flex justify-center px-5 pt-9">
        <div className="absolute inset-x-6 top-10 h-20 rounded-full bg-white/25 blur-2xl" />
        <img
          src={mascot}
          alt="Mascotte Budget Copain"
          className="relative h-24 w-24 drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]"
        />
      </div>

      {/* Texte */}
      <div className="px-5 pb-5 pt-3 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Budget Copain
        </div>
        <p className="mt-2 text-[15px] font-bold leading-snug tracking-tight">
          {v.hook}
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/75">
          {v.sub}
        </p>

        <span className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[12px] font-semibold text-[#4f46e5] transition group-hover:gap-2.5">
          {v.cta}
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path
              d="M5 10h10M11 6l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-white/60">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
            <path d="M16.4 12.9c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.8.8-3.5 2.1-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.1 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.2-2.4-.1 0-2.3-.9-2.3-3.5zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
          </svg>
          Gratuit sur iOS
        </div>
      </div>
    </a>
  );
}
