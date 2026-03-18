import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import "./CardNav.css";

type CardNavLink = {
  label: string;
  ariaLabel?: string;
  href?: string;
};

type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links?: CardNavLink[];
};

type CardNavProps = {
  logo?: string;
  logoAlt?: string;
  logoText?: string;
  items: CardNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onNavigate?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
};

const MOBILE_QUERY = "(max-width: 768px)";

export default function CardNav({
  logo,
  logoAlt = "Logo",
  logoText,
  items,
  activeHref,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ctaLabel = "Get Started",
  ctaHref = "#contact",
  onNavigate,
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navElement = navRef.current;
    if (!navElement) return 260;

    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    if (!isMobile) return 260;

    const contentElement =
      navElement.querySelector<HTMLElement>(".card-nav-content");
    if (!contentElement) return 260;

    const prevVisibility = contentElement.style.visibility;
    const prevPointer = contentElement.style.pointerEvents;
    const prevPosition = contentElement.style.position;
    const prevHeight = contentElement.style.height;

    contentElement.style.visibility = "visible";
    contentElement.style.pointerEvents = "auto";
    contentElement.style.position = "static";
    contentElement.style.height = "auto";

    const topBarHeight = 60;
    const padding = 16;
    const contentHeight = contentElement.scrollHeight;

    contentElement.style.visibility = prevVisibility;
    contentElement.style.pointerEvents = prevPointer;
    contentElement.style.position = prevPosition;
    contentElement.style.height = prevHeight;

    return topBarHeight + contentHeight + padding;
  };

  const createTimeline = () => {
    const navElement = navRef.current;
    if (!navElement) return null;

    gsap.set(navElement, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current.filter(Boolean), { y: 50, opacity: 0 });

    const timeline = gsap.timeline({ paused: true });

    timeline.to(navElement, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    timeline.to(
      cardsRef.current.filter(Boolean),
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease,
        stagger: 0.08,
      },
      "-=0.1",
    );

    return timeline;
  };

  useLayoutEffect(() => {
    timelineRef.current?.kill();
    timelineRef.current = createTimeline();

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      if (isExpanded) {
        gsap.set(navRef.current, { height: calculateHeight() });
      }

      timeline.kill();
      const refreshed = createTimeline();
      if (!refreshed) return;

      if (isExpanded) {
        refreshed.progress(1);
      }

      timelineRef.current = refreshed;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      timeline.play(0);
      return;
    }

    setIsHamburgerOpen(false);
    timeline.eventCallback("onReverseComplete", () => setIsExpanded(false));
    timeline.reverse();
  };

  const onHamburgerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleMenu();
  };

  const setCardRef = (index: number) => (element: HTMLDivElement | null) => {
    cardsRef.current[index] = element;
  };

  const handleLinkClick = (
    href: string | undefined,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!href) return;

    if (href.startsWith("#")) {
      event.preventDefault();
      onNavigate?.(href, event);
      setIsExpanded(false);
      setIsHamburgerOpen(false);
      timelineRef.current?.reverse();
    }
  };

  const rootStyle: CSSProperties = {
    backgroundColor: baseColor,
  };

  return (
    <div
      className={["card-nav-container", className].filter(Boolean).join(" ")}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={rootStyle}
      >
        <div className="card-nav-top">
          <button
            type="button"
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            onKeyDown={onHamburgerKeyDown}
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            style={{ color: menuColor }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <div className="logo-container">
            {logoText ? (
              <span className="logo-wordmark" aria-label={logoAlt} role="img">
                {logoText}
              </span>
            ) : logo ? (
              <img src={logo} alt={logoAlt} className="logo" />
            ) : (
              <span className="logo-fallback">A</span>
            )}
          </div>

          <a
            href={ctaHref}
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={(event) => handleLinkClick(ctaHref, event)}
          >
            {ctaLabel}
          </a>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {(items || []).slice(0, 3).map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="nav-card"
              ref={setCardRef(index)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>

              <div className="nav-card-links">
                {(item.links || []).map((link, linkIndex) => (
                  <a
                    key={`${link.label}-${linkIndex}`}
                    className={`nav-card-link${activeHref === link.href ? " is-active" : ""}`}
                    href={link.href || "#"}
                    aria-label={link.ariaLabel || link.label}
                    onClick={(event) => handleLinkClick(link.href, event)}
                  >
                    <GoArrowUpRight
                      className="nav-card-link-icon"
                      aria-hidden="true"
                    />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
