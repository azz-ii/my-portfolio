import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import "./LogoLoop.css";

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

type LogoNodeItem = {
  node: ReactNode;
  title: string;
  href?: string;
  ariaLabel?: string;
};

type LogoImageItem = {
  src: string;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

export type LogoLoopItem = LogoNodeItem | LogoImageItem;
export type LogoLoopDirection = "left" | "right" | "up" | "down";

export type LogoLoopProps = {
  logos: LogoLoopItem[];
  speed?: number;
  direction?: LogoLoopDirection;
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoLoopItem, key: string) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

const isNodeItem = (item: LogoLoopItem): item is LogoNodeItem => "node" in item;

const toCssLength = (value?: number | string) => {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") return value;
  return undefined;
};

const clampPositive = (value: number, fallback: number) => {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setReduced(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reduced;
};

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 30,
  gap = 36,
  pauseOnHover,
  hoverSpeed,
  fadeOut = true,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Technology logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sequenceRef = useRef<HTMLUListElement | null>(null);

  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [sequenceHeight, setSequenceHeight] = useState(0);
  const [copyCount, setCopyCount] = useState<number>(
    ANIMATION_CONFIG.MIN_COPIES,
  );
  const [isHovered, setIsHovered] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const safeGap = clampPositive(gap, 36);
  const safeLogoHeight = clampPositive(logoHeight, 30);

  const hasLogos = logos.length > 0;
  const isVertical = direction === "up" || direction === "down";

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined && Number.isFinite(hoverSpeed))
      return hoverSpeed;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const targetVelocity = useMemo(() => {
    const magnitude = Number.isFinite(speed) ? Math.abs(speed) : 120;
    const dir = isVertical
      ? direction === "up"
        ? 1
        : -1
      : direction === "left"
        ? 1
        : -1;
    const speedSign = Number.isFinite(speed) && speed < 0 ? -1 : 1;
    return magnitude * dir * speedSign;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;
    if (!container || !sequence || !hasLogos) {
      setCopyCount(ANIMATION_CONFIG.MIN_COPIES);
      return;
    }

    const sequenceRect = sequence.getBoundingClientRect();
    const currentSequenceWidth = Math.ceil(sequenceRect.width);
    const currentSequenceHeight = Math.ceil(sequenceRect.height);

    if (isVertical) {
      const parentHeight =
        container.parentElement?.clientHeight ?? container.clientHeight;
      const viewportHeight = Math.max(parentHeight, container.clientHeight, 0);
      if (currentSequenceHeight > 0 && viewportHeight > 0) {
        setSequenceHeight(currentSequenceHeight);
        const copies =
          Math.ceil(viewportHeight / currentSequenceHeight) +
          ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copies));
      }
      return;
    }

    const viewportWidth = container.clientWidth;
    if (currentSequenceWidth > 0 && viewportWidth > 0) {
      setSequenceWidth(currentSequenceWidth);
      const copies =
        Math.ceil(viewportWidth / currentSequenceWidth) +
        ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copies));
    }
  }, [hasLogos, isVertical]);

  useEffect(() => {
    if (!hasLogos) return;

    updateDimensions();
    if (typeof window === "undefined") return;

    const elements = [containerRef.current, sequenceRef.current].filter(
      Boolean,
    ) as Element[];

    if (!window.ResizeObserver) {
      const onResize = () => updateDimensions();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const observer = new ResizeObserver(() => updateDimensions());
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [hasLogos, logos, safeGap, safeLogoHeight, isVertical, updateDimensions]);

  useEffect(() => {
    if (!hasLogos) return;
    const sequence = sequenceRef.current;
    if (!sequence) return;

    const images = Array.from(sequence.querySelectorAll("img"));
    if (images.length === 0) {
      updateDimensions();
      return;
    }

    let pending = images.length;
    const onLoadOrError = () => {
      pending -= 1;
      if (pending <= 0) updateDimensions();
    };

    images.forEach((img) => {
      if (img.complete) {
        onLoadOrError();
      } else {
        img.addEventListener("load", onLoadOrError, { once: true });
        img.addEventListener("error", onLoadOrError, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", onLoadOrError);
        img.removeEventListener("error", onLoadOrError);
      });
    };
  }, [hasLogos, logos, updateDimensions]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasLogos || prefersReducedMotion) return;

    const loopSize = isVertical ? sequenceHeight : sequenceWidth;
    if (loopSize <= 0) return;

    let rafId = 0;
    let lastTimestamp: number | null = null;
    let offset = 0;
    let velocity = 0;

    const writeTransform = (value: number) => {
      const transform = isVertical
        ? `translate3d(0, ${-value}px, 0)`
        : `translate3d(${-value}px, 0, 0)`;
      track.style.transform = transform;
    };

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = Math.max(0, timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const target =
        isHovered && effectiveHoverSpeed !== undefined
          ? effectiveHoverSpeed
          : targetVelocity;
      const easing = 1 - Math.exp(-deltaSeconds / ANIMATION_CONFIG.SMOOTH_TAU);
      velocity += (target - velocity) * easing;

      offset += velocity * deltaSeconds;
      offset = ((offset % loopSize) + loopSize) % loopSize;
      writeTransform(offset);

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [
    hasLogos,
    isVertical,
    sequenceWidth,
    sequenceHeight,
    isHovered,
    effectiveHoverSpeed,
    targetVelocity,
    prefersReducedMotion,
  ]);

  const renderLogo = useCallback(
    (item: LogoLoopItem, key: string) => {
      if (renderItem) {
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        );
      }

      const content = isNodeItem(item) ? (
        <span
          className="logoloop__node"
          aria-hidden={item.href ? true : undefined}
        >
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ""}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const linkLabel = isNodeItem(item)
        ? (item.ariaLabel ?? item.title)
        : (item.ariaLabel ?? item.alt ?? item.title);
      const wrappedContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={linkLabel || "Open logo link"}
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li className="logoloop__item" key={key} role="listitem">
          {wrappedContent}
        </li>
      );
    },
    [renderItem],
  );

  const lists = useMemo(() => {
    if (!hasLogos) return null;

    return Array.from({ length: copyCount }, (_, copyIndex) => (
      <ul
        className="logoloop__list"
        key={`loop-copy-${copyIndex}`}
        role="list"
        aria-hidden={copyIndex > 0}
        ref={copyIndex === 0 ? sequenceRef : undefined}
      >
        {logos.map((item, itemIndex) =>
          renderLogo(item, `${copyIndex}-${itemIndex}`),
        )}
      </ul>
    ));
  }, [hasLogos, copyCount, logos, renderLogo]);

  const cssVars = useMemo(
    () =>
      ({
        "--logoloop-gap": `${safeGap}px`,
        "--logoloop-logoHeight": `${safeLogoHeight}px`,
        ...(fadeOutColor ? { "--logoloop-fadeColor": fadeOutColor } : {}),
      }) as CSSProperties,
    [safeGap, safeLogoHeight, fadeOutColor],
  );

  const rootClassName = [
    "logoloop",
    isVertical ? "logoloop--vertical" : "logoloop--horizontal",
    fadeOut ? "logoloop--fade" : "",
    scaleOnHover ? "logoloop--scale-hover" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: CSSProperties = {
    width: isVertical
      ? toCssLength(width) === "100%"
        ? undefined
        : toCssLength(width)
      : (toCssLength(width) ?? "100%"),
    ...cssVars,
    ...style,
  };

  const onMouseEnter = () => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true);
  };

  const onMouseLeave = () => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false);
  };

  if (!hasLogos) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={rootStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {lists}
      </div>
    </div>
  );
});

export default LogoLoop;
