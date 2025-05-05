import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";
import AtsDemo from "@/components/sections/ats-demo";
import Pricing from "@/components/sections/pricing";
import Testimonials from "@/components/sections/testimonials";
import CTA from "@/components/sections/cta";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <AtsDemo />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
