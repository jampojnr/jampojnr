import { useEffect, useRef, useState } from "react";
import { LANGUAGES, HAZARD_SUMMARIES, MODE_LABELS } from "@/data/translations";

export const AccessibilityEngine = ({ hazard, locationLabel }) => {
  const [langId, setLangId] = useState("en");
  const [mode, setMode] = useState("text");
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  const summary = HAZARD_SUMMARIES[hazard.id][langId];
  const lang = LANGUAGES.find((l) => l.id === langId);

  const stopAudio = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    clearTimeout(timerRef.current);
    setPlaying(false);
  };

  const playAudio = () => {
    if (playing) return stopAudio();
    setPlaying(true);
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(summary);
      u.lang = lang.speech;
      u.rate = 0.95;
      u.onend = () => setPlaying(false);
      window.speechSynthesis.speak(u);
    }
    timerRef.current = setTimeout(() => setPlaying(false), 15000);
  };

  useEffect(() => () => stopAudio(), []);
  useEffect(() => { stopAudio(); }, [langId, hazard.id, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section data-testid="accessibility-engine" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)), #0a0a0d" }}>
      <style>{`
        @keyframes waveBar { 0%,100% { transform: scaleY(0.25);} 50% { transform: scaleY(1);} }
        .wave-bar { transform-origin: center; }
        .wave-bar.on { animation: waveBar 0.8s ease-in-out infinite; }
        @keyframes radarSpin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        .radar-sweep { animation: radarSpin 3.2s linear infinite; transform-origin: center; }
        @keyframes symbolPulse { 0%,100% { transform: scale(1); opacity: 1;} 50% { transform: scale(1.12); opacity: 0.8;} }
        .symbol-pulse { animation: symbolPulse 1.6s ease-in-out infinite; }
      `}</style>

      <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 05</div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
        Universal Accessibility Engine
      </h2>
      <p className="text-sm mt-1 mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
        Language &amp; Format Preference — built so every citizen can understand the threat in <span style={{ color: hazard.accent }}>{locationLabel}</span>, no technical knowledge required.
      </p>

      <div className="flex flex-wrap gap-2 mb-4" data-testid="language-toggle-group">
        {LANGUAGES.map((l) => {
          const active = l.id === langId;
          return (
            <button
              key={l.id}
              data-testid={`lang-btn-${l.id}`}
              onClick={() => setLangId(l.id)}
              className="chip-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: active ? hazard.accent : "rgba(255,255,255,0.03)",
                color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                border: `1px solid ${active ? hazard.accent : "rgba(255,255,255,0.1)"}`,
                fontFamily: "Manrope",
              }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5" data-testid="mode-toggle-group">
        {Object.entries(MODE_LABELS).map(([id, m]) => {
          const active = id === mode;
          return (
            <button
              key={id}
              data-testid={`mode-btn-${id}`}
              onClick={() => setMode(id)}
              className="chip-btn rounded-xl border px-3 py-3 text-left"
              style={{ borderColor: active ? hazard.accent : "rgba(255,255,255,0.08)", background: active ? hazard.accentSoft : "rgba(255,255,255,0.02)" }}
            >
              <div className="text-xl">{m.icon}</div>
              <div className="text-sm font-bold mt-1" style={{ color: active ? hazard.accent : "white", fontFamily: "Bricolage Grotesque" }}>{m.label}</div>
              <div className="text-[10px] mt-0.5 hidden sm:block" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>{m.sub}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border p-5 min-h-[200px]" style={{ borderColor: `${hazard.accent}33`, background: "rgba(255,255,255,0.02)" }} data-testid="accessibility-output">
        {mode === "text" && (
          <div data-testid="text-mode-panel" className="flex items-start gap-4">
            <div className="text-4xl symbol-pulse shrink-0">{hazard.emoji}</div>
            <div>
              <div className="text-[10px] tracking-[0.28em] mb-2" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
                SIMPLE SUMMARY · {lang.label.toUpperCase()} · {hazard.label.toUpperCase()}
              </div>
              <p className="text-lg sm:text-xl leading-relaxed font-semibold" style={{ fontFamily: "Manrope", color: "rgba(255,255,255,0.92)" }} data-testid="simplified-summary">
                {summary}
              </p>
            </div>
          </div>
        )}

        {mode === "audio" && (
          <div data-testid="audio-mode-panel" className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-end gap-1 h-16" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className={`wave-bar ${playing ? "on" : ""} rounded-full`}
                  style={{
                    width: 5,
                    height: 12 + Math.abs(Math.sin(i * 1.7)) * 44,
                    background: playing ? hazard.accent : "rgba(255,255,255,0.2)",
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              ))}
            </div>
            <button
              data-testid="play-voice-warning-btn"
              onClick={playAudio}
              className="chip-btn rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2"
              style={{ background: playing ? "rgba(255,255,255,0.1)" : hazard.accent, color: playing ? "white" : "#0a0a0a", fontFamily: "Bricolage Grotesque" }}
            >
              {playing ? "⏹ Stop Broadcast" : "▶ Play Voice Warning Audio"}
            </button>
            <p className="text-xs text-center max-w-md" style={{ color: "rgba(255,255,255,0.5)" }}>
              Simulated local emergency broadcast · {lang.label} · {hazard.label} · {locationLabel}
            </p>
          </div>
        )}

        {mode === "visual" && (
          <div data-testid="visual-mode-panel" className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
            <div className="relative w-40 h-40 shrink-0">
              <div className="absolute inset-0 rounded-full border" style={{ borderColor: `${hazard.accent}44` }} />
              <div className="absolute inset-4 rounded-full border" style={{ borderColor: `${hazard.accent}33` }} />
              <div className="absolute inset-8 rounded-full border" style={{ borderColor: `${hazard.accent}22` }} />
              <div className="absolute inset-0 radar-sweep">
                <div className="absolute left-1/2 top-0 bottom-1/2 w-px" style={{ background: `linear-gradient(to top, ${hazard.accent}, transparent)` }} />
                <div className="absolute left-1/2 top-1/2 w-1/2 h-1/2 origin-top-left" style={{ background: `conic-gradient(from 0deg, ${hazard.accent}55, transparent 80deg)` }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl symbol-pulse">{hazard.emoji}</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>LIVE RADAR SWEEP · {locationLabel.toUpperCase()}</div>
              <div className="text-2xl font-extrabold mt-1" style={{ fontFamily: "Bricolage Grotesque", color: hazard.accent }}>{hazard.riskLabel}</div>
              <div className="flex gap-1.5 mt-3 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="w-8 h-2 rounded-full" style={{ background: i < hazard.riskLevel ? hazard.accent : "rgba(255,255,255,0.1)" }} />
                ))}
              </div>
              <p className="text-sm mt-3 max-w-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{hazard.tagline}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
