import { motion } from "framer-motion";
import LogoLoop, { type LogoLoopItem } from "@/components/LogoLoop";
import {
  SiDjango,
  SiFigma,
  SiGit,
  SiMysql,
  SiPhp,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from "react-icons/si";

const techLogos: LogoLoopItem[] = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  { node: <SiPhp />, title: "PHP", href: "https://www.php.net" },
  {
    node: <SiDjango />,
    title: "Django",
    href: "https://www.djangoproject.com",
  },
  { node: <SiMysql />, title: "MySQL", href: "https://www.mysql.com" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiVite />, title: "Vite", href: "https://vite.dev" },
  { node: <SiFigma />, title: "Figma", href: "https://www.figma.com" },
];

export function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="mb-10"
        >
          <p className="text-sm tracking-[0.22em] uppercase text-muted-foreground mb-3">
            Who I Am
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            About Me
          </h2>
          <motion.div
            className="w-20 h-1 bg-primary mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          />
          <p className="max-w-3xl text-muted-foreground text-base md:text-lg leading-relaxed">
            I build thoughtful web experiences that balance clean code, strong
            UX, and fast performance.
          </p>
        </motion.div>

        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 0.2,
            }}
            className="rounded-2xl border border-border/70 bg-card/75 backdrop-blur-sm p-6 md:p-7"
          >
            <h3 className="text-xl font-semibold mb-4">
              Design-first Front-End Development
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
              I am a front-end developer focused on crafting clean, responsive,
              and intuitive interfaces. I care deeply about interaction quality,
              visual hierarchy, and accessible experiences that feel polished on
              every screen size.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              I enjoy translating complex product requirements into seamless UI
              flows using React, TypeScript, and modern CSS systems. My goal is
              to ship front-end experiences that are fast, maintainable, and
              genuinely enjoyable to use.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
          className="mt-2"
        >
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-xl md:text-2xl font-semibold">
              Core Tech Stack
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.16em]">
              Always shipping with
            </p>
          </div>

          <div className="relative h-[132px] md:h-[156px] overflow-hidden px-1">
            <LogoLoop
              logos={techLogos}
              speed={78}
              direction="left"
              logoHeight={54}
              gap={62}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              ariaLabel="Core technology stack"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
