import { useEffect } from "react";
import maxime from "../assets/maxime.png";

const AD_URL = "https://budgetcopain.com";

const REVIEWS = [
  {
    name: "Elo419",
    text: "J'adore utiliser cette app, je fais déjà mon budget sur papier, mais là c'est vraiment plus rapide !! Merci 🙏",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    name: "Carlos_974",
    text: "Je recommande Budget Copain pour celles et ceux qui aiment suivre leurs dépenses 💰",
    gradient: "from-indigo-400 to-violet-500",
  },
  {
    name: "PSG-75",
    text: "J'étais ravi de connaître Budget Copain, ça m'aide beaucoup pour gérer mon budget. Très intéressant !",
    gradient: "from-sky-400 to-blue-500",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label="5 étoiles sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 14.9 4.8 17.7l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Modal d'auto-promo "founder" affichée après un téléchargement réussi.
 * Présente Maxime + son app Budget Copain avec des avis utilisateurs.
 */
export default function AuthorPromoModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 animate-overlay-in bg-ink-900/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Message de Maxime, créateur de SnapFlick"
    >
      <div
        className="relative my-auto w-full max-w-md animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo + petit mot manuscrit */}
        <div className="relative z-0 flex items-end justify-center gap-3 px-6">
          <img
            src={maxime}
            alt="Maxime, créateur de SnapFlick"
            className="h-32 w-32 rounded-3xl object-cover object-top shadow-xl ring-4 ring-white/70 sm:h-36 sm:w-36"
          />
          <p
            className="mb-11 text-left text-xl leading-tight text-ink-800 sm:text-2xl"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            Hey, c'est Maxime !<br />
            J'ai créé SnapFlick
          </p>
        </div>

        {/* Carte principale */}
        <div className="relative z-10 -mt-8 rounded-3xl bg-white p-6 ring-soft sm:p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <h2 className="pr-8 text-xl font-bold tracking-tight text-ink-900">
            Reprends le contrôle de ton budget 💸
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
            J'ai aussi créé <span className="font-semibold text-ink-900">Budget Copain</span>,
            une application mobile qui t'aide à avoir une vraie vision sur tes dépenses —
            simple, privée, et sans prise de tête.
          </p>

          <a
            href={AD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(99,102,241,0.7)] transition hover:brightness-110 active:scale-[0.99]"
          >
            Découvrir Budget Copain
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M5 10h10M11 6l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Avis utilisateurs */}
        <div className="relative z-0 -mt-3 overflow-hidden rounded-b-3xl bg-ink-50 pt-4 shadow-[0_20px_40px_-20px_rgba(11,10,26,0.35)]">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className={[
                "flex items-start gap-3 px-6 py-3.5",
                i % 2 === 1 ? "bg-white/60" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-linear-to-br text-sm font-bold text-white",
                  r.gradient,
                ].join(" ")}
                aria-hidden="true"
              >
                {r.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-800">{r.name}</span>
                  <Stars />
                </div>
                <p className="mt-1 text-[13px] leading-snug text-ink-600">"{r.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
