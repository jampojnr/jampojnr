import { useEffect, useState } from "react";

const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp Ping", icon: "💬" },
  { id: "telegram", label: "Telegram Bot Alert", icon: "✈️" },
  { id: "messenger", label: "Facebook Messenger Notification", icon: "📨" },
  { id: "sms", label: "SMS Text", icon: "📱" },
  { id: "call", label: "Automated Phone Call", icon: "📞" },
  { id: "email", label: "Email Briefing", icon: "📧" },
];

const IMMEDIATE = {
  flood: "Catastrophic flooding anomaly active. Evacuate low-lying zones immediately!",
  wildfire: "Fast-moving fire front approaching. Evacuate along designated routes now!",
  heat: "Life-threatening heat spike in progress. Seek cooling centers immediately!",
  storm: "Destructive storm cell inbound. Shelter indoors away from windows now!",
  earthquake: "Strong aftershock window active. Drop, cover and hold on — avoid damaged structures!",
  tornado: "Tornado on the ground. Move to lowest windowless shelter immediately!",
};

const PREDICTIVE = {
  flood: "Hydrological models flag elevated flood risk over the coming period. Review drainage and evacuation preparedness.",
  wildfire: "Arid grassland drying anomalies flag incoming severe fire and drought risks over the next 3 months.",
  heat: "Long-range thermal models project sustained heat dome formation. Pre-plan cooling center capacity.",
  storm: "Seasonal convective outlooks show intensifying storm cycles ahead. Audit roofing and grid resilience.",
  earthquake: "Seismic strain accumulation trending upward on regional faults. Schedule structural retrofit reviews.",
  tornado: "Climatological models flag an active tornado season ahead. Rehearse community shelter drills.",
};

const SOS_UNITS = [
  { id: "hospitals", icon: "⚠️", label: "Broadcast to Nearby Hospitals", color: "#f59e0b", msg: (loc) => `MEDICAL TELEMETRY ROUTED — Trauma bays at 4 hospitals nearest ${loc} notified. Ambulance staging confirmed; casualty intake channels open.` },
  { id: "fire", icon: "🚨", label: "Signal Fire Service", color: "#ef4444", msg: (loc) => `FIRE SERVICE ALERTED — Critical dispatch sent to closest fire station to ${loc}. Engine crew rolling; hydrant grid unlocked along approach route.` },
  { id: "police", icon: "🔵", label: "Ping Ghana Police Command", color: "#3b82f6", msg: (loc) => `GHANA POLICE COMMAND PINGED — Localized hazard coordinates for ${loc} transmitted to closest units for security cordons and traffic control.` },
  { id: "military", icon: "🎖️", label: "Deploy Military Defense Units", color: "#22c55e", msg: (loc) => `MILITARY DEFENSE UNITS DEPLOYED — Strategic alert issued to nearby armed forces and army engineers to coordinate structural rescue operations at ${loc}.` },
];

