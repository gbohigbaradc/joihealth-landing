const STATS = [
  { value: "400+", label: "Patients treated" },
  { value: "2", label: "Locations — Lagos & Port Harcourt" },
  { value: "50+", label: "Clinical & support staff" },
];

export function AboutTrust() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="eyebrow-free-heading" style={{ color: "var(--navy)" }}>
          A clinical team that knows physical medicine and cardiac care together
        </h2>
        <p className="body-lede" style={{ marginBottom: 56 }}>
          Joi Health focuses on two things that are usually treated separately:
          rehabilitation after injury or surgery, and long-term cardiac risk and recovery. Our
          clinicians work across both, so a patient&apos;s full picture stays in one place.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0,
            borderTop: "1px solid var(--border)",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: "1 1 220px",
                padding: "28px 28px 28px 0",
                borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                paddingLeft: i > 0 ? 28 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: "bold",
                  color: "var(--mid-blue)",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 15 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
