import type { CSSProperties, ReactNode } from "react";
import "./GlitchText.css";

type GlitchTextProps = {
  children: ReactNode;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  text?: string;
};

type GlitchTextStyle = CSSProperties & {
  "--after-duration"?: string;
  "--before-duration"?: string;
  "--after-shadow"?: string;
  "--before-shadow"?: string;
};

const getContentText = (children: ReactNode, override?: string) => {
  if (typeof override === "string" && override.length > 0) return override;
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  return "";
};

export default function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = true,
  className = "",
  text,
}: GlitchTextProps) {
  const safeSpeed = Number.isFinite(speed) && speed > 0 ? speed : 1;
  const contentText = getContentText(children, text);

  const inlineStyles: GlitchTextStyle = {
    "--after-duration": `${safeSpeed * 3}s`,
    "--before-duration": `${safeSpeed * 2}s`,
    "--after-shadow": enableShadows ? "-5px 0 red" : "none",
    "--before-shadow": enableShadows ? "5px 0 cyan" : "none",
  };

  const hoverClass = enableOnHover ? "enable-on-hover" : "";
  const rootClass = ["glitch", hoverClass, className].filter(Boolean).join(" ");

  return (
    <span className={rootClass} style={inlineStyles} data-text={contentText}>
      {children}
    </span>
  );
}
