import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getImagePath } from "@/utils/getImagePath";

function Motion({ name, label, width, height }: { name: string; label: string; width: number; height: number }) {
  return (
    <section className="mt-6 w-full flex justify-center reveal" data-reveal>
      <div className="w-full overflow-hidden rounded-[12px]">
        <video
          src={getImagePath(`/projects/tymli-health/tymli-${name}.mp4`)}
          poster={getImagePath(`/projects/tymli-health/tymli-${name}.jpg`)}
          autoPlay
          loop
          muted
          playsInline
          aria-label={label}
          width={width}
          height={height}
          className="block w-full h-auto object-cover -mb-[2px]"
        />
      </div>
    </section>
  );
}

export default function TymliHealthPage() {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <RevealOnScroll />
      <div className="flex-1 flex flex-col page-column">
        <div className="flex flex-col pt-32">
          <BackLink />

          {/* Meta Info */}
          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              FISTUDIOZ • UX Designer • 2025
            </p>
          </section>

          {/* Hero */}
          <section className="mb-12 w-full reveal" data-reveal>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Smarter Records with Tymli
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Designing an AI-powered healthcare platform that helps patients and doctors organise
              health records, understand medical information, track medications, and securely share
              documents.
            </p>
          </section>
        </div>

        <Motion name="hero" label="Tymli Health app screens coming together" width={1440} height={1128} />

        {/* The Product */}
        <div className="flex flex-col pt-12">
          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Making health records easier to work with
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Tymli is a digital healthcare platform designed for urban and rural India. It brings
              health documents, AI-generated summaries, medication tracking, and secure record sharing
              into one place.
            </p>
          </section>

          {/* Patient Experience */}
          <section className="mb-6 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Patient Experience</h2>
            <p className="text-muted-foreground leading-relaxed">
              For patients, the experience brings health records and information into one place, while
              turning uploaded reports into AI-powered health insights, making their health easier to
              access, understand, and track.
            </p>
          </section>
        </div>

        <Motion name="patient" label="Tymli patient mobile app flow" width={1440} height={1200} />

        <div className="flex flex-col pt-6">
          <section className="mb-12 w-full reveal" data-reveal>
            <p className="text-muted-foreground leading-relaxed">
              The flows focused on how patients access, organise, understand, and share their health
              information within the product.
            </p>
          </section>

          {/* Doctor Experience */}
          <section className="mb-6 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Doctor Experience</h2>
            <p className="text-muted-foreground leading-relaxed">
              For doctors, Tymli brings patient records and relevant health information together, with
              AI-generated summaries helping make large amounts of information easier to work through.
            </p>
          </section>
        </div>

        <Motion name="doctor" label="Tymli doctor web experience" width={1440} height={900} />

        <div className="flex flex-col pt-6">
          <section className="mb-12 w-full reveal" data-reveal>
            <p className="text-muted-foreground leading-relaxed">
              The flows focused on how doctors access, review, and work with patient information within
              the product.
            </p>
          </section>

          {/* Admin Experience */}
          <section className="mb-6 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Admin Experience</h2>
            <p className="text-muted-foreground leading-relaxed">
              The supporting experience handles the operational side of the platform, helping manage
              information, review prescriptions, and keep workflows running smoothly behind the patient
              and doctor experiences.
            </p>
          </section>
        </div>

        <Motion name="admin" label="Tymli admin and backend experience" width={1440} height={900} />

        <div className="flex flex-col pt-6">
          <section className="mb-12 w-full reveal" data-reveal>
            <p className="text-muted-foreground leading-relaxed">
              The flows focused on how admins manage information, review prescriptions, and support the
              workflows behind the patient and doctor experiences.
            </p>
          </section>

          {/* Results */}
          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Results</h2>
            <p className="text-muted-foreground leading-relaxed">
              The flows and interfaces came together as part of Tymli Health&apos;s MVP, bringing the
              patient and doctor experiences into a live healthcare product.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-6">
              Explore the app on the{" "}
              <a
                href="https://apps.apple.com/in/app/tymli-health/id6759250431"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground/60"
              >
                App Store
              </a>
              .
            </p>
          </section>

          <div className="pt-6 pb-10">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
