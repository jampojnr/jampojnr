import { useState } from "react";

const buildSnippets = (hazard, loc, riskLabel) => {
  const url = window.location.origin;
  return {
    tiktok: `🚨 LIVE THREAT OVERLAY 🚨\n${hazard.emoji} ${hazard.label} — ${loc}\n📊 Risk Level: ${riskLabel}\n\n⚡ Powered by Jampo's Crisis Shield AI — engineered by Sampson Kwadwo Jampo (aka LOYALTY) from Obuasi, Ghana 🇬🇭\nStay protected, global or local!\n👉 ${url}\n#CrisisShieldAI #DisasterAlert #StaySafe`,
    facebook: `🚨 System Threat Matrix Update: ${hazard.emoji} ${hazard.label} active for ${loc} — current risk tier ${riskLabel}.\n\nPowered by Jampo's Crisis Shield AI, engineered by Sampson Kwadwo Jampo (aka LOYALTY) from Obuasi, Ghana 🇬🇭. Stay protected global or local!\n\nCheck out the live dashboard here: ${url}`,
    whatsapp: `🛡️ *Jampo's Crisis Shield AI* — Live Alert\n${hazard.emoji} ${hazard.label} · ${loc} · Risk: *${riskLabel}*\n\nI'm tracking real-time disaster intelligence with Jampo's Crisis Shield AI, built by Sampson Kwadwo Jampo (aka LOYALTY) from Obuasi 🇬🇭.\nJoin me & stay protected 👉 ${url}`,
  };
};

const BUTTONS = [
  { id: "tiktok", icon: "🎬", label: "Generate TikTok/Shorts Warning Overlay" },
  { id: "facebook", icon: "📘", label: "Share Live System Status to Facebook" },
  { id: "whatsapp", icon: "💚", label: "Broadcast App Invite Link to WhatsApp Status" },
];

export const ShareCenter = ({ hazard, locationLabel, riskLabel }) => {
  const [copied, setCopied] = useState("");
  const [preview, setPreview] = useState(null);

  const copy = async (id) => {
    const snippet = buildSnippets(hazard, locationLabel, riskLabel)[id];
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setPreview({ id, snippet });
    setCopied(id);
    setTimeout(() => setCopied(""), 2500);
  };

  return (
    <section data-testid="share-center" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: `${hazard.accent}33`, background: "linear-gradient(140deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
      <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 08</div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
        Campaign &amp; Share Promotion Center
      </h2>
      <p className="text-sm mt-1 mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
        Auto-generate viral-ready snippets for the active <span style={{ color: hazard.accent }}>{hazard.label}</span> status in <span style={{ color: hazard.accent }}>{locationLabel}</span> — copied straight to your clipboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {BUTTONS.map((b) => (
          <button
            key={b.id}
            data-testid={`share-btn-${b.id}`}
            onClick={() => copy(b.id)}
            className="chip-btn rounded-2xl border p-5 text-left flex flex-col gap-2"
            style={{
              borderColor: copied === b.id ? "#22c55e" : `${hazard.accent}44`,
              background: copied === b.id ? "rgba(34,197,94,0.08)" : hazard.accentSoft,
            }}
          >
            <span className="text-3xl">{b.icon}</span>
            <span className="text-sm font-bold" style={{ fontFamily: "Bricolage Grotesque" }}>{b.label}</span>
            <span className="text-[10px] tracking-[0.22em]" style={{ color: copied === b.id ? "#22c55e" : hazard.accent, fontFamily: "JetBrains Mono" }}>
              {copied === b.id ? "✓ COPIED TO CLIPBOARD" : "TAP TO GENERATE & COPY"}
            </span>
          </button>
        ))}
      </div>

      {preview && (
        <div data-testid="share-preview" className="mt-4 rounded-2xl border p-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.35)" }}>
          <div className="text-[10px] tracking-[0.28em] mb-2" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>GENERATED SNIPPET PREVIEW</div>
          <pre className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Manrope" }}>{preview.snippet}</pre>
        </div>
      )}
    </section>
  );
};
