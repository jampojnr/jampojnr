import { useEffect, useRef, useState } from "react";

const govSuggestion = (hazardId, loc) => {
  const l = loc.toLowerCase();
  if ((hazardId === "flood" || hazardId === "storm") && l.includes("accra"))
    return "AI Suggestion for Accra Metro: Deploy emergency barriers along the Odaw Basin immediately; throttle urban transit lanes until flood waters recede.";
  if ((hazardId === "flood" || hazardId === "storm") && l.includes("obuasi"))
    return "AI Suggestion for Obuasi Municipal: Dispatch pumping units to low-lying residential clusters; open temporary detours near the main road and log household asset damage for NADMO relief.";
  if ((hazardId === "flood" || hazardId === "storm") && l.includes("kumasi"))
    return "AI Suggestion for Kumasi Metro: Clear Kejetia and Adum drainage bottlenecks now; stage market-day traffic marshals to keep flash-flood pooling zones clear.";
  const map = {
    flood: `AI Suggestion for ${loc}: Pre-position sandbag stockpiles at drainage chokepoints, open shelters on elevated ground, and reroute traffic away from submerged corridors.`,
    wildfire: `AI Suggestion for ${loc}: Enforce burn bans, pre-stage aerial retardant assets on the downwind flank, and phase evacuation of WUI perimeter households.`,
    heat: `AI Suggestion for ${loc}: Extend cooling center hours to 24/7, shift outdoor labor to pre-dawn windows, and load-shed non-critical grid demand before peak radiance.`,
    storm: `AI Suggestion for ${loc}: Ground crane and scaffold operations, pre-position line-repair crews at substations, and issue shelter-in-place guidance for mobile structures.`,
    earthquake: `AI Suggestion for ${loc}: Fast-track soft-story retrofit inspections, stage urban search-and-rescue teams, and rehearse hospital surge triage protocols.`,
    tornado: `AI Suggestion for ${loc}: Activate siren mesh testing, publish community shelter maps, and pre-authorize school lockdown release procedures.`,
  };
  return map[hazardId];
};

const aiReply = (q, hazard, loc, riskLabel) => {
  const t = q.toLowerCase();
  if (t.includes("evacuat") || t.includes("safe") || t.includes("help") || t.includes("shelter"))
    return `Safety directive for ${loc}: follow the ${hazard.label} checklist above — priority actions are already ranked. Current risk tier is ${riskLabel}. If conditions escalate, move before official transport windows close.`;
  if (t.includes("government") || t.includes("authorit") || t.includes("mitigat") || t.includes("city") || t.includes("deploy"))
    return govSuggestion(hazard.id, loc);
  if (t.includes("predict") || t.includes("future") || t.includes("forecast") || t.includes("when"))
    return `Predictive model for ${loc}: ${hazard.tagline} Confidence band widens beyond 72h — recalibrate using the macro timeline slider for seasonal outlooks.`;
  if (t.includes("why") || t.includes("cause"))
    return `Causal analysis: ${hazard.label} conditions at ${loc} stem from the telemetry anomalies plotted on the field map. Cross-reference the live alert feed for sensor-level detail.`;
  return `Acknowledged. Monitoring ${hazard.label} telemetry for ${loc} — risk tier ${riskLabel}. Ask me about evacuation, government mitigation, or future forecasts for deeper analysis.`;
};

