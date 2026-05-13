import Footer from "@/components/Footer";

export default function TymliHealthPage() {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex-1 flex flex-col w-full px-0 sm:px-[8%] xl:px-[24%]">
        <div className="flex flex-1 flex-col px-6 sm:px-10 pt-32">
          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              FISTUDIOZ • UX Designer • 2025
            </p>
          </section>

          <section className="mb-12 w-full">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Smarter Records with Tymli
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Tymli Health is an AI-powered digital healthcare platform designed for both urban and
              rural India, to help doctors and patients organize health documents, receive
              AI-generated summaries, track medications, and securely share records through
              OTP-based access.
            </p>
          </section>

          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">Process</h2>
            <p className="text-muted-foreground leading-relaxed">
              I majorly collaborated in designing the end-to-end patient, doctor, and admin
              experiences, along with Tymli Health&apos;s visual identity, branding, and logo design to
              create a connected ecosystem.
            </p>
            <br />
            <p className="text-muted-foreground leading-relaxed">
              The final designs were developed as part of Tymli Health&apos;s MVP experience and are
              currently available on the App Store as a live healthcare product.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Explore the app at{" "}
              <a
                href="https://apps.apple.com/in/app/tymli-health/id6759250431"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground/60"
              >
                apps.apple.com/in/app/tymli-health/id6759250431
              </a>
              .
            </p>
          </section>

          <div className="mt-auto pt-6 pb-10">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
