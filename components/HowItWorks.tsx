"use client";

export default function HowItWorks() {
  const steps = [
    { number: "01", label: "Paste", description: "Drop in any T&C URL or raw text" },
    { number: "02", label: "Scan", description: "Claude reads and analyzes every clause" },
    { number: "03", label: "Decide", description: "Get your risk score and red flags instantly" },
  ];

  return (
    <section id="how-it-works" className="px-6 py-24 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Three steps. One clear answer.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="text-6xl font-extrabold text-slate-100 mb-2 leading-none select-none">
                {step.number}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2 -mt-4 relative z-10">
                {step.label}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
