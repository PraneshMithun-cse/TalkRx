export function LegalPage({ html }: { html: string }) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-[72px] lg:py-14">
      <div
        className="prose prose-neutral max-w-3xl text-sm leading-relaxed [&_h1]:mb-6 [&_h1]:text-4xl [&_h1]:lg:text-5xl [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-medium [&_p]:mb-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
