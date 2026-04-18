interface LogoProps {
  className?: string;
  /** Use "dark" on light backgrounds (default), "light" on dark backgrounds, or "auto" to follow the theme */
  variant?: "dark" | "light" | "auto";
}

export function NexTradeLogo({ className = "h-10 w-auto", variant = "auto" }: LogoProps) {
  const textColor =
    variant === "light"
      ? "#FFFFFF"
      : variant === "dark"
      ? "#0F172A"
      : "currentColor";

  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NexTrade"
      role="img"
    >
      {/* Brand arc */}
      <path
        d="M50 45C100 15 250 15 300 45"
        stroke="#14B8A6"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Main wordmark */}
      <text
        x="200"
        y="85"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="52"
        fill={textColor}
        letterSpacing="-1"
      >
        NEX TRADE
      </text>

      {/* Tagline */}
      <text
        x="200"
        y="108"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="700"
        fontSize="14"
        fill={textColor}
        letterSpacing="1"
        opacity="0.7"
      >
        THE FUTURE OF DIGITAL EXCHANGE.
      </text>
    </svg>
  );
}
