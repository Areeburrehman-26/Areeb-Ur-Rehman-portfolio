import AmbientField from "@/components/AmbientField";
import Hero from "@/components/Hero";
import CapabilityShowcase from "@/components/CapabilityShowcase";
import CaseStudies from "@/components/CaseStudies";
import About from "@/components/About";
import ProcessStack from "@/components/ProcessStack";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/content";

// schema.org Person, per Next's documented JSON-LD pattern: a native
// <script> tag rendered in the page rather than next/script (JSON-LD is
// data, not executable code). `<` is escaped to block injection through any
// of these string fields.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [
    site.socials.find((s) => s.label === "linkedin")?.href,
    site.socials.find((s) => s.label === "github")?.href,
    site.upworkUrl,
    site.fiverrUrl,
  ].filter(Boolean),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
