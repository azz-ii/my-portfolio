import { useEffect, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import CardNav from "@/components/CardNav";
import logo from "@/assets/azi-logo.png";

const navItems = [
  {
    label: "About",
    bgColor: "#111111",
    textColor: "#fff",
    links: [
      { label: "Home", ariaLabel: "Go to Home", href: "#home" },
      { label: "About", ariaLabel: "Go to About", href: "#about" },
    ],
  },
  {
    label: "Projects",
    bgColor: "#1a1a1a",
    textColor: "#fff",
    links: [
      { label: "Projects", ariaLabel: "Go to Projects", href: "#projects" },
      {
        label: "Experience",
        ariaLabel: "Go to Experience",
        href: "#experience",
      },
    ],
  },
  {
    label: "Contact",
    bgColor: "#242424",
    textColor: "#fff",
    links: [
      { label: "Contact", ariaLabel: "Go to Contact", href: "#contact" },
      {
        label: "GitHub",
        ariaLabel: "Visit GitHub",
        href: "https://github.com/azz-ii",
      },
      {
        label: "LinkedIn",
        ariaLabel: "Visit LinkedIn",
        href: "https://www.linkedin.com",
      },
    ],
  },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "experience", "contact"];
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = section;
          }
        }
      }

      setActiveSection(`#${current}`);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigate = (
    href: string,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    setActiveSection(href);
    scrollToSection(href);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-3 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CardNav
          logo={logo}
          logoAlt="Azrielle Logo"
          items={navItems}
          activeHref={activeSection}
          baseColor="#0a0a0a"
          menuColor="#f4f4f5"
          buttonBgColor="#f4f4f5"
          buttonTextColor="#0a0a0a"
          ease="elastic.out(1, 0.8)"
          ctaHref="#contact"
          onNavigate={handleNavigate}
        />
      </div>
    </motion.nav>
  );
}
