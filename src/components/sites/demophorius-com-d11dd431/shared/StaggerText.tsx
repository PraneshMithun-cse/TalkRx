"use client";

export function StaggerText({
  text,
  isInView,
  className = "",
}: {
  text: string;
  isInView: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-500 ease-out"
          style={{
            transform: isInView ? "translateY(0) rotate(0deg)" : "translateY(110%) rotate(20deg)",
            transitionDelay: `${i * 18}ms`,
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
