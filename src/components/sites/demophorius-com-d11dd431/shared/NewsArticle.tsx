import Link from "next/link";
import { BackButton } from "./BackButton";
import { resolveImage } from "./resolve-image";
import type { NewsArticleData } from "./types";

export function NewsArticle({ article }: { article: NewsArticleData }) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
      <div className="flex items-center justify-between">
        <BackButton href="/media-news/" />
        <div className="text-right">
          {article.category && (
            <div className="text-xs uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
              {article.category}
            </div>
          )}
          <div className="mt-1 text-sm text-[#666]">{article.date}</div>
        </div>
      </div>

      <h1 className="mt-8 max-w-4xl text-3xl leading-tight lg:text-6xl">{article.title}</h1>

      {article.image && (
        <div className="mt-10 aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-[#f3f1f2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveImage(article.image)} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          {article.descriptionSmall && <p className="text-lg leading-relaxed">{article.descriptionSmall}</p>}
          {article.descriptionHtml && (
            <div
              className="prose prose-neutral mt-6 max-w-none text-sm leading-relaxed text-[#444] [&_a]:underline [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: article.descriptionHtml }}
            />
          )}
        </div>

        {article.credits.length > 0 && (
          <div className="border-t border-black/10 pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            <div className="text-xs font-medium uppercase tracking-[1px]">Credits</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {article.credits.map((c, i) => (
                <li key={i}>
                  <span className="text-[#666]">{c.label}</span>{" "}
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="hover:underline">
                      {c.text}
                    </a>
                  ) : (
                    c.text
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {article.related.length > 0 && (
        <div className="mt-16 lg:mt-24">
          <div className="text-2xl lg:text-4xl">Related News</div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {article.related.map((r) => (
              <Link key={r.href} href={r.href} className="block">
                <div className="aspect-[3/4] overflow-hidden rounded-[10px] bg-[#f3f1f2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImage(r.image)} alt={r.title} className="h-full w-full object-cover" />
                </div>
                {r.category && (
                  <div className="mt-3 text-[11px] uppercase tracking-[1px]" style={{ fontFamily: "var(--do-font-label)" }}>
                    {r.category}
                  </div>
                )}
                <div className="mt-1 text-sm text-[#666]">{r.date}</div>
                <div className="mt-1 text-base">{r.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
