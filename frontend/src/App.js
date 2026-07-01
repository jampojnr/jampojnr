import { useEffect, useMemo, useState } from "react";
import "@/App.css";

/*
 * CrisisShield AI — single-file, self-contained interactive app.
 * Pure React + Tailwind + vanilla state; no backend dependencies.
 */

const HAZARDS = {
  flood: {
    id: "flood",
    label: "Flood Watch",
    emoji: "🌧️",
    accent: "#22d3ee", // cyan-400 (Cool Blue)
    accentDeep: "#0369a1",
    accentSoft: "rgba(34,211,238,0.14)",
    ring: "rgba(34,211,238,0.55)",
    riskLabel: "ELEVATED",
    riskLevel: 3,
    tagline: "Rising water table monitored across low-lying corridors.",
    checklist: [
      "Elevate electrical appliances",
      "Secure 3 days of clean drinking water",
      "Locate nearest high-ground parking",
    ],
    markers: [
      { x: 22, y: 40, size: 20, label: "Levee Sensor A" },
      { x: 55, y: 62, size: 30, label: "River Gauge 07" },
      { x: 78, y: 30, size: 16, label: "Drain Outflow" },
      { x: 40, y: 78, size: 24, label: "Storm Cell" },
    ],
    alerts: [
      "NWS: Coastal surge advisory extended to 04:00 UTC",
      "Reservoir spill gates opening in 42 min",
      "Bridge closures — Route 9 southbound",
      "Rainfall accumulation: 87mm past 6h",
    ],
  },
  wildfire: {
    id: "wildfire",
    label: "Wildfire Threat",
    emoji: "🔥",
    accent: "#fb923c", // orange (Deep Orange)
    accentDeep: "#9a3412",
    accentSoft: "rgba(251,146,60,0.14)",
    ring: "rgba(251,146,60,0.55)",
    riskLabel: "SEVERE",
    riskLevel: 4,
    tagline: "Dry-lightning fronts converging with sustained 40kph gusts.",
    checklist: [
      "Pack emergency go-bag with essential documents",
      "Close all windows and set AC to recirculation",
      "Map out two distinct evacuation routes",
    ],
    markers: [
      { x: 28, y: 52, size: 34, label: "Active Burn — Ridge 4" },
      { x: 62, y: 34, size: 22, label: "Ember Drift" },
      { x: 82, y: 68, size: 18, label: "Fuel Load High" },
      { x: 45, y: 72, size: 26, label: "Perimeter Shift" },
    ],
    alerts: [
      "CalFire: New start reported near Grid B-14",
      "AQI 218 — hazardous downwind",
      "Aerial retardant drop ETA 12 min",
      "Wind shear expected 21:40 local",
    ],
  },
  heat: {
    id: "heat",
    label: "Extreme Heat",
    emoji: "☀️",
    accent: "#f43f5e", // crimson-ish rose-500
    accentDeep: "#9f1239",
    accentSoft: "rgba(244,63,94,0.14)",
    ring: "rgba(244,63,94,0.55)",
    riskLabel: "CRITICAL",
    riskLevel: 5,
    tagline: "Heat dome anchored — surface radiance breaching thresholds.",
    checklist: [
      "Check vehicle tire pressure (heat expansion risk)",
      "Locate nearest public cooling center",
      "Coordinate hydration checks for elderly neighbors",
    ],
    markers: [
      { x: 35, y: 45, size: 30, label: "Urban Heat Island" },
      { x: 68, y: 58, size: 22, label: "Asphalt Corridor" },
      { x: 20, y: 70, size: 18, label: "Cooling Center" },
      { x: 80, y: 22, size: 26, label: "Grid Load Spike" },
    ],
    alerts: [
      "NOAA: Heat advisory — feels-like 47°C",
      "Grid demand at 94% capacity",
      "Cooling centers open until 23:00",
      "Wet-bulb readings crossing 32°C",
    ],
  },
};

