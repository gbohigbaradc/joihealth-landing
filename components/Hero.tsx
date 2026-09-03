import { PulseLine } from "@/components/PulseLine";

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        color: "var(--text-on-navy)",
      }}
    >
      <img
        src="/exterior.jpg"
        alt="Joi Health Polyclinics facility exterior"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(15,37,69,0.94) 0%, rgba(15,37,69,0.82) 40%, rgba(15,37,69,0.55) 75%, rgba(15,37,69,0.35) 100%)",
        }}
      />

      <div className="container" style={{ position: "relative", paddingTop: 40, paddingBottom: 130 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 88,
          }}
        >
          <div
            style={{
              background: "#fff",
              display: "inline-flex",
              padding: "6px 14px",
              borderRadius: 4,
            }}
          >
            <img src="/logo.jpeg" alt="Joi Health" style={{ height: 30, width: "auto" }} />
          </div>

          
            href="https://joihealth-hms-frontend.vercel.app/login"
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "var(--text-on-navy)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 4,
              padding: "8px 16px",
            }}
          >
            Staff Login
          </a>
        </div>

        <h1
          style={{
            fontSize: "clamp(38px, 5.5vw, 68px)",
            fontWeight: "bold",
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            margin: "0 0 28px",
            maxWidth: 720,
          }}
        >
          Physical medicine and cardiac rehabilitation, done with precision.
        </h1>

        <p
          style={{
            fontSize: 19,
            lineHeight: 1.7,
            color: "var(--text-on-navy-muted)",
            maxWidth: 560,
            margin: "0 0 40px",
          }}
        >
          Joi Health Polyclinics treats patients in Lagos and Port Harcourt with the same
          clinical standard, the same clinicians&apos; attention, and a record system built to
          never lose a patient&apos;s history again.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <a href="#contact" className="btn btn-gold">
            Book a consultation
          </a>
          <a href="tel:08129999996" className="btn btn-outline-light">
            Call 0812 999 9996
          </a>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: -2, zIndex: 1 }}>
        <PulseLine color="var(--gold)" height={56} />
      </div>
    </section>
  );
}
