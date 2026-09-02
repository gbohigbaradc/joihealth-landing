/**
 * The pulse/ECG line already exists in Joi Health's logo mark. Rather than
 * inventing a separate decorative motif for the page, this component reuses
 * that same visual idea as a structural device — a horizontal trace, a
 * vertical trace connecting the services list, etc. One shape, several
 * orientations, used deliberately rather than as a directionless flourish.
 */
export function PulseLine({
  orientation = "horizontal",
  color = "var(--gold)",
  width = "100%",
  height = 48,
}: {
  orientation?: "horizontal" | "vertical";
  color?: string;
  width?: string | number;
  height?: string | number;
}) {
  if (orientation === "vertical") {
    return (
      <svg
        viewBox="0 0 48 400"
        width={height}
        height={width}
        preserveAspectRatio="none"
        style={{ display: "block" }}
        aria-hidden="true"
      >
        <path
          d="M24 0 L24 140 L14 140 L24 170 L34 100 L44 220 L24 220 L24 400"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1200 60"
      width={width}
      height={height}
      preserveAspectRatio="none"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M0 30 L420 30 L450 30 L465 5 L480 55 L495 30 L520 30 L1200 30"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
