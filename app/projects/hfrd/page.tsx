import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function ProjectPage() {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <RevealOnScroll />
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col page-column">
        <div className="flex flex-col pt-32">
          {/* Meta Info */}
          <BackLink />

          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              Human Factors Research &amp; Design / UX Designer / 2024
            </p>
          </section>

          {/* Intro Section */}
          <section className="mb-12 w-full reveal" data-reveal>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Human Factors R&amp;D
            </h1>
            {/* Placeholder until the case study is written */}
            <p className="text-muted-foreground leading-relaxed">In progress</p>
          </section>
        </div>

        {/* Footer — pushed to the bottom of the page, even when the content is short */}
        <div className="mt-auto pt-6 pb-10">
          <Footer />
        </div>
      </div>
    </main>
  );
}
