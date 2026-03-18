import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CardSwap, { Card } from "@/components/CardSwap";

interface Project {
  title: string;
  description: string;
  tech: string[];
  demo?: string;
  github?: string;
}

const projects: Project[] = [
  {
    title: "KST E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with cart, payments, and admin dashboard.",
    tech: ["React", "Typescript", "Tailwind CSS"],
    demo: "https://example.com",
    github: "https://github.com/markusbautista/e-commerce",
  },
  {
    title: "InstaBite Food Ordering App",
    description:
      "Online food ordering platform with menu browsing, cart management, and order tracking.",
    tech: ["React", "Typescript", "Tailwind CSS"],
    demo: "https://example.com",
    github: "https://github.com/azz-ii/instabite-food-ordering-app",
  },
  {
    title: "Pharmacy Management System",
    description:
      "Comprehensive pharmacy solution for inventory management, prescriptions, and sales tracking.",
    tech: ["React", "Typescript", "Tailwind CSS"],
    demo: "https://example.com",
    github: "https://github.com/azz-ii/pharmacy-management-system",
  },
  {
    title: "Gym Management System",
    description:
      "Complete gym management platform with membership tracking, scheduling, and payment processing.",
    tech: ["React", "Typescript", "Tailwind CSS"],
    demo: "https://example.com",
    github: "https://github.com/LexPaul14/Gym-Management-System",
  },
];

const isPlaceholderDemo = (url?: string) =>
  Boolean(url && /example\.com/i.test(url));

export function Projects() {
  return (
    <section id="projects" className="py-20 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="max-w-xl"
          >
            <h2 className="text-4xl font-bold mb-4">Projects</h2>
            <motion.div
              className="w-20 h-1 bg-primary mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            />
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
              I focus on front-end projects that prioritize clear visual
              hierarchy, smooth interactions, and responsive performance across
              devices.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Each build combines practical UI decisions with maintainable React
              architecture, from product workflows to dashboard-like systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
            className="relative h-[520px] md:h-[560px]"
          >
            <CardSwap
              width={540}
              height={350}
              cardDistance={55}
              verticalDistance={58}
              delay={5000}
              pauseOnHover
              easing="elastic"
            >
              {projects.map((project) => {
                const hasDemo =
                  Boolean(project.demo) && !isPlaceholderDemo(project.demo);

                return (
                  <Card
                    key={project.title}
                    className="border-border/70 bg-card/96"
                  >
                    <article className="card-swap-project">
                      <div>
                        <h3 className="card-swap-project__title">
                          {project.title}
                        </h3>
                        <p className="card-swap-project__description mt-2">
                          {project.description}
                        </p>
                      </div>

                      <div className="card-swap-project__meta">
                        <div className="card-swap-project__badges">
                          {project.tech.map((tech) => (
                            <Badge
                              key={`${project.title}-${tech}`}
                              variant="outline"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        <div className="card-swap-project__actions">
                          {hasDemo && (
                            <Button size="sm" asChild>
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Demo
                              </a>
                            </Button>
                          )}

                          {project.github && (
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="mr-2 h-4 w-4" />
                                Code
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  </Card>
                );
              })}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
