import Footer from "@/components/Footer";
import Work from "@/components/Work";
// import Art from "@/components/Photos"; // artworks hidden for now
import RevealOnScroll from "@/components/RevealOnScroll";
import Pond from "@/components/Pond";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full min-h-screen">
      <RevealOnScroll />
      {/* Centered container — has horizontal padding only on larger screens */}
      {/* flex-1 lets the column fill the screen, so the footer can sit at the bottom */}
      <div className="flex flex-1 flex-col page-column">
        {/* Pond — runs between the guide lines and fades into the page on every side */}
        <section className="pt-20 reveal" data-reveal>
          <div className="page-bleed">
            <Pond />
          </div>
        </section>

        {/* Header Section */}
        <section className="flex flex-col py-12 reveal" data-reveal>
          <div className="mb-2 flex items-baseline gap-2">
            <h1
              className="text-[30px] md:text-[30px] leading-none"
              style={{ fontFamily: "var(--font-ibm-plex-serif), serif", fontWeight: 700, color: "var(--accent)" }}
            >
              shruti
            </h1>
            <span
              className="text-[18px]"
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

        {/* Work + Art — one container, so they sit closer than other sections */}
        <section className="flex flex-col gap-[62px] py-4 reveal" data-reveal>
          <div className="w-full sm:-mx-2 sm:w-[calc(100%+1rem)]">
            <Work />
          </div>
          {/* <Art /> — artworks hidden for now */}
        </section>

        {/* Footer — pushed to the bottom of the page, even when the content is short */}
        <section className="mt-auto py-4 reveal" data-reveal>
          <Footer showStatus />
        </section>
      </div>
    </main>
  );
}
