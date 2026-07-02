/* --------------------------- SUBCOMPONENTS --------------------------- */
export const Marquee = ({ items, accent }) => {
  const stream = [...items, ...items, ...items];
  return (
    <div
      data-testid="live-alerts-marquee"
      className="relative overflow-hidden border rounded-full py-2"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center gap-2 pl-3 pr-4 z-10"
        style={{ background: "linear-gradient(90deg, rgba(9,9,11,0.98) 60%, rgba(9,9,11,0))" }}
      >
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
        <span className="text-[10px] tracking-[0.22em] font-semibold" style={{ color: accent, fontFamily: "JetBrains Mono, monospace" }}>LIVE</span>
      </div>
      <div className="marquee-track whitespace-nowrap pl-24">
        {stream.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6 text-sm" style={{ color: "rgba(255,255,255,0.78)", fontFamily: "Manrope" }}>
            <span className="inline-block w-1 h-1 rounded-full" style={{ background: accent }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export const MapCard = ({ hazard, timelineValue, coordsLabel, sectorLabel }) => {
  const intensity = 0.45 + (timelineValue / 100) * 0.55;
  return (
    <div
      data-testid="map-card"
      className="relative overflow-hidden rounded-3xl border"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.04), transparent 60%), #0b0b0d",
        minHeight: 400,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${hazard.accent}22 1px, transparent 1px), linear-gradient(90deg, ${hazard.accent}22 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${hazard.accent}18 0 1px, transparent 1px 22px)` }}
      />
      <div className="absolute top-3 left-4 text-[10px] tracking-widest" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }} data-testid="map-coords">
        {coordsLabel}
      </div>
      <div className="absolute top-3 right-4 text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
        SECTOR · {sectorLabel}
      </div>
      <div className="absolute bottom-3 right-4 text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono" }}>
        SCALE 1:24 000 · REFRESH 12s
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border" style={{ borderColor: `${hazard.accent}55` }} />
        <div className="absolute w-64 h-px" style={{ background: `${hazard.accent}33` }} />
        <div className="absolute h-64 w-px" style={{ background: `${hazard.accent}33` }} />
      </div>
      {hazard.markers.map((m, i) => (
        <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }} data-testid={`map-marker-${i}`}>
          <span
            className="absolute rounded-full animate-ping-slow"
            style={{
              width: m.size * 2, height: m.size * 2, left: -m.size, top: -m.size,
              background: hazard.accent, opacity: 0.18 * intensity,
            }}
          />
          <span
            className="block rounded-full"
            style={{
              width: m.size, height: m.size,
              background: `radial-gradient(circle, ${hazard.accent}, ${hazard.accentDeep})`,
              boxShadow: `0 0 ${18 * intensity}px ${hazard.accent}`,
              opacity: 0.75 + intensity * 0.25,
            }}
          />
          <span
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] px-2 py-0.5 rounded-full"
            style={{
              color: hazard.accent, background: "rgba(0,0,0,0.5)",
              border: `1px solid ${hazard.accent}44`, fontFamily: "JetBrains Mono",
            }}
          >
            {m.label}
          </span>
        </div>
      ))}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="sweep-line" style={{ background: `linear-gradient(90deg, transparent, ${hazard.accent}66, transparent)` }} />
      </div>
      <div className="absolute left-4 bottom-3 flex items-center gap-3 max-w-[75%]">
        <span className="text-[10px] tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
          {hazard.tagline}
        </span>
      </div>
    </div>
  );
};

export const Checkbox = ({ id, label, checked, onChange, accent }) => (
  <label
    htmlFor={id}
    data-testid={`checklist-item-${id}`}
    className="group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:translate-y-[-1px]"
    style={{
      borderColor: checked ? `${accent}55` : "rgba(255,255,255,0.08)",
      background: checked ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
    }}
  >
    <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={onChange} data-testid={`checklist-checkbox-${id}`} />
    <span
      className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-md border transition-all shrink-0"
      style={{ borderColor: checked ? "#22c55e" : accent, background: checked ? "#22c55e" : "transparent" }}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 transition-all duration-300 ${checked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="4 12 10 18 20 6" />
      </svg>
    </span>
    <span className="relative flex-1 text-sm sm:text-base font-medium transition-colors" style={{ fontFamily: "Manrope", color: checked ? "#22c55e" : "rgba(255,255,255,0.92)" }}>
      <span className={`strike-wrap ${checked ? "checked" : ""}`}>{label}</span>
    </span>
    <span className="text-[10px] tracking-widest self-center opacity-70" style={{ color: checked ? "#22c55e" : accent, fontFamily: "JetBrains Mono" }}>
      {checked ? "DONE" : "PENDING"}
    </span>
  </label>
);
