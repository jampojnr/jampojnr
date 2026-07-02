const BENCHMARKS = [
  {
    id: "accra",
    flag: "🇬🇭",
    name: "Accra",
    tier: "CATASTROPHIC RED ALERT",
    color: "#dc2626",
    blurb: "Odaw Basin & Kaneshie–Circle critical overflow — primary national benchmark.",
    locked: true,
    target: { continent: "africa", venue: "ghana", region: "greater-accra", hazard: "flood" },
  },
  {
    id: "obuasi",
    flag: "🇬🇭",
    name: "Obuasi",
    tier: "ORANGE ALERT · RESIDENTIAL",
    color: "#f97316",
    blurb: "Residential water intrusion — localized, non-structural asset disruption.",
    target: { continent: "africa", venue: "ghana", region: "ashanti", city: "obuasi", hazard: "flood" },
  },
  {
    id: "kumasi",
    flag: "🇬🇭",
    name: "Kumasi",
    tier: "URBAN TRANSIT WARNING",
    color: "#f59e0b",
    blurb: "Flash flood pooling around key markets & central transit networks.",
    target: { continent: "africa", venue: "ghana", region: "ashanti", city: "kumasi", hazard: "flood" },
  },
  {
    id: "sunyani",
    flag: "🇬🇭",
    name: "Sunyani",
    tier: "HARMATTAN VEGETATIVE ALERT",
    color: "#fb923c",
    blurb: "Severe dry-season drying — elevated wildfire indexing in peri-urban zones.",
    target: { continent: "africa", venue: "ghana", region: "bono", hazard: "wildfire" },
  },
  {
    id: "usa",
    flag: "🇺🇸",
    name: "USA",
    tier: "CALIFORNIA WILDFIRES CONFIG",
    color: "#f97316",
    blurb: "50-state layer — Santa Ana wind-driven mega-fires benchmark (switchable per state).",
    target: { continent: "na", usState: "ca", hazard: "wildfire" },
  },
  {
    id: "europe",
    flag: "🇪🇺",
    name: "Europe / UK",
    tier: "NORTH SEA STORM SURGE",
    color: "#8b5cf6",
    blurb: "Scotland kingdom config — named-storm surge fields on North Sea coastal assets.",
    target: { continent: "eu", ukKingdom: "scotland", hazard: "storm" },
  },
];

export const SeverityMatrix = ({ hazard, activeId, onJump }) => (
  <section data-testid="severity-matrix" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0d" }}>
    <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 04B</div>
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
      Comparative Severity Matrix
    </h2>
    <p className="text-sm mt-1 mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>
      Accra is locked as the primary catastrophic benchmark — tap any cell to instantly re-sync the entire system to that focus.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {BENCHMARKS.map((b) => {
        const active = b.id === activeId;
        return (
          <button
            key={b.id}
            data-testid={`benchmark-${b.id}`}
            onClick={() => onJump(b.target)}
            className="chip-btn rounded-2xl border p-4 text-left flex flex-col gap-1.5"
            style={{
              borderColor: active ? b.color : `${b.color}44`,
              background: active ? `${b.color}1f` : "rgba(255,255,255,0.02)",
              boxShadow: active ? `0 0 24px ${b.color}33` : "none",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold flex items-center gap-1.5" style={{ fontFamily: "Bricolage Grotesque" }}>
                <span>{b.flag}</span> {b.name}
              </span>
              {b.locked && (
                <span className="text-[8px] tracking-[0.14em] px-1.5 py-0.5 rounded shrink-0" style={{ background: "rgba(220,38,38,0.2)", color: "#f87171", fontFamily: "JetBrains Mono" }}>
                  🔒 PRIMARY BENCHMARK
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-[0.18em] px-2 py-0.5 rounded-full self-start" style={{ background: `${b.color}22`, color: b.color, fontFamily: "JetBrains Mono" }}>
              {b.tier}
            </span>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Manrope" }}>{b.blurb}</p>
            <span className="text-[9px] tracking-[0.22em] mt-auto" style={{ color: active ? b.color : "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono" }}>
              {active ? "● SYSTEM FOCUS ACTIVE" : "TAP TO FOCUS"}
            </span>
          </button>
        );
      })}
    </div>
  </section>
);
