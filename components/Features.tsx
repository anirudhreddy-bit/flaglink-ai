"use client";

export default function Features() {
  const features = [
    {
      label: "Instant",
      title: "Reads it for you.",
      description:
        "Paste a URL or raw text. Claude scans the full document in under 2 seconds.",
      accent: "text-indigo-600",
      border: "hover:border-indigo-300",
    },
    {
      label: "Plain English",
      title: "Flags what matters.",
      description:
        "Auto-renewal traps, data selling, forced arbitration — explained like a friend.",
      accent: "text-amber-600",
      border: "hover:border-amber-300",
    },
    {
      label: "Actionable",
      title: "Tells you what to do.",
      description:
        "Get a 0–100 risk score and exact next steps — not just warnings.",
      accent: "text-emerald-600",
      border: "hover:border-emerald-300",
    },
  ];

  return (
    <section id="features" className="px-6 py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Your unseen <em>legal</em> guardian.
          </h2>
          <p className="text-slate-500">
            Understand T&amp;Cs before you commit.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-xl bg-white border border-slate-200 p-7 transition-all ${feature.border} hover:shadow-sm`}
            >
              <div className={`text-xs font-semibold uppercase tracking-wider ${feature.accent} mb-3`}>
                {feature.label}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
