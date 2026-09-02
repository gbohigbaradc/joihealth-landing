export function PlatformPreview() {
  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 380px" }}>
            <h2 className="eyebrow-free-heading" style={{ color: "var(--navy)" }}>
              A record system built to remember
            </h2>
            <p className="body-lede">
              We rebuilt our clinical records from the ground up after a system failure taught
              us what not to trust. Every treatment plan and clinician note is now backed up
              automatically, every night, without anyone having to remember to do it.
            </p>
            <p className="body-lede" style={{ marginTop: 16 }}>
              Our clinicians also work with an AI assistant that can pull a patient&apos;s full
              history in seconds — it never edits a record on its own; a clinician always
              reviews and confirms first.
            </p>
          </div>

          <div style={{ flex: "1 1 320px" }}>
            <div
              style={{
                background: "var(--navy)",
                borderRadius: 6,
                padding: 32,
                color: "var(--text-on-navy)",
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--mid-blue)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.3)",
                    display: "inline-block",
                  }}
                />
              </div>
              <div style={{ fontSize: 14, color: "var(--text-on-navy-muted)", marginBottom: 8 }}>
                Nightly backup
              </div>
              <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>
                Complete — 2:00 AM
              </div>
              <div style={{ fontSize: 14, color: "var(--text-on-navy-muted)", marginBottom: 8 }}>
                Records secured
              </div>
              <div style={{ fontSize: 22, fontWeight: "bold" }}>Zero data loss since rebuild</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