const VENUES = {
  wc2026: {
    id: "wc2026",
    label: "FIFA World Cup 2026 (North America)",
    city: "Kansas City, MO",
    coords: "39.0997° N, 94.5786° W",
    horizon: "June 11 – July 19, 2026",
    profile: {
      flood:
        "Midwest convective storm systems increase surge risk at riverfront fan zones. Contingency drainage recommended around Arrowhead perimeter.",
      wildfire:
        "Low wildfire probability in venue corridor; monitor secondary smoke drift from western states during pre-tournament dry window.",
      heat:
        "Historical June peaks approach 38°C with humidity spikes — plan mid-match hydration timeouts and shaded queue architecture.",
    },
  },
  la2028: {
    id: "la2028",
    label: "Los Angeles Olympics 2028",
    city: "Los Angeles, CA",
    coords: "34.0522° N, 118.2437° W",
    horizon: "July 14 – July 30, 2028",
    profile: {
      flood:
        "Limited pluvial risk in July, but atmospheric river anomalies since 2023 warrant flash-flood staging near LA River venues.",
      wildfire:
        "Santa Ana wind window overlaps closing ceremony week — pre-position air quality contingencies for outdoor events.",
      heat:
        "Projected asphalt surface expansion exceeds 42°C. Risk of heavy transit delays and venue equipment cooling strain.",
    },
  },
  accra: {
    id: "accra",
    label: "Niche Urban Venues (Accra, Ghana)",
    city: "Accra, Ghana",
    coords: "5.6037° N, 0.1870° W",
    horizon: "Rolling calendar 2026–2028",
    profile: {
      flood:
        "Coastal monsoon overflow historically overwhelms Odaw drainage — venue ingress plans must include tidal-window sensitivity.",
      wildfire:
        "Harmattan dust events increase ignition risk in peri-urban brush; low structural fire probability in central districts.",
      heat:
        "Sustained tropical heat + high humidity produces dangerous wet-bulb readings; enforce open-air event curfews after 14:00.",
    },
  },
};

const RISK_TIERS = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "SEVERE", "CRITICAL"];

// Inject Google fonts once
const injectFonts = () => {
  if (document.getElementById("crisis-fonts")) return;
  const l = document.createElement("link");
  l.id = "crisis-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
};

