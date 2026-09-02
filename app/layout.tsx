import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joi Health Polyclinics",
  description:
    "Physical medicine and cardiac rehabilitation in Lagos and Port Harcourt, Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
