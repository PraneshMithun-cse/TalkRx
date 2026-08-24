import type { Metadata } from "next";
import { triviaSans, atOsmose } from "@/components/sites/demophorius-com-d11dd431/shared/fonts";
import { Header } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Header";
import { Footer } from "@/components/sites/demophorius-com-d11dd431/root-8a5edab2/Footer";

export const metadata: Metadata = { title: "Brochures – Demophorius healthcare" };

export default function BrochuresPage() {
  return (
    <div className={`demophorius-site ${triviaSans.variable} ${atOsmose.variable}`}>
      <Header />
      <main className="flex min-h-[50vh] items-center justify-center px-6 py-16 text-center md:px-10 lg:px-[72px]">
        <form className="w-full max-w-sm">
          <p className="text-sm text-[#666]">This content is password-protected. To view it, please enter the password below.</p>
          <div className="mt-6 flex items-center gap-3">
            <input
              type="password"
              placeholder="Password"
              className="flex-1 border-b border-black/30 bg-transparent px-1 py-2 text-sm outline-none focus:border-black"
            />
            <button type="submit" className="rounded-full bg-black px-5 py-2 text-sm text-white hover:opacity-80">
              Enter
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