const Marquee = ({ items, accent }) => {
  const stream = [...items, ...items, ...items];
  return (
    <div
      data-testid="live-alerts-marquee"
      className="relative overflow-hidden border rounded-full py-2"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center gap-2 pl-3 pr-4 z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(9,9,11,0.98) 60%, rgba(9,9,11,0))",
        }}
      >
        <span
          className="inline-block w-2 h-2 rounded-full animate-pulse"
          style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
        />
        <span
          className="text-[10px] tracking-[0.22em] font-semibold"
          style={{ color: accent, fontFamily: "JetBrains Mono, monospace" }}
        >
          LIVE
        </span>
      </div>
      <div className="marquee-track whitespace-nowrap pl-24">
        {stream.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-6 text-sm"
            style={{ color: "rgba(255,255,255,0.78)", fontFamily: "Manrope" }}
          >
            <span
              className="inline-block w-1 h-1 rounded-full"
              style={{ background: accent }}
            />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

const MapCard = ({ hazard, timelineHour }) => {
  // shift marker intensity based on timeline
  const intensity = 0.4 + (timelineHour / 72) * 0.6;
  return (
    <div
      data-testid="map-card"
      className="relative overflow-hidden rounded-3xl border"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.04), transparent 60%), #0b0b0d",
        minHeight: 380,
      }}
    >
      {/* grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${hazard.accent}22 1px, transparent 1px), linear-gradient(90deg, ${hazard.accent}22 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        }}
      />
      {/* diagonal ticks */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${hazard.accent}18 0 1px, transparent 1px 22px)`,
        }}
      />

      {/* coordinate labels */}
      <div className="absolute top-3 left-4 text-[10px] tracking-widest" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
        N 34.05 · W 118.24
      </div>
      <div className="absolute top-3 right-4 text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
        SECTOR · {hazard.id.toUpperCase()}
      </div>
      <div className="absolute bottom-3 right-4 text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono" }}>
        SCALE 1:24 000 · REFRESH 12s
      </div>

      {/* crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border" style={{ borderColor: `${hazard.accent}55` }} />
        <div className="absolute w-64 h-px" style={{ background: `${hazard.accent}33` }} />
        <div className="absolute h-64 w-px" style={{ background: `${hazard.accent}33` }} />
      </div>

      {/* markers */}
      {hazard.markers.map((m, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
          data-testid={`map-marker-${i}`}
        >
          <span
            className="absolute rounded-full animate-ping-slow"
            style={{
              width: m.size * 2,
              height: m.size * 2,
              left: -m.size,
              top: -m.size,
              background: hazard.accent,
              opacity: 0.18 * intensity,
            }}
          />
          <span
            className="block rounded-full"
            style={{
              width: m.size,
              height: m.size,
              background: `radial-gradient(circle, ${hazard.accent}, ${hazard.accentDeep})`,
              boxShadow: `0 0 ${18 * intensity}px ${hazard.accent}`,
              opacity: 0.75 + intensity * 0.25,
            }}
          />
          <span
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] px-2 py-0.5 rounded-full"
            style={{
              color: hazard.accent,
              background: "rgba(0,0,0,0.5)",
              border: `1px solid ${hazard.accent}44`,
              fontFamily: "JetBrains Mono",
            }}
          >
            {m.label}
          </span>
        </div>
      ))}

      {/* sweep line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="sweep-line"
          style={{ background: `linear-gradient(90deg, transparent, ${hazard.accent}66, transparent)` }}
        />
      </div>

      {/* footer strip */}
      <div className="absolute left-4 bottom-3 flex items-center gap-3">
        <span className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>
          T+{String(timelineHour).padStart(2, "0")}h
        </span>
        <span className="text-[10px] tracking-widest px-2 py-0.5 rounded-full" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
          {hazard.tagline}
        </span>
      </div>
    </div>
  );
};

const Checkbox = ({ id, label, checked, onChange, accent }) => (
  <label
    htmlFor={id}
    data-testid={`checklist-item-${id}`}
    className="group flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:translate-y-[-1px]"
    style={{
      borderColor: checked ? `${accent}55` : "rgba(255,255,255,0.08)",
      background: checked ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)",
    }}
  >
    <input
      id={id}
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
      data-testid={`checklist-checkbox-${id}`}
    />
    <span
      className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-md border transition-all"
      style={{
        borderColor: checked ? "#22c55e" : accent,
        background: checked ? "#22c55e" : "transparent",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-4 h-4 transition-all duration-300 ${checked ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 12 10 18 20 6" />
      </svg>
    </span>
    <span
      className="relative flex-1 text-sm sm:text-base font-medium transition-colors"
      style={{
        fontFamily: "Manrope",
        color: checked ? "#22c55e" : "rgba(255,255,255,0.92)",
      }}
    >
      <span className={`strike-wrap ${checked ? "checked" : ""}`}>
        {label}
      </span>
    </span>
    <span
      className="text-[10px] tracking-widest self-center opacity-70"
      style={{ color: checked ? "#22c55e" : accent, fontFamily: "JetBrains Mono" }}
    >
      {checked ? "DONE" : "PENDING"}
    </span>
  </label>
);

function App() {
  const [hazardId, setHazardId] = useState("flood");
  const [venueId, setVenueId] = useState("wc2026");
  const [timelineHour, setTimelineHour] = useState(24);
  const [location, setLocation] = useState("");
  const [locationSubmitted, setLocationSubmitted] = useState("");
  const [checked, setChecked] = useState({}); // key: hazardId+idx

  const hazard = HAZARDS[hazardId];
  const venue = VENUES[venueId];

  useEffect(() => {
    injectFonts();
  }, []);

  useEffect(() => {
    // set CSS variable for accent globally
    document.documentElement.style.setProperty("--accent", hazard.accent);
    document.documentElement.style.setProperty("--accent-soft", hazard.accentSoft);
    document.documentElement.style.setProperty("--accent-ring", hazard.ring);
  }, [hazard]);

  const projectedRisk = useMemo(() => {
    const base = hazard.riskLevel;
    const t = timelineHour;
    // venue nudge
    const venueBoost = venueId === "la2028" && hazardId === "heat" ? 1 : 0;
    const timelineBoost = t > 48 ? 1 : t > 24 ? 0 : 0;
    return Math.min(5, base + venueBoost + timelineBoost - 0); // 0..5
  }, [hazard, timelineHour, venueId, hazardId]);

  const projectedLabel = RISK_TIERS[projectedRisk];

  const venueWarning = venue.profile[hazardId];

  const toggleCheck = (idx) => {
    const key = `${hazardId}-${idx}`;
    setChecked((s) => ({ ...s, [key]: !s[key] }));
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setLocationSubmitted(location.trim());
  };

  return (
    <div
      data-testid="crisisshield-root"
      className="min-h-screen w-full text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(1000px 500px at 90% 110%, var(--accent-soft), transparent 60%), #08080a",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <style>{`
        .marquee-track { display: inline-flex; animation: marquee 45s linear infinite; }
        @keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-33.333%);} }
        .animate-ping-slow { animation: pingSlow 2.6s cubic-bezier(0,0,0.2,1) infinite; }
        @keyframes pingSlow { 0% { transform: scale(0.6); opacity: 0.55;} 80%,100% { transform: scale(1.6); opacity: 0;} }
        .sweep-line { position: absolute; top:0; bottom:0; width: 40%; animation: sweep 6s linear infinite; }
        @keyframes sweep { 0% { transform: translateX(-40%);} 100% { transform: translateX(240%);} }
        .strike-wrap { position: relative; display: inline-block; }
        .strike-wrap::after {
          content: ""; position: absolute; left: 0; top: 50%; height: 2px;
          background: #22c55e; width: 0%; transition: width 420ms cubic-bezier(0.65,0,0.35,1);
        }
        .strike-wrap.checked::after { width: 100%; }
        .hazard-btn { transition: transform 250ms ease, background 250ms ease, box-shadow 250ms ease, color 250ms ease; }
        .hazard-btn:hover { transform: translateY(-1px); }
        input[type="range"].timeline { -webkit-appearance: none; appearance: none; background: transparent; }
        input[type="range"].timeline::-webkit-slider-runnable-track { height: 6px; background: linear-gradient(90deg, var(--accent), rgba(255,255,255,0.08)); border-radius: 999px; }
        input[type="range"].timeline::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 22px; width: 22px; border-radius: 999px; background: #fff; border: 3px solid var(--accent); margin-top: -8px; box-shadow: 0 0 0 4px rgba(255,255,255,0.05); cursor: pointer; }
        input[type="range"].timeline::-moz-range-track { height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; }
        input[type="range"].timeline::-moz-range-thumb { height: 22px; width: 22px; border-radius: 999px; background: #fff; border: 3px solid var(--accent); cursor: pointer; }
        .glow-ring { box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 0 40px var(--accent-soft); }
        select.venue-select {
          appearance: none;
          background:
            linear-gradient(45deg, transparent 50%, var(--accent) 50%) calc(100% - 20px) 55%/6px 6px no-repeat,
            linear-gradient(-45deg, transparent 50%, var(--accent) 50%) calc(100% - 14px) 55%/6px 6px no-repeat,
            rgba(255,255,255,0.03);
        }
      `}</style>

      {/* ============ TOP NAV ============ */}
      <header
        data-testid="top-nav"
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(8,8,10,0.72)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center glow-ring"
              style={{ background: "#0f0f13" }}
              data-testid="brand-mark"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1
                data-testid="brand-title"
                className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif", letterSpacing: "-0.02em" }}
              >
                CrisisShield <span style={{ color: hazard.accent }}>AI</span>
              </h1>
              <p className="text-[11px] tracking-[0.22em] mt-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
                PREDICTIVE HAZARD INTELLIGENCE · v2.6
              </p>
            </div>
          </div>

          <nav
            data-testid="hazard-toggle-group"
            className="flex flex-wrap gap-2 p-1 rounded-2xl border"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {Object.values(HAZARDS).map((h) => {
              const active = h.id === hazardId;
              return (
                <button
                  key={h.id}
                  data-testid={`hazard-btn-${h.id}`}
                  onClick={() => setHazardId(h.id)}
                  className="hazard-btn px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{
                    background: active ? h.accent : "transparent",
                    color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                    boxShadow: active ? `0 8px 30px -8px ${h.accent}` : "none",
                    fontFamily: "Manrope",
                  }}
                >
                  <span className="text-base leading-none">{h.emoji}</span>
                  <span>{h.label}</span>
                </button>
              );
            })}
          </nav>

          <div
            data-testid="risk-level-badge"
            className="inline-flex items-center gap-3 pl-3 pr-5 py-2 rounded-full border self-start lg:self-auto"
            style={{
              borderColor: `${hazard.accent}55`,
              background: hazard.accentSoft,
            }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: hazard.accent }} />
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: hazard.accent }} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono" }}>
                RISK LEVEL
              </span>
              <span className="text-sm font-bold" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }} data-testid="risk-level-label">
                {hazard.riskLabel}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ============ MAIN ============ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Location + Alerts row */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <form
            data-testid="location-form"
            onSubmit={onSearchSubmit}
            className="lg:col-span-4 relative"
          >
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="10" r="3" />
                <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
              </svg>
              <input
                data-testid="location-input"
                type="text"
                placeholder="Search city, stadium, or grid ID…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/40"
                style={{ fontFamily: "Manrope" }}
              />
              <button
                data-testid="location-submit"
                type="submit"
                className="text-[10px] tracking-[0.22em] px-3 py-1 rounded-full font-semibold"
                style={{
                  background: hazard.accent,
                  color: "#0a0a0a",
                  fontFamily: "JetBrains Mono",
                }}
              >
                SCAN
              </button>
            </div>
            {locationSubmitted && (
              <div
                data-testid="location-result"
                className="mt-2 text-xs px-4"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Watching: <span style={{ color: hazard.accent }}>{locationSubmitted}</span>
              </div>
            )}
          </form>
          <div className="lg:col-span-8">
            <Marquee items={hazard.alerts} accent={hazard.accent} />
          </div>
        </section>

        {/* Map */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}
              >
                Field Overview
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Sensor mesh · pulse indicates telemetry velocity for current hazard band.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: hazard.accent }} />
              LIVE MESH · {hazard.markers.length} NODES
            </div>
          </div>
          <MapCard hazard={hazard} timelineHour={timelineHour} />
        </section>

        {/* Event & Venue Risk Simulator */}
        <section
          data-testid="venue-simulator"
          className="rounded-3xl border p-5 sm:p-8"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)) , #0a0a0d",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
                MODULE · 03
              </div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1"
                style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}
              >
                Event &amp; Venue Risk Simulator
              </h2>
              <p className="text-sm max-w-xl mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Load a future event profile and scan its predictive timeline against the active hazard model.
              </p>
            </div>
            <div className="flex-1 lg:max-w-md">
              <label className="text-[10px] tracking-[0.22em] block mb-2" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>
                EVENT PROFILE
              </label>
              <select
                data-testid="venue-select"
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                className="venue-select w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontFamily: "Manrope",
                }}
              >
                {Object.values(VENUES).map((v) => (
                  <option key={v.id} value={v.id} style={{ background: "#0a0a0d" }}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Timeline + warning */}
            <div className="lg:col-span-3">
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>
                    PREDICTIVE TIMELINE · T+{String(timelineHour).padStart(2, "0")}h
                  </span>
                  <span className="text-[10px] tracking-[0.22em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
                    HORIZON · 72h
                  </span>
                </div>
                <input
                  data-testid="timeline-slider"
                  type="range"
                  className="timeline w-full"
                  min={0}
                  max={72}
                  step={1}
                  value={timelineHour}
                  onChange={(e) => setTimelineHour(parseInt(e.target.value, 10))}
                />
                <div className="flex justify-between text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono" }}>
                  <span>NOW</span>
                  <span>+24h</span>
                  <span>+48h</span>
                  <span>+72h</span>
                </div>
              </div>

              <div
                data-testid="venue-warning"
                className="mt-5 rounded-2xl border p-5 relative overflow-hidden"
                style={{
                  borderColor: `${hazard.accent}44`,
                  background: `linear-gradient(120deg, ${hazard.accentSoft}, rgba(255,255,255,0.01))`,
                }}
              >
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: hazard.accent }} />
                <div className="flex items-start gap-3 relative">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: hazard.accent, color: "#0a0a0a" }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
                      INFRASTRUCTURE WARNING · {venue.city.toUpperCase()}
                    </div>
                    <p
                      className="mt-1 text-base sm:text-lg font-semibold leading-snug"
                      style={{ fontFamily: "Bricolage Grotesque", color: "white" }}
                      data-testid="venue-warning-text"
                    >
                      {venueWarning}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue meta panel */}
            <div className="lg:col-span-2">
              <div
                className="rounded-2xl border p-5 h-full flex flex-col gap-4"
                style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
              >
                <div>
                  <div className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
                    ACTIVE VENUE
                  </div>
                  <div className="text-lg font-bold mt-1" style={{ fontFamily: "Bricolage Grotesque" }} data-testid="venue-active-label">
                    {venue.label}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>CITY</div>
                    <div className="mt-1 font-semibold">{venue.city}</div>
                  </div>
                  <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>COORDS</div>
                    <div className="mt-1 font-semibold" style={{ fontFamily: "JetBrains Mono" }}>{venue.coords}</div>
                  </div>
                  <div className="rounded-xl border p-3 col-span-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>WINDOW</div>
                    <div className="mt-1 font-semibold">{venue.horizon}</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>PROJECTED RISK</span>
                    <span className="text-xs font-bold" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }} data-testid="projected-risk-label">
                      {projectedLabel}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-2 flex-1 rounded-full"
                        style={{
                          background: i < projectedRisk ? hazard.accent : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Checklist */}
        <section
          data-testid="checklist-panel"
          className="rounded-3xl border p-5 sm:p-8"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "#0a0a0d",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <div>
              <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
                MODULE · 04
              </div>
              <h2
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1"
                style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}
              >
                Emergency Preparedness Checklist
              </h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Adapted for <span style={{ color: hazard.accent }}>{hazard.label}</span> — tap each item to mark it complete.
              </p>
            </div>
            <div className="text-[10px] tracking-[0.28em] px-3 py-1 rounded-full self-start sm:self-auto" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
              {hazard.checklist.filter((_, i) => checked[`${hazardId}-${i}`]).length}/{hazard.checklist.length} COMPLETED
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hazard.checklist.map((item, idx) => {
              const key = `${hazardId}-${idx}`;
              return (
                <Checkbox
                  key={key}
                  id={key}
                  label={item}
                  accent={hazard.accent}
                  checked={!!checked[key]}
                  onChange={() => toggleCheck(idx)}
                />
              );
            })}
          </div>
        </section>

        <footer className="pt-4 pb-10 flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span style={{ fontFamily: "JetBrains Mono" }}>© 2026 CRISISSHIELD AI · SIGNAL INTELLIGENCE</span>
          <span style={{ fontFamily: "JetBrains Mono" }}>NODE · SEA-04 · UPLINK OK</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
