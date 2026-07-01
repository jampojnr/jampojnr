import { useEffect, useMemo, useState } from "react";
import "@/App.css";

/* ==========================================================================
 * CrisisShield AI — Global & National Disaster Intelligence Platform
 * Self-contained, client-only. All state lives in this file.
 * ========================================================================== */

/* --------------------------- HAZARDS (6 total) --------------------------- */
const HAZARDS = {
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

/* ------------------------------ CONTINENTS ------------------------------ */
const CONTINENTS = {
  na: {
    id: "na",
    label: "North America",
    emoji: "🌎",
    coords: "39.09° N, 94.57° W",
    venues: {
      wc2026: {
        id: "wc2026",
        label: "FIFA World Cup 2026 (North America)",
        city: "Kansas City, MO",
        coords: "39.0997° N, 94.5786° W",
        horizon: "June 11 – July 19, 2026",
        profile: {
          flood: "Midwest convective storms elevate surge risk at riverfront fan zones; contingency drainage recommended near Arrowhead.",
          wildfire: "Low ignition risk in venue corridor; monitor secondary smoke drift from western states.",
          heat: "Historical June peaks approach 38°C with humidity spikes — plan mid-match hydration timeouts.",
          storm: "Supercell corridor active across plains states — venue lightning-hold protocols required.",
          earthquake: "New Madrid seismic zone within 500km; low but non-zero risk during venue window.",
          tornado: "Peak tornado season overlaps group stage — implement rapid-shelter triage plan.",
        },
      },
      la2028: {
        id: "la2028",
        label: "Los Angeles Olympics 2028",
        city: "Los Angeles, CA",
        coords: "34.0522° N, 118.2437° W",
        horizon: "July 14 – July 30, 2028",
        profile: {
          flood: "Limited pluvial risk in July; atmospheric river anomalies since 2023 warrant flash-flood staging near LA River venues.",
          wildfire: "Santa Ana wind window overlaps closing ceremony — pre-position air quality contingencies.",
          heat: "Projected asphalt surface expansion exceeds 42°C. Risk of heavy transit delays and venue equipment cooling strain.",
          storm: "Marginal severe risk; monsoon backdoor cells possible during evening events.",
          earthquake: "San Andreas & Puente Hills faults <30km — venue seismic hardening audits mandatory.",
          tornado: "Historically negligible in basin; contingency routines maintained.",
        },
      },
      nyc: {
        id: "nyc",
        label: "NYC Metro Transit Hubs",
        city: "New York, NY",
        coords: "40.7128° N, 74.0060° W",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Storm surge & MTA tunnel infiltration remain top-tier risks after Ida & Sandy precedents.",
          wildfire: "Canadian wildfire smoke drift can push AQI >250 in summer — HVAC filtration protocols engaged.",
          heat: "Urban heat island amplifies feels-like index by 4–6°C across dense boroughs.",
          storm: "Nor'easter cycles produce compound wind + coastal flooding events.",
          earthquake: "Ramapo fault system — low seismicity, high building fragility.",
          tornado: "Rare EF0–EF1 outbreaks documented over past decade.",
        },
      },
    },
  },
  sa: {
    id: "sa",
    label: "South America",
    emoji: "🌎",
    coords: "23.55° S, 46.63° W",
    venues: {
      sp: {
        id: "sp",
        label: "São Paulo Metropolitan Corridor",
        city: "São Paulo, Brazil",
        coords: "23.5505° S, 46.6333° W",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Tietê basin overflow historically paralyzes marginal expressways during austral summer.",
          wildfire: "Cerrado edge fires migrate toward metropolitan periphery in dry August–October window.",
          heat: "Sequential heat domes since 2023 push apparent temperature past 43°C.",
          storm: "Frequent squall lines with damaging downbursts across ABC district.",
          earthquake: "Intraplate seismicity negligible; monitoring for induced tremors near reservoirs.",
          tornado: "Rare but documented EF2 events on southern periphery.",
        },
      },
      rio: {
        id: "rio",
        label: "Rio de Janeiro Coastal Belt",
        city: "Rio de Janeiro, Brazil",
        coords: "22.9068° S, 43.1729° W",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Landslide-prone favelas activate compound flood + slope failure alerts each summer.",
          wildfire: "Serra da Tijuca dry-lightning events tracked in preserve buffer zones.",
          heat: "Record 44°C thermal sensation events documented in 2023–2024.",
          storm: "Convective downpours produce 100mm/hr micro-events at Guanabara Bay margin.",
          earthquake: "Passive margin — minimal risk.",
          tornado: "Historically negligible.",
        },
      },
      bogota: {
        id: "bogota",
        label: "Bogotá Andean Plateau",
        city: "Bogotá, Colombia",
        coords: "4.7110° N, 74.0721° W",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Bimodal ENSO regime drives sharp bogotá savanna flooding cycles.",
          wildfire: "Paramo fires threaten upland water catchments each dry season.",
          heat: "Elevation buffers heat, but UV exposure elevated year-round.",
          storm: "Afternoon convective cores routine — hail damage at El Dorado airport corridor.",
          earthquake: "Eastern Cordillera thrust faults active — moderate seismic exposure.",
          tornado: "Extremely rare.",
        },
      },
    },
  },
  eu: {
    id: "eu",
    label: "Europe",
    emoji: "🌍",
    coords: "48.13° N, 11.58° E",
    venues: {
      alps: {
        id: "alps",
        label: "Alpine Convective Storm Track",
        city: "Munich – Milan corridor",
        coords: "46.87° N, 10.42° E",
        horizon: "May – Sept, 2026–2030",
        profile: {
          flood: "Snowmelt + orographic rain produces flash flood pulses across northern Italian tributaries.",
          wildfire: "Piedmont & Ticino valleys show accelerating summer fire seasons.",
          heat: "Alpine heat anomalies eroding glacier equilibrium — venue cable-car strain modeled.",
          storm: "Foehn wind + supercell interaction generates damaging hail (>7cm) events annually.",
          earthquake: "Northern Italian thrust belt — moderate seismic exposure across the corridor.",
          tornado: "Waterspout & landspout activity documented over Lake Como and Lake Garda.",
        },
      },
      london: {
        id: "london",
        label: "Greater London Flood Basin",
        city: "London, UK",
        coords: "51.5074° N, 0.1278° W",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Thames Barrier closure frequency doubling per decade — surge stress on Docklands cluster.",
          wildfire: "Urban grass-fire events (2022 precedent) recurring in dry summers.",
          heat: "40°C threshold breached in 2022 — infrastructure not designed for sustained exposure.",
          storm: "North Atlantic named-storm cycle intensifying autumn wind events.",
          earthquake: "Historically stable.",
          tornado: "Low probability but non-zero EF0–EF1 events documented in home counties.",
        },
      },
      istanbul: {
        id: "istanbul",
        label: "Istanbul Bosphorus Corridor",
        city: "Istanbul, Türkiye",
        coords: "41.0082° N, 28.9784° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Flash flood events in Karaköy-Eminönü basin repeating each spring.",
          wildfire: "Marmara forest belt fires threaten European-side ridgelines.",
          heat: "Sustained 40°C+ event windows lengthening over decade.",
          storm: "Lodos wind events + convective bursts cause peak-hour disruption.",
          earthquake: "North Anatolian Fault stress accumulation — highest priority risk in region.",
          tornado: "Sea of Marmara waterspouts documented.",
        },
      },
    },
  },
  asia: {
    id: "asia",
    label: "Asia",
    emoji: "🌏",
    coords: "35.68° N, 139.69° E",
    venues: {
      tokyo: {
        id: "tokyo",
        label: "Tokyo Dense Grid Warning Zone",
        city: "Tokyo, Japan",
        coords: "35.6762° N, 139.6503° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Kanda & Sumida basin overflow scenarios modeled for 100-year rain events.",
          wildfire: "Peri-urban forest fringe fires monitored across Okutama corridor.",
          heat: "Record 41°C events observed; grid load spikes stress rail HVAC.",
          storm: "Typhoon backend rain-bands drive compound wind + flood exposure.",
          earthquake: "Nankai Trough & Sagami Trough — one of highest global-priority zones.",
          tornado: "Convective tornado events documented — Chiba corridor most exposed.",
        },
      },
      seoul: {
        id: "seoul",
        label: "Seoul Metropolitan Watershed",
        city: "Seoul, South Korea",
        coords: "37.5665° N, 126.9780° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Han River tributary basin — 2022 Gangnam precedent drives basement flood readiness.",
          wildfire: "Gangwon dry-season fires spread across peri-urban corridors.",
          heat: "Peninsula heat waves lengthening; humid nights push wet-bulb thresholds.",
          storm: "Changma monsoonal storm cells produce 100mm+/hr micro-events.",
          earthquake: "Moderate seismicity — Pohang 2017 induced event precedent monitored.",
          tornado: "Rare; waterspouts along Yellow Sea coast.",
        },
      },
      delhi: {
        id: "delhi",
        label: "Delhi NCR Urban Grid",
        city: "New Delhi, India",
        coords: "28.6139° N, 77.2090° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Yamuna 100-year floodplain encroached — 2023 flood record likely to be exceeded.",
          wildfire: "Aravalli scrubland fires spreading during pre-monsoon dry window.",
          heat: "50°C surface temps recorded; heat stroke public health emergency modeled.",
          storm: "Pre-monsoon dust storms + convective bursts common in May–June.",
          earthquake: "Himalayan seismic gap — long-term high-priority exposure.",
          tornado: "Rare mesocyclonic events; dust devils common.",
        },
      },
    },
  },
  africa: {
    id: "africa",
    label: "Africa",
    emoji: "🌍",
    coords: "5.60° N, 0.19° W",
    venues: {
      ghana: {
        id: "ghana",
        label: "Ghana National Matrix (16 Regions)",
        city: "Accra, Ghana",
        coords: "5.6037° N, 0.1870° W",
        horizon: "Rolling 2026–2030 · Sovereign focus",
        isNational: true,
        profile: {
          flood: "Coastal monsoon overflow historically overwhelms Odaw drainage — regional matrix required.",
          wildfire: "Harmattan dust events elevate peri-urban ignition risk across northern regions.",
          heat: "Sustained tropical heat + humidity produces dangerous wet-bulb readings.",
          storm: "Squall-line & thunderstorm complexes cross-cut inland regions each rainy season.",
          earthquake: "Southern Ghana passive fault reactivation monitored near Akosombo.",
          tornado: "Historically rare, but severe downburst events documented.",
        },
      },
      lagos: {
        id: "lagos",
        label: "Lagos Coastal Megacity",
        city: "Lagos, Nigeria",
        coords: "6.5244° N, 3.3792° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "Lagoon tidal reflux + subsidence produces chronic Victoria Island flooding.",
          wildfire: "Peri-urban scrubland fires monitored in Ogun buffer.",
          heat: "Humid tropical heat drives dangerous wet-bulb episodes.",
          storm: "West African monsoon squall lines strike with damaging winds.",
          earthquake: "Passive margin — minimal exposure.",
          tornado: "Extremely rare.",
        },
      },
      nairobi: {
        id: "nairobi",
        label: "Nairobi Rift Highlands",
        city: "Nairobi, Kenya",
        coords: "1.2921° S, 36.8219° E",
        horizon: "Rolling 2026–2030",
        profile: {
          flood: "El Niño-driven long-rain overflow inundates informal settlements each cycle.",
          wildfire: "Peri-urban grassland fires escalate in dry January–March window.",
          heat: "Elevation moderates heat; UV extreme year-round.",
          storm: "Afternoon convective cores routine; hail damage recorded annually.",
          earthquake: "East African Rift — moderate exposure with historical events.",
          tornado: "Rare.",
        },
      },
    },
  },
};

