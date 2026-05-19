import { saveAs } from "file-saver";
import ImageTracer from "imagetracerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

const FORMATS = [
  { value: "png", label: "PNG", hint: "Transparence" },
  { value: "jpeg", label: "JPEG", hint: "Photo · léger" },
  { value: "webp", label: "WebP", hint: "Web · ultra léger" },
  { value: "gif", label: "GIF", hint: "Animation" },
  { value: "tiff", label: "TIFF", hint: "Print · HD" },
  { value: "svg", label: "SVG", hint: "Vectoriel" },
];

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("webp");
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [justConverted, setJustConverted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!justConverted) return;
    const t = setTimeout(() => setJustConverted(false), 2200);
    return () => clearTimeout(t);
  }, [justConverted]);

  const handleFiles = useCallback((files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Merci de sélectionner une image.");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (event) => handleFiles(event.target.files);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const getFileNameWithoutExtension = (fileName) =>
    fileName.replace(/\.[^/.]+$/, "");

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  const convertImage = async () => {
    if (!selectedFile) {
      inputRef.current?.focus();
      return;
    }
    setIsConverting(true);
    const originalFileName = getFileNameWithoutExtension(selectedFile.name);

    if (outputFormat === "svg") {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const options = {
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            colorsampling: 0,
            numberofcolors: 2,
            mincolorratio: 0,
            colorquantcycles: 3,
            layering: 0,
            strokewidth: 1,
            linefilter: false,
            scale: 1,
            roundcoords: 1,
            viewbox: false,
            desc: false,
            lcpr: 0,
            qc: false,
            blurradius: 0,
            blurdelta: 20,
          };
          ImageTracer.imageToSVG(
            e.target.result,
            (svgstr) => {
              const blob = new Blob([svgstr], { type: "image/svg+xml" });
              saveAs(blob, `${originalFileName}.svg`);
              setIsConverting(false);
              setJustConverted(true);
            },
            options,
          );
        };
        reader.readAsDataURL(selectedFile);
        return;
      } catch (error) {
        console.error("Erreur lors de la conversion en SVG:", error);
        alert("Erreur lors de la conversion en SVG");
        setIsConverting(false);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      const blob = dataURItoBlob(reader.result);
      saveAs(blob, `${originalFileName}.${outputFormat}`);
      setIsConverting(false);
      setJustConverted(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-mesh text-ink-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-ink-200/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 group">
            <span className="relative h-8 w-8 rounded-xl bg-linear-to-br from-brand-600 via-brand-500 to-accent-500 grid place-items-center shadow-md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-white"
                aria-hidden="true"
              >
                <path
                  d="M4 7h4l2-3h4l2 3h4v12H4V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="font-semibold tracking-tight text-ink-900">
              SnapFlick
            </span>
          </a>
          <nav className="hidden sm:flex items-center gap-7 text-sm text-ink-600">
            <a
              href="#features"
              className="hover:text-ink-900 transition-colors"
            >
              Fonctionnalités
            </a>
            <a href="#how" className="hover:text-ink-900 transition-colors">
              Comment ça marche
            </a>
            <a href="#faq" className="hover:text-ink-900 transition-colors">
              FAQ
            </a>
          </nav>
          <a
            href="#converter"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-700 transition-colors"
          >
            Convertir
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill="none"
              aria-hidden="true"
            >
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
      </header>

      {/* Hero + Converter */}
      <main id="top" className="relative">
        <div
          className="absolute inset-0 bg-grid pointer-events-none"
          aria-hidden="true"
        />
        <section className="relative mx-auto max-w-6xl px-6 pt-14 pb-10 sm:pt-20 sm:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            {/* Left: Pitch */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white/80 backdrop-blur px-3 py-1 text-xs font-medium text-ink-600 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                100% local · aucune image n'est uploadée
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Convertissez vos images <br className="hidden sm:block" />
                <span className="text-gradient">en un éclair.</span>
              </h1>
              <p className="mt-5 text-lg text-ink-600 max-w-xl leading-relaxed">
                PNG, JPEG, WebP, GIF, TIFF, SVG — glissez, déposez, téléchargez.
                Sans inscription, sans filigrane, sans envoyer vos fichiers sur
                un serveur.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#converter"
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-brand-600 to-accent-500 text-white px-6 py-3 text-sm font-semibold glow-cta hover:brightness-110 transition active:scale-[0.98]"
                >
                  Convertir une image — gratuit
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 10h10M11 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-ink-200 text-ink-800 px-5 py-3 text-sm font-medium hover:border-ink-300 transition"
                >
                  Voir comment ça marche
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { k: "0", s: "fichier envoyé" },
                  { k: "<2s", s: "temps moyen" },
                  { k: "6", s: "formats" },
                ].map((t) => (
                  <div key={t.s} className="text-center">
                    <div className="text-2xl font-semibold tracking-tight text-ink-900">
                      {t.k}
                    </div>
                    <div className="text-xs text-ink-500 mt-0.5">{t.s}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Converter card */}
            <div id="converter" className="relative">
              <div
                className="absolute -inset-6 bg-linear-to-tr from-brand-200/40 via-accent-200/30 to-amber-200/30 blur-2xl rounded-4xl -z-10"
                aria-hidden="true"
              />
              <div className="relative rounded-3xl bg-white ring-soft p-6 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-ink-500">
                    snapflick.app/convert
                  </span>
                </div>

                {/* Dropzone */}
                <label
                  htmlFor="file"
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={[
                    "relative block rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition",
                    isDragging
                      ? "border-brand-500 bg-brand-50"
                      : "border-ink-200 bg-ink-50/60 hover:border-brand-400 hover:bg-brand-50/40",
                  ].join(" ")}
                >
                  <input
                    ref={inputRef}
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {preview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <img
                          src={preview}
                          alt="Aperçu de l'image sélectionnée"
                          className="max-h-44 rounded-xl shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            reset();
                          }}
                          aria-label="Retirer l'image"
                          className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-ink-900 text-white grid place-items-center shadow-md hover:bg-ink-700"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            className="h-3.5 w-3.5"
                            fill="none"
                          >
                            <path
                              d="M5 5l10 10M15 5L5 15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-ink-700 font-medium truncate max-w-[18rem]">
                        {selectedFile?.name}
                      </div>
                      <div className="text-xs text-ink-500">
                        Cliquez pour changer · ou glissez une autre image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-brand-500 to-accent-500 grid place-items-center text-white shadow-md animate-float">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-6 w-6"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 16V4m0 0L7 9m5-5l5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-ink-900">
                          Glissez votre image ici
                        </div>
                        <div className="text-sm text-ink-500 mt-0.5">
                          ou{" "}
                          <span className="text-brand-700 underline underline-offset-2">
                            parcourez vos fichiers
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-ink-400">
                        PNG · JPEG · WebP · GIF · TIFF · SVG — jusqu'à ~25 Mo
                      </div>
                    </div>
                  )}
                </label>

                {/* Format chips */}
                <div className="mt-5">
                  <div className="text-xs font-medium text-ink-500 mb-2">
                    Format de sortie
                  </div>
                  <div
                    role="radiogroup"
                    aria-label="Format de sortie"
                    className="grid grid-cols-3 sm:grid-cols-6 gap-2"
                  >
                    {FORMATS.map((f) => {
                      const active = outputFormat === f.value;
                      return (
                        <button
                          key={f.value}
                          role="radio"
                          aria-checked={active}
                          onClick={() => setOutputFormat(f.value)}
                          className={[
                            "relative rounded-xl px-2.5 py-2 text-xs font-semibold border transition",
                            active
                              ? "bg-ink-900 text-white border-ink-900"
                              : "bg-white text-ink-700 border-ink-200 hover:border-ink-300",
                          ].join(" ")}
                          title={f.hint}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Convert button */}
                <button
                  onClick={convertImage}
                  disabled={!selectedFile || isConverting}
                  className={[
                    "mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition",
                    !selectedFile
                      ? "bg-ink-200 text-ink-500 cursor-not-allowed"
                      : "bg-linear-to-r from-brand-600 to-accent-500 text-white glow-cta hover:brightness-110 active:scale-[0.99]",
                  ].join(" ")}
                  aria-live="polite"
                >
                  {isConverting ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeOpacity="0.25"
                          strokeWidth="3"
                        />
                        <path
                          d="M22 12a10 10 0 0 1-10 10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Conversion en cours…
                    </>
                  ) : justConverted ? (
                    <>
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Téléchargé !
                    </>
                  ) : (
                    <>
                      Convertir en {outputFormat.toUpperCase()}
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M10 4v10m0 0l-4-4m4 4l4-4M4 18h12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-ink-500">
                  Conversion réalisée dans votre navigateur — vos fichiers ne
                  quittent jamais votre appareil.
                </p>
              </div>
            </div>
          </div>

          {/* Logo / press marquee */}
          <div className="mt-16 sm:mt-20">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-ink-500 mb-6">
              Adopté par les créateurs, freelances et équipes produit
            </p>
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent z-10" />
              <div className="flex gap-12 whitespace-nowrap animate-marquee">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-12 text-ink-400 font-semibold tracking-tight text-lg shrink-0"
                  >
                    <span>◆ Northwind</span>
                    <span>⬡ Lumen Studio</span>
                    <span>✱ Atelier 42</span>
                    <span>◐ Pixelhaus</span>
                    <span>▲ Forma</span>
                    <span>◇ Indie Loop</span>
                    <span>⬢ Maven</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="relative mx-auto max-w-6xl px-6 py-20"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-700 mb-3">
              Pourquoi SnapFlick
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Tout ce qu'il faut, rien de superflu.
            </h2>
            <p className="mt-4 text-ink-600 text-lg">
              Pensé pour les vraies vies créatives : rapide, privé, et sans
              friction. Aucune création de compte, aucun abonnement.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: "100% privé",
                desc: "Vos images restent sur votre appareil. Aucun upload, aucun tracking.",
                icon: (
                  <path
                    d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ),
              },
              {
                title: "Rapide comme l'éclair",
                desc: "Conversion locale instantanée — fini les files d'attente serveur.",
                icon: (
                  <path
                    d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ),
              },
              {
                title: "6 formats au choix",
                desc: "PNG, JPEG, WebP, GIF, TIFF et SVG vectoriel — un seul outil pour tout.",
                icon: (
                  <path
                    d="M4 7h16M4 12h16M4 17h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ),
              },
              {
                title: "Sans filigrane",
                desc: "Récupérez vos fichiers propres, prêts à l'emploi, en haute qualité.",
                icon: (
                  <path
                    d="M5 12l5 5 9-12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ),
              },
              {
                title: "Compatible partout",
                desc: "Fonctionne dans n'importe quel navigateur moderne, mobile inclus.",
                icon: (
                  <path
                    d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zm0 0h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    fill="none"
                  />
                ),
              },
              {
                title: "Gratuit, vraiment.",
                desc: "Sans inscription, sans limite cachée, sans email demandé.",
                icon: (
                  <path
                    d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                ),
              },
            ].map((f) => (
              <article
                key={f.title}
                className="group rounded-2xl bg-white p-6 ring-soft hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                <div className="h-11 w-11 rounded-xl bg-linear-to-br from-brand-100 to-accent-100 text-brand-700 grid place-items-center mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-linear-to-br from-ink-900 via-ink-800 to-brand-900 text-white p-8 sm:p-12 overflow-hidden relative">
            <div
              className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative max-w-2xl">
              <p className="text-sm font-semibold text-brand-300 mb-3">
                3 étapes
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                D'une image source au fichier parfait.
              </h2>
              <p className="mt-3 text-ink-300 text-lg">
                Pas de tutoriel, pas de paramètres obscurs. Trois clics, c'est
                tout.
              </p>
            </div>

            <ol className="relative mt-10 grid md:grid-cols-3 gap-5">
              {[
                {
                  n: "01",
                  t: "Déposez",
                  d: "Glissez votre image, ou cliquez pour la sélectionner.",
                },
                {
                  n: "02",
                  t: "Choisissez",
                  d: "Sélectionnez le format de sortie idéal (PNG, WebP, SVG…).",
                },
                {
                  n: "03",
                  t: "Téléchargez",
                  d: "On convertit en local et le fichier arrive directement.",
                },
              ].map((s) => (
                <li
                  key={s.n}
                  className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-6"
                >
                  <div className="text-sm font-semibold text-brand-300">
                    {s.n}
                  </div>
                  <div className="mt-3 text-xl font-semibold">{s.t}</div>
                  <p className="mt-1.5 text-sm text-ink-300 leading-relaxed">
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>

            <div className="relative mt-10">
              <a
                href="#converter"
                className="inline-flex items-center gap-2 rounded-full bg-white text-ink-900 px-6 py-3 text-sm font-semibold hover:bg-ink-100 transition"
              >
                Essayer maintenant — c'est gratuit
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
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
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-brand-700 mb-3">
              Ils l'utilisent au quotidien
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Aimé par les créateurs exigeants.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                q: "Le seul convertisseur que j'ai en favoris. Rapide, propre, sans pub.",
                n: "Léa M.",
                r: "Designer produit",
              },
              {
                q: "Enfin un outil qui ne m'oblige pas à créer un compte pour 3 PNG.",
                n: "Karim B.",
                r: "Développeur freelance",
              },
              {
                q: "Le fait que tout se passe en local me rassure pour les visuels clients.",
                n: "Sophie D.",
                r: "Directrice artistique",
              },
            ].map((t) => (
              <figure key={t.n} className="rounded-2xl bg-white p-6 ring-soft">
                <div
                  className="flex gap-0.5 text-amber-400 mb-3"
                  aria-label="5 sur 5"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <svg
                      key={i}
                      viewBox="0 0 20 20"
                      className="h-4 w-4 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 14.9 4.8 17.7l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-ink-800 leading-relaxed">
                  "{t.q}"
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <div className="font-semibold text-ink-900">{t.n}</div>
                  <div className="text-ink-500">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative mx-auto max-w-3xl px-6 py-20">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-brand-700 mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Vos questions, nos réponses.
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Mes images sont-elles vraiment privées ?",
                a: "Oui. Tout se passe dans votre navigateur — aucune image n'est envoyée sur un serveur. Vous pouvez même couper le Wi-Fi avant de convertir.",
              },
              {
                q: "Y a-t-il une limite de taille ou de nombre ?",
                a: "Pas de quota artificiel. La limite dépend simplement de la mémoire de votre appareil (en général jusqu'à ~25 Mo sans problème).",
              },
              {
                q: "Le format SVG, ça fonctionne comment ?",
                a: "SnapFlick vectorise vos images bitmap en SVG (idéal pour des logos ou pictos simples). Pour des photos complexes, préférez WebP ou PNG.",
              },
              {
                q: "Combien ça coûte ?",
                a: "Rien. Pas d'inscription, pas d'abonnement, pas de version « premium » cachée.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-white ring-soft p-5 open:shadow-md transition"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="font-medium text-ink-900">{item.q}</span>
                  <span className="h-7 w-7 rounded-full bg-ink-100 grid place-items-center text-ink-600 transition group-open:rotate-45 group-open:bg-brand-100 group-open:text-brand-700">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-3.5 w-3.5"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-600 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-3xl bg-linear-to-br from-brand-600 via-brand-500 to-accent-500 text-white p-10 sm:p-14 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 bg-grid opacity-30"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl mx-auto">
                Prêt à convertir votre première image en moins de 5 secondes ?
              </h2>
              <p className="mt-4 text-white/90 max-w-xl mx-auto">
                Sans inscription, sans email, sans filigrane. Juste un fichier
                propre, livré directement.
              </p>
              <a
                href="#converter"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-ink-900 px-7 py-3.5 text-sm font-semibold hover:bg-ink-100 transition"
              >
                Lancer la conversion
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-500">
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded-lg bg-linear-to-br from-brand-600 to-accent-500"
              aria-hidden="true"
            />
            <span className="text-ink-700 font-medium">SnapFlick</span>
            <span>· Convertisseur d'images privé</span>
          </div>
          <div>© {new Date().getFullYear()} — Fait avec soin.</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
