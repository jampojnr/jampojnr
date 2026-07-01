# CrisisShield AI — PRD

## Original problem statement
Build a mobile-first responsive web app named **CrisisShield AI** with:
1. Top nav + 3 hazard toggle buttons (Flood Watch 🌧️ / Wildfire Threat 🔥 / Extreme Heat ☀️) that instantly change the accent theme (Cool Blue / Deep Orange / Bright Crimson).
2. Large central Map Card styled as responsive grid overlay.
3. Dynamic Emergency Preparedness Checklist that adapts to the selected hazard.
4. Smooth green strike-through animation on checkbox completion.

## User-added scope
- **Event & Venue Risk Simulator** module: dropdown (FIFA WC 2026, LA Olympics 2028, Niche Urban Venues — Accra) + predictive timeline slider + adaptive infrastructure warning.
  - LA Olympics + Extreme Heat MUST display: *"Projected asphalt surface expansion exceeds 42°C. Risk of heavy transit delays and venue equipment cooling strain."*
- Risk Level Indicator badge (color follows hazard).
- Location Input search box (cities / stadiums).
- Live Alerts Feed marquee component.

## Architecture
- **Frontend only**, self-contained. Implemented as a single React component (`/app/frontend/src/App.js`) using Tailwind + inline CSS variables; no backend calls, no external APIs.
- Fonts (Google Fonts injected at runtime): Bricolage Grotesque (display), Manrope (body), JetBrains Mono (accent/telemetry).
- State: `useState` for hazard, venue, timeline hour, location, checklist completion.

## What's been implemented (2026-02)
- Sticky top nav with brand mark, 3 hazard toggles, live Risk Level badge (ELEVATED / SEVERE / CRITICAL).
- Location search input + Live Alerts marquee with per-hazard content.
- Map card: grid overlay, diagonal hatch, crosshair, 4 pulse markers per hazard with labels, sweep line, telemetry footer.
- Event & Venue Risk Simulator: venue dropdown, 0–72h predictive timeline slider, adaptive infrastructure warning card, venue meta panel with city/coords/window + 5-tier projected risk bar.
- Emergency Preparedness Checklist: dynamic items per hazard, green strike-through animation, DONE/PENDING pill, completion counter.
- Accent theme switching drives every color across the UI (nav, map grid, markers, badge, marquee, warning, sliders, checklist).

## Test IDs (for QA)
`crisisshield-root`, `top-nav`, `brand-title`, `hazard-btn-flood|wildfire|heat`, `risk-level-badge`, `risk-level-label`, `location-input`, `location-submit`, `location-result`, `live-alerts-marquee`, `map-card`, `map-marker-0..3`, `venue-simulator`, `venue-select`, `venue-active-label`, `timeline-slider`, `venue-warning`, `venue-warning-text`, `projected-risk-label`, `checklist-panel`, `checklist-item-<hazard>-<idx>`, `checklist-checkbox-<hazard>-<idx>`.

## Backlog / next
- P1: Persist checklist state to `localStorage` per hazard.
- P1: Shareable link that encodes hazard + venue + timeline.
- P2: Real geolocation lookup via a free API for the location search.
- P2: Historical playback mode on the timeline slider.