/* --------------------- GHANA REGIONS (16 Administrative) --------------------- */
// Each region can override the hazard tagline, checklist, markers, and provide
// a `severity` block that surfaces the required Ghana-specific alerts.
const GHANA_REGIONS = [
  {
    id: "greater-accra",
    name: "Greater Accra",
    capital: "Accra",
    coords: "5.6037° N, 0.1870° W",
    severity: {
      flood: {
        label: "CATASTROPHIC RED ALERT",
        color: "#dc2626",
        message:
          "CRITICAL OVERFLOW — Odaw Basin & Kaneshie–Circle network heavily inundated. Extreme structural property loss, roads submerged, high public safety emergency threat.",
      },
      storm: {
        label: "CATASTROPHIC RED ALERT",
        color: "#dc2626",
        message:
          "CRITICAL OVERFLOW — Odaw Basin & Kaneshie–Circle network heavily inundated. Extreme structural property loss, roads submerged, high public safety emergency threat.",
      },
    },
    checklist: {
      flood: [
        "Evacuate Odaw basin low-lying compounds immediately",
        "Do NOT drive through Kaneshie–Circle submerged corridors",
        "Register with NADMO shelter at nearest school/clinic",
      ],
    },
  },
  {
    id: "ashanti",
    name: "Ashanti",
    capital: "Kumasi",
    coords: "6.6885° N, 1.6244° W",
    // Ashanti supports two focus cities: Kumasi (default) and Obuasi.
    cities: [
      {
        id: "kumasi",
        name: "Kumasi",
        coords: "6.6885° N, 1.6244° W",
        severity: {
          flood: {
            label: "MUNICIPAL HAZARD",
            color: "#f59e0b",
            message:
              "High-density urban sector flash flood pooling detected around key markets and central transit networks.",
          },
          storm: {
            label: "MUNICIPAL HAZARD",
            color: "#f59e0b",
            message:
              "High-density urban sector flash flood pooling detected around key markets and central transit networks.",
          },
        },
        checklist: {
          flood: [
            "Avoid Kejetia & Adum market drainage bottlenecks",
            "Keep motorbikes clear of pooling around Roman Hill",
            "Cache 24h drinking water — mains disruption expected",
          ],
        },
      },
      {
        id: "obuasi",
        name: "Obuasi",
        coords: "6.2027° N, 1.6664° W",
        severity: {
          flood: {
            label: "ELEVATED RESIDENTIAL IMPACT — ORANGE ALERT",
            color: "#f97316",
            message:
              "RESIDENTIAL WATER INTRUSION — Surface runoff pooling detected in localized municipal sectors. Water entering low-lying residential houses; tracking as non-structural asset disruption. System flags as localized threat distinct from coastal crisis anomalies.",
          },
          storm: {
            label: "ELEVATED RESIDENTIAL IMPACT — ORANGE ALERT",
            color: "#f97316",
            message:
              "RESIDENTIAL WATER INTRUSION — Surface runoff pooling detected in localized municipal sectors. Water entering low-lying residential houses; tracking as non-structural asset disruption. System flags as localized threat distinct from coastal crisis anomalies.",
          },
        },
        checklist: {
          flood: [
            "Raise floor-level electronics onto blocks (>30cm)",
            "Clear compound drains around Central & Anyinam sectors",
            "Document damaged household assets for NADMO claim",
          ],
        },
      },
    ],
  },
  {
    id: "central",
    name: "Central",
    capital: "Cape Coast",
    coords: "5.1053° N, 1.2466° W",
  },
  {
    id: "western",
    name: "Western",
    capital: "Sekondi-Takoradi",
    coords: "4.9344° N, 1.7133° W",
  },
  {
    id: "eastern",
    name: "Eastern",
    capital: "Koforidua",
    coords: "6.0940° N, 0.2593° W",
  },
  {
    id: "volta",
    name: "Volta",
    capital: "Ho",
    coords: "6.6017° N, 0.4713° E",
  },
  {
    id: "bono",
    name: "Bono",
    capital: "Sunyani",
    coords: "7.3392° N, 2.3266° W",
    severity: {
      wildfire: {
        label: "DRY-SEASON HARMATTAN ALERT",
        color: "#fb923c",
        message:
          "Severe Harmattan vegetative drying active. Elevated wildfire indexing mapped across peri-urban agricultural zones.",
      },
      // The user asked for a Sunyani "dry-season custom warning" — surface it on wildfire
      // and also on Severe Storm as complementary telemetry when applicable.
      storm: {
        label: "DRY-SEASON HARMATTAN ALERT",
        color: "#fb923c",
        message:
          "Severe Harmattan vegetative drying active. Elevated wildfire indexing mapped across peri-urban agricultural zones.",
      },
    },
    checklist: {
      wildfire: [
        "Clear 10m defensible perimeter around farm compounds",
        "Suspend controlled burns until Harmattan window closes",
        "Register livestock evacuation route with district assembly",
      ],
    },
  },
  {
    id: "bono-east",
    name: "Bono East",
    capital: "Techiman",
    coords: "7.5900° N, 1.9400° W",
  },
  {
    id: "ahafo",
    name: "Ahafo",
    capital: "Goaso",
    coords: "6.8000° N, 2.5167° W",
  },
  {
    id: "northern",
    name: "Northern",
    capital: "Tamale",
    coords: "9.4008° N, 0.8393° W",
  },
  {
    id: "savannah",
    name: "Savannah",
    capital: "Damongo",
    coords: "9.0833° N, 1.8167° W",
  },
  {
    id: "north-east",
    name: "North East",
    capital: "Nalerigu",
    coords: "10.5192° N, 0.3672° W",
  },
  {
    id: "upper-east",
    name: "Upper East",
    capital: "Bolgatanga",
    coords: "10.7856° N, 0.8514° W",
  },
  {
    id: "upper-west",
    name: "Upper West",
    capital: "Wa",
    coords: "10.0601° N, 2.5057° W",
  },
  {
    id: "oti",
    name: "Oti",
    capital: "Dambai",
    coords: "8.0667° N, 0.1833° E",
  },
  {
    id: "western-north",
    name: "Western North",
    capital: "Sefwi Wiawso",
    coords: "6.2138° N, 2.4855° W",
  },
];

