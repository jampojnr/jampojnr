# Jampo's Crisis Shield AI — PRD

## Original Problem Statement
Mobile-first, fully interactive disaster-intelligence web app (pure client-side React, no backend). Originally "CrisisShield AI", upgraded (June 2026) to **"Jampo's Crisis Shield AI" v4.0** — a production-grade Global & National Disaster Intelligence platform by Sampson Kwadwo Jampo (aka LOYALTY), Obuasi, Ghana.

## User Choices (confirmed)
- Jampo AI Advisor: SIMULATED scripted intelligence (no LLM key usage)
- Language toggle: translates hazard summary panels only (pre-written)
- Broadcast/SOS engine: SIMULATED dispatches (no real SMS/WhatsApp)
- Citizen forum: client-side only (resets on refresh)

## Architecture (refactored June 2026)
```
/app/frontend/src/
├── App.js                      # Composition, global state, header layers, Ghana matrix, spotlight
├── data/
│   ├── hazards.js              # 6 hazards, risk tiers, timeline anchors/readout
│   ├── continents.js           # 7 continents + venues, US_STATES (54), UK_KINGDOMS (4)
│   ├── ghana.js                # 16-region Ghana matrix + severity exceptions
│   └── translations.js         # 6 languages × 6 hazard simplified summaries
└── components/
    ├── primitives.js           # Marquee, MapCard, Checkbox
    ├── AccessibilityEngine.js  # Language + Text/Audio/Visual modes (Module 05)
    ├── BroadcastCenter.js      # Omni-Channel Broadcast + SOS Dispatch Hub (Module 06)
    ├── AIHub.js                # Jampo AI terminal + Citizen Forum (Module 07)
    ├── ShareCenter.js          # Viral share snippets → clipboard (Module 08)
    ├── MonetizationCore.js     # Revenue cores + ad slots (Module 09)
    └── SupportModule.js        # MoMo/Paystack donations + 8 social links
```
No backend/DB used — all state is React client-side.

## Implemented (all tested 100% — /app/test_reports/iteration_1.json, June 2026)
1. **v1–v3 (previous sessions)**: 6 hazard themes w/ dynamic palettes, Risk Level badge, Location search, Live Alerts marquee, animated Field Overview map, Event & Venue Risk Simulator (FIFA 2026 / LA Olympics 2028 + Extreme Heat 42°C asphalt warning), macro timeline (Now→Hours→Days→Months→Years 2026-2030), Ghana 16-region matrix with Accra (RED), Obuasi (ORANGE), Kumasi, Sunyani severity exceptions, dynamic checklists, Developer Spotlight.
2. **v4 (this session)**:
   - Global rebrand to "Jampo's Crisis Shield AI" (header, tab title, meta, footer, spotlight)
   - 7 continents (added Australia/Oceania: Sydney/Queensland/NZ; Antarctica: McMurdo/Larsen C)
   - US State/Territory layer: 50 states + DC, PR, Guam, USVI — each mapped to hazard config; selection auto-switches hazard, map coords, warning card, risk bump
   - UK Kingdom layer (England, Scotland, Wales, N. Ireland) with storm-surge/precip/heat configs
   - Omni-Channel Crisis Broadcast Engine: phone/email/social inputs, 6 channel toggles, timeline-bound modes (Now/Hours → flashing red LIVE DISPATCHING; Days+ → blue PREDICTIVE BRIEFING)
   - Interactive SOS Dispatch Hub: Hospitals / Fire Service / Ghana Police / Military one-click pings with confirmation logs
   - Universal Accessibility Engine: 6 languages (EN/Twi/Ga/Hausa/FR/ES), Text/Audio (speechSynthesis + wave widget)/Visual (radar sweep) modes
   - Jampo (LOYALTY) AI Intelligence Hub: scripted terminal w/ gov mitigation logic (Odaw Basin etc.) + Citizen Data Feed & Idea Share forum
   - Campaign & Share Promotion Center: TikTok/Facebook/WhatsApp clipboard snippets
   - Monetization & Utility Data Ad Cores: Premium Telemetry SMS Layer, ISP Data Revenue Matrix, ad slot placeholders
   - Support & Contribution module: MTN MoMo +233 598 857 686, Paystack link, 8 verified social channels

## Backlog
- P1: Persist checklist items + last-viewed region/hazard to localStorage
- P1: Deep-link URL params (?continent=africa&region=ashanti&city=obuasi&hazard=flood)
- P2: Hazard tab hover mini-previews
- P2: Real geocoding for Location Input
- P2: Historical playback mode on timeline slider
- P2 (optional): Persist citizen forum posts to MongoDB backend; real AI via Emergent LLM key; real Paystack checkout integration
