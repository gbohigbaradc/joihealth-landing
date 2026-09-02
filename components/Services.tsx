/**
 * DRAFT — based on the clinic's stated positioning (physical medicine +
 * cardiac rehabilitation), not the real Departments and Services Directory
 * referenced in the original blueprint. Replace names/descriptions with the
 * actual service lines before this goes live. Photos are real.
 */
const SERVICES = [
  {
    name: "Cardiac Assessment & Rehabilitation",
    description:
      "Treadmill stress testing, cardiac ultrasound, and structured recovery programs for patients managing or recovering from a cardiac condition.",
    image: "/cardiac-room.jpg",
  },
  {
    name: "Physical Therapy",
    description:
      "Hands-on rehabilitation for injury, post-surgical recovery, and chronic musculoskeletal conditions.",
    image: "/physio-room.jpg",
  },
  {
    name: "Fitness & Movement Rehabilitation",
    description:
      "Guided strength and mobility work as part of a structured recovery or long-term wellness plan.",
    image: "/gym-room.jpg",
  },
  {
    name: "Pain Management",
    description:
      "Ongoing care plans for chronic pain, coordinated with a patient's broader treatment history.",
    image: "/treatment-room.jpg",
  },
];

export function Services() {
  return (
    <section className="section" style={{ background: "var(--surface)" }}>
      <div className="container">
        <h2 className="eyebrow-free-heading" style={{ color: "var(--navy)" }}>
          What we treat
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 48,
          }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.name}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 28,
                padding: "36px 0",
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
                alignItems: "center",
              }}
            >
              <img
                src={service.image}
                alt={service.name}
                style={{
                  flex: "0 0 220px",
                  width: 220,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <div style={{ flex: "1 1 320px" }}>
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "var(--navy)",
                    margin: "0 0 8px",
                  }}
                >
                  {service.name}
                </h3>
                <p style={{ color: "var(--text-muted)", margin: 0, maxWidth: 480 }}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
