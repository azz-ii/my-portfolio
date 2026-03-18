import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextType from "@/components/TextType";
import ProfileCard from "@/components/ProfileCard";
import GlitchText from "@/components/GlitchText";
import profileAzi from "@/assets/profile-azi.png";

export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
    >
      <motion.div
        className="relative max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative grid items-center gap-10 p-6 text-center sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:text-left">
            <div>
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
              >
                Available for Freelance
              </motion.span>

              <motion.h1
                variants={itemVariants}
                className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Hi, I'm{" "}
                <motion.span
                  className="text-primary inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <GlitchText speed={1} enableShadows enableOnHover={false}>
                    Azrielle
                  </GlitchText>
                </motion.span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mt-4 text-base text-muted-foreground sm:text-lg lg:text-xl"
              >
                <TextType
                  as="span"
                  className="text-base sm:text-lg lg:text-xl"
                  texts={[
                    "Front-End Developer",
                    "UI/UX Enthusiast",
                    "Building modern web experiences",
                  ]}
                  typingSpeed={75}
                  pauseDuration={1500}
                  deletingSpeed={50}
                  showCursor
                  cursorCharacter="|"
                  variableSpeedEnabled={false}
                  cursorBlinkDuration={0.5}
                />
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground/90 sm:text-base lg:mx-0 mx-auto"
              >
                I design and build modern, high-performing interfaces with a
                focus on clean visuals, smooth interactions, and user-first
                experiences.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-7 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("projects")}
                  className="group min-w-[170px]"
                >
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("contact")}
                  className="min-w-[170px] border-white/25 bg-transparent hover:bg-white/10"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Button>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="pointer-events-auto justify-self-center lg:justify-self-end"
            >
              <ProfileCard
                handle="javicodes"
                status="Online"
                contactText="Contact Me"
                avatarUrl={profileAzi}
                showUserInfo={false}
                enableTilt
                enableMobileTilt
                onContactClick={() => {
                  console.log("Contact clicked");
                }}
                behindGlowColor="rgba(32, 32, 32, 0.55)"
                iconUrl="/assets/demo/iconpattern.png"
                behindGlowEnabled
                innerGradient="linear-gradient(145deg, #000000 0%, #090909 25%, #131313 50%, #1A1A1A 75%, #202020 100%)"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
