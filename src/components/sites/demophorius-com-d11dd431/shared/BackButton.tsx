import Link from "next/link";
import { CircleArrowLeftIcon } from "./icons";

export function BackButton({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link href={href} aria-label="Back" className={`inline-flex h-12 w-12 items-center justify-center text-black ${className}`}>
      <CircleArrowLeftIcon className="h-full w-full" />
    </Link>
  );
}
