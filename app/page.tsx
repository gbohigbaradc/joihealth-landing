import { Hero } from "@/components/Hero";
import { Facilities } from "@/components/Facilities";
import { AboutTrust } from "@/components/AboutTrust";
import { Services } from "@/components/Services";
import { PlatformPreview } from "@/components/PlatformPreview";
import { ContactLocations } from "@/components/ContactLocations";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Facilities />
      <AboutTrust />
      <Services />
      <PlatformPreview />
      <ContactLocations />
      <Footer />
    </>
  );
}
