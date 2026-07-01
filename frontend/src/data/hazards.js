/* --------------------------- HAZARDS (6 total) --------------------------- */
export const HAZARDS = {
  flood: {
    id: "flood",
    label: "Flood Watch",
    emoji: "🌧️",
    accent: "#22d3ee",
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
    accent: "#fb923c",
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
    accent: "#f43f5e",
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
  storm: {
    id: "storm",
    label: "Severe Storm",
    emoji: "⛈️",
    accent: "#a78bfa", // deep purple (user-explicit)
    accentDeep: "#5b21b6",
    accentSoft: "rgba(167,139,250,0.14)",
    ring: "rgba(167,139,250,0.55)",
    riskLabel: "SEVERE",
    riskLevel: 4,
    tagline: "Supercell rotation and hail cores tracking across grid.",
    checklist: [
      "Charge devices and pre-stage backup batteries",
      "Move vehicles clear of tree canopy zones",
      "Identify an interior safe room (no exterior walls)",
    ],
    markers: [
      { x: 30, y: 38, size: 28, label: "Rotation Signature" },
      { x: 58, y: 60, size: 22, label: "Hail Core 3in" },
      { x: 75, y: 26, size: 18, label: "Lightning Cluster" },
      { x: 42, y: 74, size: 24, label: "Downburst Cell" },
    ],
    alerts: [
      "NWS: Severe thunderstorm watch until 22:00",
      "Lightning strike density 12/km² in Grid F-22",
      "Wind gusts 95kph reported at station K-9",
      "Hail signature detected — 5cm diameter",
    ],
  },
  earthquake: {
    id: "earthquake",
    label: "Earthquake Risk",
    emoji: "🫨",
    accent: "#a8a29e", // stone / gray-brown
    accentDeep: "#57534e",
    accentSoft: "rgba(168,162,158,0.16)",
    ring: "rgba(168,162,158,0.6)",
    riskLabel: "MODERATE",
    riskLevel: 2,
    tagline: "Seismic swarm frequency trending above 30-day baseline.",
    checklist: [
      "Secure heavy furniture and shelving to walls",
      "Practice 'Drop, Cover, Hold On' drill routes",
      "Prep 72h go-bag with water, meds, cash",
    ],
    markers: [
      { x: 26, y: 44, size: 24, label: "Epicenter M4.1" },
      { x: 60, y: 54, size: 18, label: "Fault Trace" },
      { x: 78, y: 36, size: 20, label: "Aftershock" },
      { x: 44, y: 70, size: 22, label: "Ground Motion" },
    ],
    alerts: [
      "USGS: M4.1 tremor 42km NE",
      "Seismic swarm frequency ↑ 18%",
      "Aftershock probability 62% in 24h",
      "Ground acceleration within nominal band",
    ],
  },
  tornado: {
    id: "tornado",
    label: "Tornado Watch",
    emoji: "🌪️",
    accent: "#0e7490", // dark cyan
    accentDeep: "#164e63",
    accentSoft: "rgba(14,116,144,0.18)",
    ring: "rgba(14,116,144,0.55)",
    riskLabel: "ELEVATED",
    riskLevel: 3,
    tagline: "Mesocyclone signatures forming along dryline convergence.",
    checklist: [
      "Locate lowest-floor windowless shelter",
      "Enable NOAA weather radio (SAME code alerts)",
      "Rehearse 5-minute lockdown with household",
    ],
    markers: [
      { x: 32, y: 50, size: 30, label: "Mesocyclone" },
      { x: 64, y: 40, size: 22, label: "Debris Signature" },
      { x: 80, y: 66, size: 18, label: "Rear Flank Downdraft" },
      { x: 46, y: 76, size: 26, label: "Storm Track NE" },
    ],
    alerts: [
      "SPC: Enhanced risk zone active",
      "Rotation detected on radar Grid J-04",
      "Storm cell tracking 55kph NE",
      "Debris signature confirmed 03:14 local",
    ],
  },
};

export const RISK_TIERS = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "SEVERE", "CRITICAL"];

/* --------------------------- TIMELINE MACRO SCALE --------------------------- */
// Slider value 0..100 maps to a fluid scale: Now → Hours → Days → Months → Years
export const TIMELINE_ANCHORS = [
  { at: 0, label: "Now" },
  { at: 15, label: "Hours" },
  { at: 40, label: "Days" },
  { at: 65, label: "Months" },
  { at: 90, label: "Years" },
];
export const timelineReadout = (v) => {
  if (v <= 15) {
    const h = Math.round((v / 15) * 24);
    return { band: "Hours", value: `T+${h}h`, sub: "Localized live telemetry" };
  }
  if (v <= 40) {
    const d = Math.round(1 + ((v - 15) / 25) * 29);
    return { band: "Days", value: `+${d}d`, sub: "Short-range forecast" };
  }
  if (v <= 65) {
    const m = Math.round(1 + ((v - 40) / 25) * 11);
    return { band: "Months", value: `+${m}mo`, sub: "Seasonal outlook" };
  }
  const year = Math.round(2026 + ((v - 65) / 35) * 4);
  return { band: "Years", value: `${year}`, sub: "Macro horizon 2026–2030" };
};
