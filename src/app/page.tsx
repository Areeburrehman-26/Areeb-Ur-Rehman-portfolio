import AmbientField from "@/components/AmbientField";
import Hero from "@/components/Hero";
import CapabilityShowcase from "@/components/CapabilityShowcase";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import ProcessStack from "@/components/ProcessStack";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <AmbientField />
      {/* Hard-cut colour bands — void → navy → plum — with no gradient blending. */}
      <main className="relative">
        <Hero />
        <CapabilityShowcase />
        <CaseStudies />
        <About />
        <ProcessStack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
