import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Testimonials } from "@/components/sections/Testimonials";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { WhatsappButton } from "@/components/ui/WhatsappButton";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <CursorGlow />
      <Navbar />
      <Hero />

      <div className="relative z-10 flex flex-col">
        <Projects />
        <About />
        <Testimonials />
        <Contact />
      </div>

      <Footer />
      <WhatsappButton />
    </main>
  );
}
