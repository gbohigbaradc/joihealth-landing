export function Footer() {
  return (
    <footer style={{ background: "var(--navy-deep)", color: "var(--text-on-navy-muted)" }}>
      <div
        className="container"
        style={{
          padding: "32px 28px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          fontSize: 14,
        }}
      >
        <div>&copy; {new Date().getFullYear()} Joi Health Polyclinics. All rights reserved.</div>
        <div>
          Temporarily hosted on cardioai.dev while joihealth.ng is restored.
        </div>
      </div>
    </footer>
  );
}
