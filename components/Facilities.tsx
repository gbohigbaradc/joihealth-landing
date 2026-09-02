const PHOTOS = [
  {
    src: "/pool.jpg",
    alt: "Hydrotherapy pool at Joi Health",
    caption: "Hydrotherapy pool",
  },
  {
    src: "/cardiac-room.jpg",
    alt: "Cardiac assessment room with treadmill stress test and ultrasound equipment",
    caption: "Cardiac assessment suite",
  },
  {
    src: "/treatment-room.jpg",
    alt: "Physiotherapy treatment room",
    caption: "Treatment rooms",
  },
];

export function Facilities() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 4,
          }}
        >
          {PHOTOS.map((photo) => (
            <figure key={photo.src} style={{ margin: 0, position: "relative" }}>
              <img
                src={photo.src}
                alt={photo.alt}
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                }}
              />
              <figcaption
                style={{
                  position: "absolute",
                  left: 16,
                  bottom: 14,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: "bold",
                  textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                }}
              >
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
