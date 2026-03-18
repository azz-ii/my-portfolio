import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Contact } from "@/sections/Contact";
import { GlobalBeamsBackground } from "@/components/GlobalBeamsBackground";

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlobalBeamsBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">
          <Hero />
          <About />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
