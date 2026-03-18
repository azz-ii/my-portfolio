import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import PixelTransition from "@/components/PixelTransition";

interface TimelineItem {
  type: "work" | "education";
  title: string;
  organization: string;
  period: string;
  description: string;
}

const yearsFromPeriod = (period: string) => {
  const [startRaw, endRaw] = period.split("-").map((part) => part.trim());
  const start = Number.parseInt(startRaw, 10);
  const end = /present/i.test(endRaw)
    ? new Date().getFullYear()
    : Number.parseInt(endRaw, 10);

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return "0 Years";
  }

  const years = Math.max(1, end - start);
  return `${years} ${years === 1 ? "Year" : "Years"}`;
};

const timeline: TimelineItem[] = [
  {
    type: "work",
    title: "Senior Frontend Developer",
    organization: "Tech Company Inc.",
    period: "2023 - Present",
    description:
      "Leading frontend development of enterprise applications using React and TypeScript.",
  },
  {
    type: "work",
    title: "Full Stack Developer",
    organization: "Startup XYZ",
    period: "2021 - 2023",
    description:
      "Built and maintained full-stack features for SaaS platform with 10k+ users.",
  },
  {
    type: "education",
    title: "Bachelor of Computer Science",
    organization: "Bulacan State University",
    period: "2021 - 2025",
    description: "Graduated with honors. Focus on Web Technologies.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience & Education
          </h2>
          <motion.div
            className="w-20 h-1 bg-primary mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        <div className="space-y-6">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: index * 0.1,
              }}
            >
              <PixelTransition
                firstContent={
                  <article className="experience-pixel-front">
                    <div className="experience-pixel-front__header">
                      <div
                        className="experience-pixel-front__icon"
                        aria-hidden="true"
                      >
                        {item.type === "work" ? (
                          <Briefcase className="h-5 w-5 text-white" />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-white" />
                        )}
                      </div>

                      <div className="experience-pixel-front__meta">
                        <div className="experience-pixel-front__title-row">
                          <h3 className="experience-pixel-front__title">
                            {item.title}
                          </h3>
                        </div>
                        <p className="experience-pixel-front__org">
                          {item.organization}
                        </p>
                      </div>
                    </div>

                    <p className="experience-pixel-front__desc">
                      {item.description}
                    </p>
                  </article>
                }
                secondContent={
                  <div className="experience-pixel-back">
                    <div>
                      <p className="experience-pixel-back__years">
                        {yearsFromPeriod(item.period)}
                      </p>
                      <p className="experience-pixel-back__period">
                        {item.period}
                      </p>
                      <p className="experience-pixel-back__label">Experience</p>
                    </div>
                  </div>
                }
                gridSize={9}
                pixelColor="#ffffff"
                once={false}
                animationStepDuration={0.4}
                className="custom-pixel-card"
                aspectRatio="24%"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
