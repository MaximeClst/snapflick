import { saveAs } from "file-saver";
import ImageTracer from "imagetracerjs";
import { useCallback, useEffect, useRef, useState } from "react";
import BudgetCopainAd from "./components/BudgetCopainAd";
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
    <div className="min-h-screen flex flex-col bg-mesh text-ink-900">
      {/* Auto-promo Budget Copain */}
      <BudgetCopainAd side="left" />
      <BudgetCopainAd side="right" />

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-ink-200/60">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center">
          <a
            href="#top"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-none"
            aria-label="SnapFlick"
          >
            <span className="text-ink-900">Snap</span>
            <span className="text-gradient">Flick</span>
          </a>
        </div>
      </header>

      {/* Hero + Converter */}
      <main id="top" className="relative flex-1">
        <div
          className="absolute inset-0 bg-grid pointer-events-none"
          aria-hidden="true"
        />
        <section className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20">
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
                    snapflick.dev/convert
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
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-ink-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-ink-500">
          Made with{" "}
          <span className="text-accent-500" aria-label="amour">
            ♥
          </span>{" "}
          by{" "}
          <a
            href="https://code-celeste.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink-800 underline-offset-4 hover:text-brand-700 hover:underline transition-colors"
          >
            Code Celeste
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
