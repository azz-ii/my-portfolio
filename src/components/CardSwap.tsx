import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import "./CardSwap.css";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { customClass, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={["card", customClass, className].filter(Boolean).join(" ")}
    />
  );
});

type CardSwapProps = {
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (index: number) => void;
  skewAmount?: number;
  easing?: "elastic" | "smooth";
  children: ReactNode;
};

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

const makeSlot = (
  index: number,
  distX: number,
  distY: number,
  total: number,
): Slot => ({
  x: index * distX,
  y: -index * distY,
  z: -index * distX * 1.5,
  zIndex: total - index,
});

const placeNow = (element: HTMLDivElement, slot: Slot, skew: number) => {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => createRef<HTMLDivElement>()),
    [childArr.length],
  );
  const orderRef = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;
      placeNow(
        el,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount,
      );
    });

    const swap = () => {
      if (orderRef.current.length < 2) return;

      const [front, ...rest] = orderRef.current;
      const frontEl = refs[front]?.current;
      if (!frontEl) return;

      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(frontEl, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      timeline.addLabel(
        "promote",
        `-=${config.durDrop * config.promoteOverlap}`,
      );

      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        timeline.set(el, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
      );
      timeline.addLabel(
        "return",
        `promote+=${config.durMove * config.returnDelay}`,
      );
      timeline.call(
        () => {
          gsap.set(frontEl, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );

      timeline.to(
        frontEl,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      timeline.call(() => {
        orderRef.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = containerRef.current;
      if (!node) return undefined;

      const pause = () => {
        timelineRef.current?.pause();
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      const resume = () => {
        timelineRef.current?.play();
        if (!intervalRef.current) {
          intervalRef.current = window.setInterval(swap, delay);
        }
      };

      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);

      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        timelineRef.current?.kill();
      };
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timelineRef.current?.kill();
    };
  }, [
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    easing,
    refs,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
  ]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;

    const el = child as ReactElement<{
      style?: CSSProperties;
      onClick?: (event: MouseEvent<HTMLElement>) => void;
    }>;

    return cloneElement(
      el as ReactElement<any>,
      {
        key: i,
        ref: refs[i],
        style: { width, height, ...(el.props.style ?? {}) },
        onClick: (event: MouseEvent<HTMLElement>) => {
          el.props.onClick?.(event);
          onCardClick?.(i);
        },
      } as any,
    );
  });

  return (
    <div
      ref={containerRef}
      className="card-swap-container"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
}