export const AIHub = ({ hazard, locationLabel, riskLabel }) => {
  const [lines, setLines] = useState([]);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, name: "Kwame A.", loc: "Obuasi", time: "8 min ago", text: "Water rising in lower Obuasi municipal houses, detours set up near main road." },
    { id: 2, name: "Adjoa M.", loc: "Accra", time: "22 min ago", text: "Kaneshie market area flooding again — keep children away from open gutters. Community pumps working at Odaw bridge." },
    { id: 3, name: "Ibrahim S.", loc: "Tamale", time: "1 hr ago", text: "Idea: paint high-water marks on lamp posts so everyone knows safe walking routes during the rains." },
  ]);
  const [postName, setPostName] = useState("");
  const [postText, setPostText] = useState("");
  const termRef = useRef(null);

  useEffect(() => {
    setLines((prev) => [
      ...prev.slice(-8),
      { type: "sys", text: `CONTEXT SYNC :: ${locationLabel} · ${hazard.label.toUpperCase()} · RISK ${riskLabel}` },
      { type: "ai", text: govSuggestion(hazard.id, locationLabel) },
    ]);
  }, [hazard.id, locationLabel, riskLabel, hazard.label]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

  const submitQuery = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLines((prev) => [...prev, { type: "user", text: q }, { type: "ai", text: aiReply(q, hazard, locationLabel, riskLabel) }]);
    setQuery("");
  };

  const submitPost = (e) => {
    e.preventDefault();
    const text = postText.trim();
    if (!text) return;
    setPosts((prev) => [{ id: Date.now(), name: postName.trim() || "Anonymous Citizen", loc: locationLabel, time: "Just now", text }, ...prev]);
    setPostText("");
  };

  return (
    <section data-testid="ai-hub" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0d" }}>
      <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 07</div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
        Jampo (LOYALTY) AI Intelligence Hub &amp; Public Forum
      </h2>
      <p className="text-sm mt-1 mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
        Cognitive crisis advisory for authorities + open citizen collaboration for <span style={{ color: hazard.accent }}>{locationLabel}</span>.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Part A — AI Command Center */}
        <div className="rounded-2xl border overflow-hidden flex flex-col" style={{ borderColor: `${hazard.accent}33`, background: "#060608" }} data-testid="ai-terminal">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] tracking-[0.22em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
              🤖 JAMPO (LOYALTY) — CRISIS ADVISOR AI · ONLINE
            </span>
          </div>
          <div ref={termRef} className="flex-1 p-4 space-y-2 overflow-y-auto max-h-72 min-h-[220px]" style={{ fontFamily: "JetBrains Mono" }}>
            {lines.map((l, i) => (
              <div key={i} className="text-xs leading-relaxed" data-testid={`terminal-line-${l.type}`}>
                {l.type === "sys" && <span style={{ color: "rgba(255,255,255,0.4)" }}>▸ {l.text}</span>}
                {l.type === "ai" && <span style={{ color: hazard.accent }}>JAMPO_AI&gt; <span style={{ color: "rgba(255,255,255,0.85)" }}>{l.text}</span></span>}
                {l.type === "user" && <span style={{ color: "#22c55e" }}>OPERATOR&gt; <span style={{ color: "rgba(255,255,255,0.7)" }}>{l.text}</span></span>}
              </div>
            ))}
          </div>
          <form onSubmit={submitQuery} className="flex items-center gap-2 px-3 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="text-xs" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>&gt;_</span>
            <input
              data-testid="ai-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about evacuation, mitigation, forecasts…"
              className="bg-transparent flex-1 outline-none text-xs placeholder:text-white/30"
              style={{ fontFamily: "JetBrains Mono", color: "white" }}
            />
            <button data-testid="ai-query-submit" type="submit" className="text-[10px] tracking-[0.2em] px-3 py-1 rounded-full font-semibold" style={{ background: hazard.accent, color: "#0a0a0a", fontFamily: "JetBrains Mono" }}>
              RUN
            </button>
          </form>
        </div>

        {/* Part B — Citizen Forum */}
        <div className="rounded-2xl border p-4 flex flex-col" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }} data-testid="citizen-forum">
          <div className="text-[10px] tracking-[0.28em] mb-3" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>
            🗣️ CITIZEN DATA FEED &amp; IDEA SHARE
          </div>
          <form onSubmit={submitPost} className="space-y-2 mb-4">
            <input
              data-testid="forum-name-input"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full rounded-lg border px-3 py-2 text-xs bg-transparent outline-none placeholder:text-white/35"
              style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "Manrope", color: "white" }}
            />
            <div className="flex gap-2">
              <input
                data-testid="forum-post-input"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="Share a live hazard update or safety idea…"
                className="flex-1 rounded-lg border px-3 py-2 text-xs bg-transparent outline-none placeholder:text-white/35 min-w-0"
                style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "Manrope", color: "white" }}
              />
              <button data-testid="forum-post-submit" type="submit" className="chip-btn px-4 rounded-lg text-xs font-bold" style={{ background: hazard.accent, color: "#0a0a0a", fontFamily: "Bricolage Grotesque" }}>
                POST
              </button>
            </div>
          </form>
          <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
            {posts.map((p) => (
              <div key={p.id} className="rounded-xl border px-3 py-2.5" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }} data-testid="forum-post">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold" style={{ fontFamily: "Bricolage Grotesque", color: hazard.accent }}>👤 {p.name} · {p.loc}</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "JetBrains Mono" }}>{p.time}</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Manrope" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
