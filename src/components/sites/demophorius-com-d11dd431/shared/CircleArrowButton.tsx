import Link from "next/link";
import { CircleArrowRightIcon } from "./icons";

export function CircleArrowButton({
  href,
  label,
  className = "",
}: {
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {label ? (
        <span className="flex w-full items-center justify-between px-6 text-sm">
          {label}
          <CircleArrowRightIcon className="h-5 w-5" />
        </span>
      ) : (
        <CircleArrowRightIcon className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}
