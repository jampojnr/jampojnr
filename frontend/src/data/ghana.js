/* --------------------- GHANA REGIONS (16 Administrative) --------------------- */
// Each region can override the hazard tagline, checklist, markers, and provide
// a `severity` block that surfaces the required Ghana-specific alerts.
export const GHANA_REGIONS = [
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
