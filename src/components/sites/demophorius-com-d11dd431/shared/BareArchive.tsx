import Link from "next/link";

export function BareArchive({ title, items }: { title: string; items: { title: string; href: string; date: string }[] }) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
      <h1 className="text-2xl lg:text-4xl">{title}</h1>
      <ul className="mt-8 list-none divide-y divide-black/10 border-y border-black/10">
        {items.map((item) => (
          <li key={item.href} className="flex items-center justify-between py-4">
            <Link href={item.href} className="hover:underline">
              {item.title}
            </Link>
            <span className="text-sm text-[#999]">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
