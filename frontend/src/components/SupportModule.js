const SOCIALS = [
  { label: "LinkedIn Professional", text: "linkedin.com/in/jampo-kwadwo-sampson-402693344", href: "https://www.linkedin.com/in/jampo-kwadwo-sampson-402693344" },
  { label: "Facebook Personal", text: "facebook.com/sampsonkojo.jampojnr", href: "https://www.facebook.com/sampsonkojo.jampojnr" },
  { label: "Facebook Creator Page", text: "facebook.com/CrisisShieldAI-Page", href: "https://www.facebook.com/profile.php?id=61584430046337" },
  { label: "Instagram", text: "@jamloy17", href: "https://www.instagram.com/jamloy17?igsh=MWt0MDVhaWVlcmJtdg==" },
  { label: "TikTok Personal", text: "@jampo_junior", href: "https://www.tiktok.com/@jampo_junior" },
  { label: "TikTok Platform Video", text: "Crisis Shield AI Video Showcase", href: "https://vm.tiktok.com/ZS96Gojy5QuHU-1Xulh/" },
  { label: "Snapchat Primary (Promo)", text: "loyal_ty17", href: "https://www.snapchat.com/add/loyal_ty17" },
  { label: "Snapchat Secondary", text: "jampojunior", href: "https://www.snapchat.com/add/jampojunior" },
];

export const SupportModule = () => (
  <section data-testid="support-module" className="bg-slate-900 border border-slate-800 rounded-xl p-6 my-6 max-w-xl mx-auto shadow-lg text-center">
    <h3 className="text-xl font-bold text-emerald-400 mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>🎁 Support This Innovation</h3>
    <p className="text-slate-300 text-sm mb-4" style={{ fontFamily: "Manrope" }}>
      Jampo&apos;s Crisis Shield AI is independently built to keep communities safe. Your voluntary contributions help cover server costs, API telemetry data tracking, and continuous system upgrades.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <div data-testid="momo-card" className="p-3 rounded-lg border border-slate-700 text-left" style={{ background: "#141c2b" }}>
        <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">🇬🇭 Ghana Mobile Money</span>
        <p className="text-sm font-bold text-white mt-1">MTN MoMo: +233 598 857 686</p>
        <span className="text-xs text-slate-500">Name: Sampson Kwadwo Jampo</span>
      </div>

      <a
        data-testid="paystack-link"
        href="https://paystack.shop/pay/jamposcrisisshield"
        target="_blank"
        rel="noreferrer"
        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold p-3 rounded-lg flex items-center justify-center transition-colors"
        style={{ fontFamily: "Bricolage Grotesque" }}
      >
        💳 Pay with Paystack (Local &amp; Global)
      </a>
    </div>

    <div className="border-t border-slate-800 pt-4 text-left" data-testid="social-matrix">
      <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2 text-center">🌐 Connect with the Creator (Admin Channels)</span>
      <div className="grid grid-cols-1 gap-2 text-xs text-slate-300" style={{ fontFamily: "Manrope" }}>
        {SOCIALS.map((s) => (
          <div key={s.label}>
            <strong>{s.label}:</strong>{" "}
            <a href={s.href} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline break-all" data-testid={`social-link-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              {s.text}
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);
