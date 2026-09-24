import Footer from "@/components/Footer";
import Work from "@/components/Work";
import Art from "@/components/Photos";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full min-h-screen">
      <RevealOnScroll />
      {/* Centered container — has horizontal padding only on larger screens */}
      <div className="flex flex-col page-column">
        {/* Header Section */}
        <section className="flex flex-col py-12 pt-32 reveal" data-reveal>
          <div className="mb-2 flex items-baseline gap-2">
            <h1
              className="text-[36px] md:text-[36px] leading-none"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif", fontWeight: 700, color: "var(--accent)" }}
            >
              shruti
            </h1>
            <span
              className="text-[22px]"
              style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", color: "var(--accent)" }}
            >
              /shroo-tea/
            </span>
          </div>
          <p
            className="text-muted-foreground text-[16px] max-w-2xl"
            style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            A running log of what I&apos;ve been doing.
          </p>
        </section>

        {/* Featured Work Section */}
        <section className="flex flex-col md:flex-row py-4 sm:-mx-2 reveal" data-reveal>
          <div className="w-full">
            <Work />
          </div>
        </section>

        {/* Art Section */}
        <section className="flex flex-col md:flex-row py-4 reveal" data-reveal>
          <Art />
        </section>

        {/* Footer */}
        <section className="py-4 reveal" data-reveal>
          <Footer showStatus />
        </section>
      </div>
    </main>
  );
}
