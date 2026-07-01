import { useEffect, useMemo, useState } from "react";
import "@/App.css";
import { HAZARDS, RISK_TIERS, TIMELINE_ANCHORS, timelineReadout } from "@/data/hazards";
import { CONTINENTS, US_STATES, UK_KINGDOMS } from "@/data/continents";
import { GHANA_REGIONS } from "@/data/ghana";
import { Marquee, MapCard, Checkbox } from "@/components/primitives";
import { AccessibilityEngine } from "@/components/AccessibilityEngine";
import { BroadcastCenter } from "@/components/BroadcastCenter";
import { AIHub } from "@/components/AIHub";
import { ShareCenter } from "@/components/ShareCenter";

/* Jampo's Crisis Shield AI — Global & National Disaster Intelligence Platform */





/* --------------------------- FONT INJECTION --------------------------- */
const injectFonts = () => {
  if (document.getElementById("crisis-fonts")) return;
  const l = document.createElement("link");
  l.id = "crisis-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=JetBrains+Mono:wght@400;600&family=Manrope:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
};

/* --------------------------- SUBCOMPONENTS --------------------------- */

/* --------------------------- APP --------------------------- */
function App() {
  const [continentId, setContinentId] = useState("na");
  const [venueId, setVenueId] = useState("wc2026");
  const [ghanaRegionId, setGhanaRegionId] = useState("greater-accra");
  const [ashantiCityId, setAshantiCityId] = useState("kumasi");
  const [hazardId, setHazardId] = useState("flood");
  const [timelineValue, setTimelineValue] = useState(20);
  const [location, setLocation] = useState("");
  const [locationSubmitted, setLocationSubmitted] = useState("");
  const [checked, setChecked] = useState({});
  const [usStateId, setUsStateId] = useState("");
  const [ukKingdomId, setUkKingdomId] = useState("");

  const continent = CONTINENTS[continentId];
  const venue = continent.venues[venueId] || Object.values(continent.venues)[0];
  const isGhanaNational = continent.id === "africa" && venue.id === "ghana";
  const hazard = HAZARDS[hazardId];

  const usState = continentId === "na" && usStateId ? US_STATES.find((s) => s.id === usStateId) : null;
  const ukKingdom = continentId === "eu" && ukKingdomId ? UK_KINGDOMS.find((k) => k.id === ukKingdomId) : null;
  const regionFocus = usState ? { ...usState, layer: "US STATE CONFIG" } : ukKingdom ? { ...ukKingdom, layer: "UK KINGDOM ALERT" } : null;

  const ghanaRegion = useMemo(() => GHANA_REGIONS.find((r) => r.id === ghanaRegionId) || GHANA_REGIONS[0], [ghanaRegionId]);
  const ashantiCity = useMemo(() => {
    if (ghanaRegion.id !== "ashanti") return null;
    return ghanaRegion.cities.find((c) => c.id === ashantiCityId) || ghanaRegion.cities[0];
  }, [ghanaRegion, ashantiCityId]);

  // Localized severity (Ghana city/region overrides)
  const localSeverity = useMemo(() => {
    if (!isGhanaNational) return null;
    if (ashantiCity && ashantiCity.severity && ashantiCity.severity[hazardId]) return ashantiCity.severity[hazardId];
    if (ghanaRegion.severity && ghanaRegion.severity[hazardId]) return ghanaRegion.severity[hazardId];
    return null;
  }, [isGhanaNational, ashantiCity, ghanaRegion, hazardId]);

  // Localized checklist override
  const effectiveChecklist = useMemo(() => {
    if (isGhanaNational) {
      if (ashantiCity && ashantiCity.checklist && ashantiCity.checklist[hazardId]) return ashantiCity.checklist[hazardId];
      if (ghanaRegion.checklist && ghanaRegion.checklist[hazardId]) return ghanaRegion.checklist[hazardId];
    }
    return hazard.checklist;
  }, [isGhanaNational, ashantiCity, ghanaRegion, hazardId, hazard]);

  // Whenever continent changes, reset venue to first valid one.
  useEffect(() => {
    const first = Object.keys(continent.venues)[0];
    setVenueId(first);
    setUsStateId("");
    setUkKingdomId("");
  }, [continentId, continent.venues]);

  useEffect(() => { injectFonts(); }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", hazard.accent);
    document.documentElement.style.setProperty("--accent-soft", hazard.accentSoft);
    document.documentElement.style.setProperty("--accent-ring", hazard.ring);
  }, [hazard]);

  const readout = timelineReadout(timelineValue);

  const projectedRisk = useMemo(() => {
    let base = hazard.riskLevel;
    if (localSeverity) base = Math.max(base, localSeverity.label.includes("CATASTROPHIC") ? 5 : localSeverity.label.includes("ELEVATED") ? 4 : localSeverity.label.includes("MUNICIPAL") ? 4 : 4);
    if (venueId === "la2028" && hazardId === "heat") base += 1;
    if ((usState && usState.hazard === hazardId) || (ukKingdom && ukKingdom.hazard === hazardId)) base += 1;
    if (readout.band === "Years") base = Math.max(0, base - 1);
    return Math.min(5, Math.max(0, base));
  }, [hazard, localSeverity, venueId, hazardId, readout.band, usState, ukKingdom]);

  const projectedLabel = RISK_TIERS[projectedRisk];

  // Coordinates/sector for map header
  const mapCoords = regionFocus ? regionFocus.coords : isGhanaNational ? (ashantiCity ? ashantiCity.coords : ghanaRegion.coords) : venue.coords;
  const mapSector = regionFocus ? regionFocus.name.toUpperCase() : isGhanaNational ? (ashantiCity ? `${ghanaRegion.name.toUpperCase()} · ${ashantiCity.name.toUpperCase()}` : ghanaRegion.name.toUpperCase()) : hazard.id.toUpperCase();

  // Venue warning text — Ghana severity > US state / UK kingdom focus > venue profile
  const venueWarningText = localSeverity ? localSeverity.message : regionFocus ? regionFocus.note : venue.profile[hazardId];
  const venueWarningLabel = localSeverity ? localSeverity.label : regionFocus ? `${regionFocus.layer} · ${regionFocus.name.toUpperCase()}` : `INFRASTRUCTURE WARNING · ${venue.city.toUpperCase()}`;
  const venueWarningColor = localSeverity ? localSeverity.color : hazard.accent;

  const locationLabel = isGhanaNational ? (ashantiCity ? `${ashantiCity.name}, Ghana` : `${ghanaRegion.name}, Ghana`) : regionFocus ? regionFocus.name : venue.city;

  const toggleCheck = (idx) => {
    const key = `${hazardId}-${isGhanaNational ? (ashantiCity ? ashantiCity.id : ghanaRegion.id) : venueId}-${idx}`;
    setChecked((s) => ({ ...s, [key]: !s[key] }));
  };
  const isChecked = (idx) => {
    const key = `${hazardId}-${isGhanaNational ? (ashantiCity ? ashantiCity.id : ghanaRegion.id) : venueId}-${idx}`;
    return !!checked[key];
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
        background: "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(1000px 500px at 90% 110%, var(--accent-soft), transparent 60%), #08080a",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <style>{`
        .marquee-track { display: inline-flex; animation: marquee 55s linear infinite; }
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
        .chip-btn { transition: transform 220ms ease, background 220ms ease, box-shadow 220ms ease, color 220ms ease; }
        .chip-btn:hover { transform: translateY(-1px); }
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>

      {/* =============== TOP NAV =============== */}
      <header data-testid="top-nav" className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(8,8,10,0.72)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Brand + Risk Badge */}
          <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-ring" style={{ background: "#0f0f13" }} data-testid="brand-mark">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 data-testid="brand-title" className="text-xl sm:text-2xl font-extrabold tracking-tight leading-none" style={{ fontFamily: "Bricolage Grotesque, sans-serif", letterSpacing: "-0.02em" }}>
                  Jampo&apos;s Crisis Shield <span style={{ color: hazard.accent }}>AI</span>
                </h1>
                <p className="text-[11px] tracking-[0.22em] mt-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
                  JAMPO&apos;S GLOBAL &amp; NATIONAL DISASTER INTELLIGENCE · v4.0
                </p>
              </div>
            </div>
            <div data-testid="risk-level-badge" className="inline-flex items-center gap-3 pl-3 pr-5 py-2 rounded-full border" style={{ borderColor: `${hazard.accent}55`, background: hazard.accentSoft }}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background: hazard.accent }} />
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: hazard.accent }} />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "JetBrains Mono" }}>RISK LEVEL</span>
                <span className="text-sm font-bold" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }} data-testid="risk-level-label">
                  {localSeverity ? localSeverity.label.split(" ")[0] : hazard.riskLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Hazard tabs — scrollable on mobile */}
          <nav data-testid="hazard-toggle-group" className="flex overflow-x-auto no-scrollbar gap-2 p-1 rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            {Object.values(HAZARDS).map((h) => {
              const active = h.id === hazardId;
              return (
                <button
                  key={h.id}
                  data-testid={`hazard-btn-${h.id}`}
                  onClick={() => setHazardId(h.id)}
                  className="chip-btn shrink-0 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
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

          {/* Continent tabs */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div data-testid="continent-tabs" className="flex overflow-x-auto no-scrollbar gap-2 p-1 rounded-2xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <span className="text-[10px] tracking-[0.22em] self-center px-3" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>GLOBAL DASHBOARD</span>
              {Object.values(CONTINENTS).map((c) => {
                const active = c.id === continentId;
                return (
                  <button
                    key={c.id}
                    data-testid={`continent-btn-${c.id}`}
                    onClick={() => setContinentId(c.id)}
                    className="chip-btn shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      background: active ? hazard.accent : "transparent",
                      color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                      fontFamily: "Manrope",
                    }}
                  >
                    <span>{c.emoji}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Location search */}
            <form data-testid="location-form" onSubmit={onSearchSubmit} className="relative w-full lg:max-w-md">
              <div className="flex items-center gap-3 rounded-xl border px-3 py-2" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
                </svg>
                <input
                  data-testid="location-input"
                  type="text"
                  placeholder="Search city, region, stadium or grid ID…"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/40"
                  style={{ fontFamily: "Manrope" }}
                />
                <button data-testid="location-submit" type="submit" className="text-[10px] tracking-[0.22em] px-3 py-1 rounded-full font-semibold" style={{ background: hazard.accent, color: "#0a0a0a", fontFamily: "JetBrains Mono" }}>SCAN</button>
              </div>
              {locationSubmitted && (
                <div data-testid="location-result" className="absolute left-0 right-0 mt-1 text-xs px-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Watching: <span style={{ color: hazard.accent }}>{locationSubmitted}</span>
                </div>
              )}
            </form>
          </div>

          {/* NORTH AMERICA — US STATE / TERRITORY LAYER */}
          {continentId === "na" && (
            <div data-testid="us-state-layer" className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-[10px] tracking-[0.28em] shrink-0" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>🇺🇸 US STATE / TERRITORY LAYER</span>
              <select
                data-testid="us-state-select"
                value={usStateId}
                onChange={(e) => {
                  setUsStateId(e.target.value);
                  const s = US_STATES.find((x) => x.id === e.target.value);
                  if (s) setHazardId(s.hazard);
                }}
                className="venue-select rounded-xl border px-3 py-2 text-sm outline-none flex-1 sm:max-w-md"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "white", fontFamily: "Manrope" }}
              >
                <option value="" style={{ background: "#0a0a0d" }}>— All 50 states + D.C., Puerto Rico, Guam, US Virgin Islands —</option>
                {US_STATES.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "#0a0a0d" }}>
                    {s.name} · {HAZARDS[s.hazard].emoji} {HAZARDS[s.hazard].label}
                  </option>
                ))}
              </select>
              {usState && (
                <span data-testid="us-state-active" className="text-[10px] tracking-[0.22em] px-3 py-1.5 rounded-full" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
                  ACTIVE CONFIG · {usState.name.toUpperCase()}
                </span>
              )}
            </div>
          )}

          {/* EUROPE — UNITED KINGDOM LAYER */}
          {continentId === "eu" && (
            <div data-testid="uk-kingdom-layer" className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>🇬🇧 UNITED KINGDOM LAYER</span>
              {UK_KINGDOMS.map((k) => {
                const active = k.id === ukKingdomId;
                return (
                  <button
                    key={k.id}
                    data-testid={`uk-kingdom-${k.id}`}
                    onClick={() => {
                      if (active) return setUkKingdomId("");
                      setUkKingdomId(k.id);
                      setHazardId(k.hazard);
                    }}
                    className="chip-btn px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      background: active ? hazard.accent : "transparent",
                      color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                      border: `1px solid ${active ? hazard.accent : "rgba(255,255,255,0.1)"}`,
                      fontFamily: "Manrope",
                    }}
                  >
                    <span>{k.flag}</span>
                    <span>{k.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* =============== MAIN =============== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Alerts marquee */}
        <Marquee items={hazard.alerts} accent={hazard.accent} />

        {/* GHANA NATIONAL MATRIX (only when Africa → Ghana) */}
        {isGhanaNational && (
          <section
            data-testid="ghana-matrix"
            className="rounded-3xl border p-5 sm:p-6"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
              <div>
                <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>SOVEREIGN LAYER · GHANA 🇬🇭</div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
                  16-Region National Matrix
                </h2>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Select any region to load localized telemetry, severity, and preparedness checklists.
                </p>
              </div>
              <div className="text-[10px] tracking-[0.28em] px-3 py-1 rounded-full" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
                ACTIVE · {ghanaRegion.name.toUpperCase()}{ashantiCity ? ` / ${ashantiCity.name.toUpperCase()}` : ""}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {GHANA_REGIONS.map((r) => {
                const active = r.id === ghanaRegionId;
                const hasSeverity = !!(r.severity && r.severity[hazardId]) || !!(r.cities && r.cities.some(c => c.severity && c.severity[hazardId]));
                return (
                  <button
                    key={r.id}
                    data-testid={`ghana-region-${r.id}`}
                    onClick={() => setGhanaRegionId(r.id)}
                    className="chip-btn text-left rounded-xl border px-3 py-2.5"
                    style={{
                      borderColor: active ? hazard.accent : "rgba(255,255,255,0.08)",
                      background: active ? hazard.accentSoft : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: active ? hazard.accent : "white", fontFamily: "Bricolage Grotesque" }}>{r.name}</span>
                      {hasSeverity && <span className="w-2 h-2 rounded-full" style={{ background: hazard.accent, boxShadow: `0 0 8px ${hazard.accent}` }} />}
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
                      {r.capital}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ashanti sub-city toggle */}
            {ghanaRegion.id === "ashanti" && (
              <div data-testid="ashanti-city-toggle" className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>FOCUS CITY</span>
                {ghanaRegion.cities.map((c) => {
                  const active = c.id === ashantiCityId;
                  return (
                    <button
                      key={c.id}
                      data-testid={`ashanti-city-${c.id}`}
                      onClick={() => setAshantiCityId(c.id)}
                      className="chip-btn px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{
                        background: active ? hazard.accent : "transparent",
                        color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                        border: `1px solid ${active ? hazard.accent : "rgba(255,255,255,0.1)"}`,
                        fontFamily: "Manrope",
                      }}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* MAP */}
        <section>
          <div className="flex items-end justify-between mb-3 gap-2 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
                Field Overview
              </h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {isGhanaNational
                  ? <>Localized to <span style={{ color: hazard.accent }}>{ashantiCity ? `${ashantiCity.name}, ${ghanaRegion.name}` : ghanaRegion.name}</span> · sensor mesh live.</>
                  : <>Continent: <span style={{ color: hazard.accent }}>{continent.label}</span> · Venue: <span style={{ color: hazard.accent }}>{venue.city}</span></>}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: hazard.accent }} />
              LIVE MESH · {hazard.markers.length} NODES · {readout.value}
            </div>
          </div>
          <MapCard hazard={hazard} timelineValue={timelineValue} coordsLabel={mapCoords} sectorLabel={mapSector} />
        </section>

        {/* EVENT & VENUE RISK SIMULATOR */}
        <section
          data-testid="venue-simulator"
          className="rounded-3xl border p-5 sm:p-8"
          style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)), #0a0a0d" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 03</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
                Event &amp; Venue Risk Simulator
              </h2>
              <p className="text-sm max-w-xl mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Cross-reference future event profiles across <span style={{ color: hazard.accent }}>{continent.label}</span> against the active hazard model.
              </p>
            </div>
            <div className="flex-1 lg:max-w-md">
              <label className="text-[10px] tracking-[0.22em] block mb-2" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>EVENT / VENUE PROFILE</label>
              <select
                data-testid="venue-select"
                value={venue.id}
                onChange={(e) => setVenueId(e.target.value)}
                className="venue-select w-full rounded-xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "white", fontFamily: "Manrope" }}
              >
                {Object.values(continent.venues).map((v) => (
                  <option key={v.id} value={v.id} style={{ background: "#0a0a0d" }}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Timeline + warning */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border p-5" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>
                    PREDICTIVE TIMELINE · <span style={{ color: hazard.accent }} data-testid="timeline-readout">{readout.band} · {readout.value}</span>
                  </span>
                  <span className="text-[10px] tracking-[0.22em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MACRO HORIZON · 2026–2030</span>
                </div>
                <div className="relative pt-1">
                  <input
                    data-testid="timeline-slider"
                    type="range"
                    className="timeline w-full"
                    min={0}
                    max={100}
                    step={1}
                    value={timelineValue}
                    onChange={(e) => setTimelineValue(parseInt(e.target.value, 10))}
                  />
                  {/* anchor pips */}
                  <div className="relative h-4 mt-2">
                    {TIMELINE_ANCHORS.map((a) => (
                      <div key={a.at} className="absolute -translate-x-1/2" style={{ left: `${a.at}%` }}>
                        <div className="w-px h-2 mx-auto" style={{ background: "rgba(255,255,255,0.25)" }} />
                        <div className="text-[10px] mt-1 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>{a.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {readout.sub}
                </div>
              </div>

              <div
                data-testid="venue-warning"
                className="mt-5 rounded-2xl border p-5 relative overflow-hidden"
                style={{ borderColor: `${venueWarningColor}55`, background: `linear-gradient(120deg, ${venueWarningColor}22, rgba(255,255,255,0.01))` }}
              >
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-40" style={{ background: venueWarningColor }} />
                <div className="flex items-start gap-3 relative">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: venueWarningColor, color: "#0a0a0a" }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.28em]" style={{ color: venueWarningColor, fontFamily: "JetBrains Mono" }}>
                      {venueWarningLabel}
                    </div>
                    <p className="mt-1 text-base sm:text-lg font-semibold leading-snug" style={{ fontFamily: "Bricolage Grotesque", color: "white" }} data-testid="venue-warning-text">
                      {venueWarningText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue meta panel */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border p-5 h-full flex flex-col gap-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div>
                  <div className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>ACTIVE PROFILE</div>
                  <div className="text-lg font-bold mt-1" style={{ fontFamily: "Bricolage Grotesque" }} data-testid="venue-active-label">
                    {isGhanaNational ? (ashantiCity ? `${ashantiCity.name} · ${ghanaRegion.name}` : `${ghanaRegion.name} · ${ghanaRegion.capital}`) : venue.label}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>CITY</div>
                    <div className="mt-1 font-semibold">{isGhanaNational ? (ashantiCity ? ashantiCity.name : ghanaRegion.capital) : venue.city}</div>
                  </div>
                  <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>COORDS</div>
                    <div className="mt-1 font-semibold" style={{ fontFamily: "JetBrains Mono" }}>{mapCoords}</div>
                  </div>
                  <div className="rounded-xl border p-3 col-span-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="text-[9px] tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>WINDOW</div>
                    <div className="mt-1 font-semibold">{isGhanaNational ? "Rolling 2026–2030 · Sovereign" : venue.horizon}</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>PROJECTED RISK</span>
                    <span className="text-xs font-bold" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }} data-testid="projected-risk-label">{projectedLabel}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="h-2 flex-1 rounded-full" style={{ background: i < projectedRisk ? hazard.accent : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHECKLIST */}
        <section data-testid="checklist-panel" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0d" }}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
            <div>
              <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 04</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
                Emergency Preparedness Checklist
              </h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Adapted for <span style={{ color: hazard.accent }}>{hazard.label}</span>
                {isGhanaNational ? <> · <span style={{ color: hazard.accent }}>{ashantiCity ? ashantiCity.name : ghanaRegion.name}</span></> : null} — tap each item to mark it complete.
              </p>
            </div>
            <div className="text-[10px] tracking-[0.28em] px-3 py-1 rounded-full self-start sm:self-auto" style={{ color: hazard.accent, background: hazard.accentSoft, fontFamily: "JetBrains Mono" }}>
              {effectiveChecklist.filter((_, i) => isChecked(i)).length}/{effectiveChecklist.length} COMPLETED
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {effectiveChecklist.map((item, idx) => {
              const key = `${hazardId}-${isGhanaNational ? (ashantiCity ? ashantiCity.id : ghanaRegion.id) : venueId}-${idx}`;
              return (
                <Checkbox
                  key={key}
                  id={key}
                  label={item}
                  accent={hazard.accent}
                  checked={isChecked(idx)}
                  onChange={() => toggleCheck(idx)}
                />
              );
            })}
          </div>
        </section>

        {/* UNIVERSAL ACCESSIBILITY ENGINE */}
        <AccessibilityEngine hazard={hazard} locationLabel={locationLabel} />

        {/* OMNI-CHANNEL CRISIS BROADCAST ENGINE */}
        <BroadcastCenter hazard={hazard} locationLabel={locationLabel} band={readout.band} />

        {/* JAMPO (LOYALTY) AI HUB & PUBLIC FORUM */}
        <AIHub hazard={hazard} locationLabel={locationLabel} riskLabel={projectedLabel} />

        {/* CAMPAIGN & SHARE PROMOTION CENTER */}
        <ShareCenter hazard={hazard} locationLabel={locationLabel} riskLabel={projectedLabel} />

        {/* DEVELOPER SPOTLIGHT */}
        <section data-testid="developer-spotlight" className="relative rounded-3xl border p-6 sm:p-10 overflow-hidden" style={{ borderColor: `${hazard.accent}33`, background: "linear-gradient(140deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: hazard.accent }} />
          <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: hazard.accent }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-start">
            <div className="lg:col-span-2 flex flex-col items-start gap-4">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl" style={{ background: hazard.accentSoft, border: `1px solid ${hazard.accent}44` }} data-testid="dev-avatar">
                👨‍💻
              </div>
              <div>
                <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>ABOUT THE DEVELOPER</div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }} data-testid="dev-name">
                  Sampson Kwadwo Jampo
                </h3>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                  aka <span className="font-semibold" style={{ color: hazard.accent }}>LOYALTY</span> · Obuasi, Ghana 🇬🇭
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] tracking-[0.22em] px-2.5 py-1 rounded-full" style={{ background: hazard.accentSoft, color: hazard.accent, fontFamily: "JetBrains Mono" }}>PROGRAMMING</span>
                <span className="text-[10px] tracking-[0.22em] px-2.5 py-1 rounded-full" style={{ background: hazard.accentSoft, color: hazard.accent, fontFamily: "JetBrains Mono" }}>ARTIFICIAL INTELLIGENCE</span>
                <span className="text-[10px] tracking-[0.22em] px-2.5 py-1 rounded-full" style={{ background: hazard.accentSoft, color: hazard.accent, fontFamily: "JetBrains Mono" }}>CRISIS SYSTEMS</span>
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col gap-6">
              <blockquote className="text-base sm:text-lg leading-relaxed" style={{ fontFamily: "Manrope", color: "rgba(255,255,255,0.88)" }} data-testid="dev-quote">
                <span className="text-3xl leading-none align-top mr-2" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }}>“</span>
                Driven by a passion to solve real-world global challenges, Jampo&apos;s Crisis Shield AI was engineered by <b>Sampson Kwadwo Jampo</b> (aka <b>LOYALTY</b>), a tech innovator from Obuasi, Ghana. Equipped with a deep focus on programming and artificial intelligence, my mission is to build digital solutions that protect communities and future-proof global infrastructure.
                <span className="text-3xl leading-none ml-1" style={{ color: hazard.accent, fontFamily: "Bricolage Grotesque" }}>”</span>
              </blockquote>

              <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${hazard.accent}33`, background: "rgba(255,255,255,0.02)" }}>
                <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>📞 &nbsp; LET&apos;S COLLABORATE</div>
                <p className="mt-2 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Manrope" }}>
                  Interested in partnerships, joining a tech team, or offering development contracts?
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    data-testid="dev-phone"
                    href="tel:+233598857686"
                    className="chip-btn flex items-center gap-3 rounded-xl border px-4 py-3"
                    style={{ borderColor: `${hazard.accent}55`, background: hazard.accentSoft }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] tracking-[0.22em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>CALL</span>
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: "Manrope" }}>+233 598 857 686</span>
                    </div>
                  </a>
                  <a
                    data-testid="dev-email"
                    href="mailto:jampokwadwosampson@gmail.com"
                    className="chip-btn flex items-center gap-3 rounded-xl border px-4 py-3"
                    style={{ borderColor: `${hazard.accent}55`, background: hazard.accentSoft }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={hazard.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-[10px] tracking-[0.22em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>EMAIL</span>
                      <span className="text-sm font-semibold text-white truncate" style={{ fontFamily: "Manrope" }}>jampokwadwosampson@gmail.com</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-2 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span style={{ fontFamily: "JetBrains Mono" }}>© 2026 JAMPO&apos;S CRISIS SHIELD AI · GLOBAL &amp; NATIONAL DISASTER INTELLIGENCE</span>
          <span style={{ fontFamily: "JetBrains Mono" }}>NODE · SEA-04 · UPLINK OK</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
