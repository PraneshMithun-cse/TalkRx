import Link from "next/link";
import { ArrowDiagonalIcon } from "./icons";

export function InquiryCta({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="mt-16 lg:mt-24">
      <hr className="border-t border-black/20" />
      <Link href={href} className="group flex items-center justify-between py-8">
        <div>
          <div className="text-xl uppercase leading-tight lg:text-2xl">{title}</div>
          <div className="mt-1 text-[13px] uppercase tracking-[1px] lg:text-[15px]" style={{ fontFamily: "var(--do-font-label)" }}>
            {subtitle}
          </div>
        </div>
        <ArrowDiagonalIcon className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </Link>
      <hr className="border-t border-black/20" />
    </div>
  );
}