const RISK_TIERS = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "SEVERE", "CRITICAL"];

/* --------------------------- TIMELINE MACRO SCALE --------------------------- */
// Slider value 0..100 maps to a fluid scale: Now → Hours → Days → Months → Years
const TIMELINE_ANCHORS = [
  { at: 0, label: "Now" },
  { at: 15, label: "Hours" },
  { at: 40, label: "Days" },
  { at: 65, label: "Months" },
  { at: 90, label: "Years" },
];
const timelineReadout = (v) => {
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
const Marquee = ({ items, accent }) => {
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

const MapCard = ({ hazard, timelineValue, coordsLabel, sectorLabel }) => {
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

  const continent = CONTINENTS[continentId];
  const venue = continent.venues[venueId] || Object.values(continent.venues)[0];
  const isGhanaNational = continent.id === "africa" && venue.id === "ghana";
  const hazard = HAZARDS[hazardId];

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
    if (readout.band === "Years") base = Math.max(0, base - 1);
    return Math.min(5, Math.max(0, base));
  }, [hazard, localSeverity, venueId, hazardId, readout.band]);

  const projectedLabel = RISK_TIERS[projectedRisk];

  // Coordinates/sector for map header
  const mapCoords = isGhanaNational ? (ashantiCity ? ashantiCity.coords : ghanaRegion.coords) : venue.coords;
  const mapSector = isGhanaNational ? (ashantiCity ? `${ghanaRegion.name.toUpperCase()} · ${ashantiCity.name.toUpperCase()}` : ghanaRegion.name.toUpperCase()) : hazard.id.toUpperCase();

  // Venue warning text — use profile OR Ghana severity if applicable
  const venueWarningText = localSeverity ? localSeverity.message : venue.profile[hazardId];
  const venueWarningLabel = localSeverity ? localSeverity.label : `INFRASTRUCTURE WARNING · ${venue.city.toUpperCase()}`;
  const venueWarningColor = localSeverity ? localSeverity.color : hazard.accent;

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
                  CrisisShield <span style={{ color: hazard.accent }}>AI</span>
                </h1>
                <p className="text-[11px] tracking-[0.22em] mt-1" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono" }}>
                  GLOBAL &amp; NATIONAL DISASTER INTELLIGENCE · v3.0
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
                Driven by a passion to solve real-world global challenges, CrisisShield AI was engineered by <b>Sampson Kwadwo Jampo</b> (aka <b>LOYALTY</b>), a tech innovator from Obuasi, Ghana. Equipped with a deep focus on programming and artificial intelligence, my mission is to build digital solutions that protect communities and future-proof global infrastructure.
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
          <span style={{ fontFamily: "JetBrains Mono" }}>© 2026 CRISISSHIELD AI · GLOBAL &amp; NATIONAL DISASTER INTELLIGENCE</span>
          <span style={{ fontFamily: "JetBrains Mono" }}>NODE · SEA-04 · UPLINK OK</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