export const BroadcastCenter = ({ hazard, locationLabel, band }) => {
  const [contact, setContact] = useState({ phone: "", email: "", social: "" });
  const [channels, setChannels] = useState({ whatsapp: true, sms: true });
  const [feed, setFeed] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [sosLog, setSosLog] = useState([]);

  const triggerSos = (unit) => {
    setSosLog((prev) => [
      { id: Date.now(), icon: unit.icon, color: unit.color, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), text: unit.msg(locationLabel) },
      ...prev.slice(0, 5),
    ]);
  };

  const isImmediate = band === "Hours";
  const activeChannels = CHANNELS.filter((c) => channels[c.id]);

  const buildFeed = () =>
    activeChannels.map((c, i) => ({
      id: `${Date.now()}-${i}`,
      icon: c.icon,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: isImmediate
        ? `${c.label} sent to ${locationLabel} subscribers: ${IMMEDIATE[hazard.id]}`
        : `${c.label} scheduled: ${PREDICTIVE[hazard.id]} Target zone — ${locationLabel}.`,
    }));

  const dispatch = () => {
    const hasContact = contact.phone.trim() || contact.email.trim() || contact.social.trim();
    if (!hasContact) return setError("Provide at least one contact channel (phone, email or social handle).");
    if (activeChannels.length === 0) return setError("Select at least one delivery channel.");
    setError("");
    setSubscribed(true);
    setFeed(buildFeed());
  };

  useEffect(() => {
    if (subscribed) setFeed(buildFeed());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImmediate, hazard.id, locationLabel]);

  const modeColor = isImmediate ? "#ef4444" : "#3b82f6";

  return (
    <section
      data-testid="broadcast-center"
      className="rounded-3xl border p-5 sm:p-8"
      style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0a0a0d" }}
    >
      <style>{`
        @keyframes flashRed { 0%,100% { opacity: 1; box-shadow: 0 0 30px rgba(239,68,68,0.5);} 50% { opacity: 0.55; box-shadow: 0 0 8px rgba(239,68,68,0.2);} }
        .flash-red { animation: flashRed 1s ease-in-out infinite; }
        @keyframes calmPulse { 0%,100% { box-shadow: 0 0 24px rgba(59,130,246,0.25);} 50% { box-shadow: 0 0 8px rgba(59,130,246,0.1);} }
        .calm-blue { animation: calmPulse 3s ease-in-out infinite; }
      `}</style>

      <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 06</div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
        Omni-Channel Crisis Broadcast Engine
      </h2>
      <p className="text-sm mt-1 mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
        Subscribe to live hazard telemetry loops for <span style={{ color: hazard.accent }}>{locationLabel}</span>. Dispatch mode is bound to the Predictive Timeline. <span style={{ color: "rgba(255,255,255,0.4)" }}>(Simulated — no real messages are sent.)</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "phone", icon: "📞", ph: "+233 5X XXX XXXX" },
              { key: "email", icon: "📧", ph: "you@example.com" },
              { key: "social", icon: "@", ph: "@social_handle" },
            ].map((f) => (
              <div key={f.key} className="flex items-center gap-2 rounded-xl border px-3 py-2.5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                <span className="text-sm">{f.icon}</span>
                <input
                  data-testid={`broadcast-${f.key}-input`}
                  value={contact[f.key]}
                  onChange={(e) => setContact((s) => ({ ...s, [f.key]: e.target.value }))}
                  placeholder={f.ph}
                  className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/35 min-w-0"
                  style={{ fontFamily: "Manrope" }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHANNELS.map((c) => {
              const on = !!channels[c.id];
              return (
                <label
                  key={c.id}
                  data-testid={`channel-toggle-${c.id}`}
                  className="chip-btn flex items-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer"
                  style={{ borderColor: on ? `${hazard.accent}66` : "rgba(255,255,255,0.08)", background: on ? hazard.accentSoft : "rgba(255,255,255,0.02)" }}
                >
                  <input type="checkbox" className="sr-only" checked={on} onChange={() => setChannels((s) => ({ ...s, [c.id]: !s[c.id] }))} />
                  <span className="flex items-center justify-center w-5 h-5 rounded border text-[10px]" style={{ borderColor: on ? hazard.accent : "rgba(255,255,255,0.3)", background: on ? hazard.accent : "transparent", color: "#0a0a0a" }}>
                    {on ? "✓" : ""}
                  </span>
                  <span className="text-base">{c.icon}</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "Manrope" }}>{c.label}</span>
                </label>
              );
            })}
          </div>

          {error && (
            <div data-testid="broadcast-error" className="text-xs px-3 py-2 rounded-lg" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            data-testid="broadcast-activate-btn"
            onClick={dispatch}
            className="chip-btn w-full rounded-xl py-3 text-sm font-bold tracking-wide"
            style={{ background: hazard.accent, color: "#0a0a0a", fontFamily: "Bricolage Grotesque" }}
          >
            {subscribed ? "🔄 RE-DISPATCH TELEMETRY LOOP" : "📡 ACTIVATE BROADCAST LOOP"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div
            data-testid="broadcast-mode-banner"
            className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${isImmediate ? "flash-red" : "calm-blue"}`}
            style={{ borderColor: `${modeColor}88`, background: `${modeColor}1f` }}
          >
            <span className="text-2xl">{isImmediate ? "🚨" : "🗓️"}</span>
            <div>
              <div className="text-sm font-extrabold tracking-widest" style={{ color: modeColor, fontFamily: "Bricolage Grotesque" }} data-testid="broadcast-mode-label">
                {isImmediate ? "LIVE DISPATCHING / IMMEDIATE BROADCAST" : "PREDICTIVE BRIEFING"}
              </div>
              <div className="text-[10px] tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "JetBrains Mono" }}>
                {isImmediate ? "TIMELINE: NOW / HOURS · RED ALERT DISPATCH" : "TIMELINE: DAYS / MONTHS / YEARS · SCHEDULED TICKER"}
              </div>
            </div>
          </div>

          <div data-testid="broadcast-feed" className="rounded-2xl border p-4 flex-1 min-h-[220px] space-y-2 overflow-y-auto max-h-72" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            {feed.length === 0 ? (
              <div className="text-sm h-full flex items-center justify-center text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                Activate the loop to see live dispatch telemetry for your selected channels.
              </div>
            ) : (
              feed.map((f) => (
                <div key={f.id} className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-relaxed" style={{ background: `${modeColor}12`, border: `1px solid ${modeColor}33` }} data-testid="broadcast-feed-item">
                  <span>{f.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Manrope" }}>
                    <span style={{ color: modeColor, fontFamily: "JetBrains Mono" }}>[{f.time}]</span> {f.text}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* INTERACTIVE SOS DISPATCH HUB */}
      <div data-testid="sos-dispatch-hub" className="mt-6 rounded-2xl border p-5" style={{ borderColor: "rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.04)" }}>
        <div className="text-[10px] tracking-[0.28em]" style={{ color: "#ef4444", fontFamily: "JetBrains Mono" }}>INTERACTIVE SOS DISPATCH HUB · {locationLabel.toUpperCase()}</div>
        <h3 className="text-lg sm:text-xl font-extrabold mt-1" style={{ fontFamily: "Bricolage Grotesque" }}>
          Directly Signal Emergency Authorities &amp; Forces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
          {SOS_UNITS.map((u) => (
            <button
              key={u.id}
              data-testid={`sos-btn-${u.id}`}
              onClick={() => triggerSos(u)}
              className="chip-btn rounded-xl border px-3 py-3 text-left flex flex-col gap-1"
              style={{ borderColor: `${u.color}55`, background: `${u.color}14` }}
            >
              <span className="text-xl">{u.icon}</span>
              <span className="text-xs font-bold leading-snug" style={{ fontFamily: "Bricolage Grotesque", color: u.color }}>{u.label}</span>
              <span className="text-[9px] tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "JetBrains Mono" }}>ONE-CLICK DISPATCH</span>
            </button>
          ))}
        </div>
        {sosLog.length > 0 && (
          <div className="mt-4 space-y-2" data-testid="sos-log">
            {sosLog.map((l) => (
              <div key={l.id} className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-relaxed" style={{ background: `${l.color}12`, border: `1px solid ${l.color}44` }} data-testid="sos-log-item">
                <span className="animate-pulse">{l.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Manrope" }}>
                  <span style={{ color: l.color, fontFamily: "JetBrains Mono" }}>[{l.time}] ✓ TRANSMISSION CONFIRMED</span> — {l.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
