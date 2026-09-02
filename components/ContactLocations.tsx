const LOCATIONS = [
  {
    city: "Port Harcourt",
    address: "12 Rumuparaeli Street, Old GRA, Port Harcourt, Rivers State, Nigeria",
  },
  {
    city: "Lagos",
    address: "2 Taofik Lawal Street, Off Awolowo Road, Ikoyi, Lagos, Nigeria",
  },
];

const PHONES = ["0812 999 9996", "0901 263 1692", "0912 555 5556"];

export function ContactLocations() {
  return (
    <section
      id="contact"
      className="section"
      style={{
        background: "linear-gradient(180deg, var(--navy-deep) 0%, var(--navy) 100%)",
        color: "var(--text-on-navy)",
      }}
    >
      <div className="container">
        <h2 className="eyebrow-free-heading" style={{ color: "#fff" }}>
          Visit or call us
        </h2>
        <p
          style={{
            color: "var(--text-on-navy-muted)",
            fontSize: 18,
            marginBottom: 56,
            maxWidth: 560,
          }}
        >
          Both locations run under the same clinical standard. Reach either one directly.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
          {LOCATIONS.map((loc) => (
            <div key={loc.city} style={{ flex: "1 1 320px" }}>
              <h3 style={{ fontSize: 22, fontWeight: "bold", margin: "0 0 10px" }}>
                {loc.city}
              </h3>
              <p style={{ color: "var(--text-on-navy-muted)", margin: 0, maxWidth: 320 }}>
                {loc.address}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
          }}
        >
          <div>
            <div style={{ fontSize: 14, color: "var(--text-on-navy-muted)", marginBottom: 8 }}>
              Email
            </div>
            <a href="mailto:info@joihealth.ng" style={{ fontSize: 18, fontWeight: "bold" }}>
              info@joihealth.ng
            </a>
          </div>
          <div>
            <div style={{ fontSize: 14, color: "var(--text-on-navy-muted)", marginBottom: 8 }}>
              Phone
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {PHONES.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  style={{ fontSize: 18, fontWeight: "bold" }}
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
