export const MonetizationCore = ({ hazard }) => (
  <section data-testid="monetization-core" className="rounded-3xl border p-5 sm:p-8" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0)), #0a0a0d" }}>
    <div className="text-[10px] tracking-[0.28em]" style={{ color: hazard.accent, fontFamily: "JetBrains Mono" }}>MODULE · 09</div>
    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: "Bricolage Grotesque", letterSpacing: "-0.02em" }}>
      Monetization &amp; Utility Data Ad Cores
    </h2>
    <p className="text-sm mt-1 mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
      Sustainable revenue layers keeping Jampo&apos;s Crisis Shield AI free for every citizen.
    </p>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div data-testid="revenue-sms-layer" className="rounded-2xl border p-5 lg:col-span-1" style={{ borderColor: `${hazard.accent}44`, background: hazard.accentSoft }}>
        <div className="text-2xl">📲</div>
        <h3 className="text-base font-bold mt-2" style={{ fontFamily: "Bricolage Grotesque", color: hazard.accent }}>Premium Telemetry SMS Layer</h3>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Manrope" }}>
          Subscription revenue generated via automated cellular carrier push systems — priority hazard alerts delivered even without internet access.
        </p>
        <span className="inline-block mt-3 text-[10px] tracking-[0.22em] px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontFamily: "JetBrains Mono" }}>REVENUE CORE 01 · ACTIVE</span>
      </div>

      <div data-testid="revenue-isp-matrix" className="rounded-2xl border p-5 lg:col-span-1" style={{ borderColor: `${hazard.accent}44`, background: hazard.accentSoft }}>
        <div className="text-2xl">🌐</div>
        <h3 className="text-base font-bold mt-2" style={{ fontFamily: "Bricolage Grotesque", color: hazard.accent }}>ISP Internet Data Revenue Matrix</h3>
        <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Manrope" }}>
          Monetizing high-volume data navigation as users consume interactive radar map streams, live telemetry loops and predictive briefing feeds.
        </p>
        <span className="inline-block mt-3 text-[10px] tracking-[0.22em] px-2.5 py-1 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontFamily: "JetBrains Mono" }}>REVENUE CORE 02 · ACTIVE</span>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-1">
        {[1, 2].map((n) => (
          <div key={n} data-testid={`ad-slot-${n}`} className="flex-1 rounded-2xl border border-dashed flex flex-col items-center justify-center py-6 px-4 text-center" style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.02)" }}>
            <span className="text-lg">🪧</span>
            <span className="text-[10px] tracking-[0.28em] mt-1" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "JetBrains Mono" }}>AD SLOT · DISPLAY UNIT {n}</span>
            <span className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}>PARTNER PLACEMENT · 300×{n === 1 ? "250" : "100"}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
