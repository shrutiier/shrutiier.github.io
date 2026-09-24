import BackLink from "@/components/BackLink";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getImagePath } from "@/utils/getImagePath";

export default function ProjectPage() {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <RevealOnScroll />
      <div className="flex-1 flex flex-col page-column">
        <div className="flex flex-col pt-32">
          <BackLink />

          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              FISTUDIOZ • UX Designer • 2026
            </p>
          </section>

          <section className="mb-12 w-full reveal" data-reveal>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              NOEDRA Design system
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Building a shared design foundation for Siemens Energy&apos;s digital grid products,
              supporting multiple products with reusable components, data visualization patterns,
              accessibility, and governance.
            </p>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center reveal" data-reveal>
          <div className="page-bleed overflow-hidden rounded-none sm:rounded-[12px]">
            <video
              src={getImagePath("/projects/siemens-energy-design-system/hero.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-label="NOEDRA design system interface motion"
              width={1920}
              height={1218}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col pt-12">
          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-6">Before the Build</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-2 border-accent-deep pl-3">
                <h3 className="font-medium text-foreground mb-2">Starting point</h3>
                <p className="text-muted-foreground leading-relaxed">
                  NOEDRA grew from a proven visual language created for one product, so the next step
                  was to make it work across more.
                </p>
              </div>

              <div className="border-l-2 border-accent-deep pl-3">
                <h3 className="font-medium text-foreground mb-2">What we explored</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reviewed existing products to understand patterns, workflows,
                  components the wider system would need.
                </p>
              </div>

              <div className="border-l-2 border-accent-deep pl-3">
                <h3 className="font-medium text-foreground mb-2">The challenge</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Build one shared language without forcing every product into the same mould.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12 w-full xl:relative reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Building the Base</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We turned the patterns from our research into a flexible foundation for everything
              that followed.
            </p>

            <ul className="space-y-4">
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Foundation tokens</span> &ndash; Colour, typography, motion, spacing, elevation, corner radius, layer system, grid layouts, themes and modes established the visual baseline.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Semantic tokens</span> &ndash; We introduced meaning on top of the basics, defining roles for surfaces, states, status, overlays, and data visualisation.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Component tokens</span> &ndash; Components were mapped back to the semantic layer, creating a clearer connection between design decisions and implementation.
              </li>
            </ul>

            <aside className="mt-8 rounded-[4px] bg-muted p-5 xl:absolute xl:top-0 xl:left-full xl:ml-16 xl:mt-0 xl:w-56 2xl:w-64">
              <h3 className="font-semibold text-muted-foreground mb-3">A11y Considerations</h3>
              <p className="text-muted-foreground leading-relaxed">
                Accessibility was built into the foundation, following WCAG 2.2 across colour contrast, typography, spacing, sizing, states, and visual hierarchy.
              </p>
            </aside>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center reveal" data-reveal>
          <div className="page-bleed overflow-hidden rounded-none sm:rounded-[12px]">
            <video
              src={getImagePath("/projects/siemens-energy-design-system/foundation.mp4")}
              poster={getImagePath("/projects/siemens-energy-design-system/foundation.jpg")}
              autoPlay
              loop
              muted
              playsInline
              aria-label="NOEDRA foundation tokens and design system architecture"
              width={1920}
              height={839}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col pt-12">
          <section className="mb-12 w-full xl:relative reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Components</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We turned the foundation into 56 reusable components, then extended them for the
              complexity of energy products.
            </p>

            <ul className="space-y-4">
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Core components</span> &ndash; The everyday building blocks: navigation, inputs, controls, feedback, and other patterns used across products.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Data &amp; interaction</span> &ndash; We built patterns for information-heavy work, including KPI cards, charts, tables, filters, status, and other ways of working with dense data.
              </li>
              <li className="text-muted-foreground leading-relaxed">
                  <span className="font-semibold">Energy-specific</span> &ndash; These are components around the needs of digital grid products and operational workflows.
              </li>
            </ul>

            <aside className="mt-8 rounded-[4px] bg-muted p-5 xl:absolute xl:top-0 xl:right-full xl:mr-16 xl:mt-0 xl:w-56 2xl:w-64">
              <h3 className="font-semibold text-muted-foreground mb-3">A11y Considerations</h3>
              <p className="text-muted-foreground leading-relaxed">
                The A11y principles from foundation carried into each component, with guidance covering focus, tab order, keyboard interaction, states, sizing, and other accessibility considerations.
              </p>
            </aside>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center reveal" data-reveal>
          <div
            className="relative page-bleed overflow-hidden rounded-none sm:rounded-[12px]"
            style={{ aspectRatio: "1920 / 937.5", backgroundColor: "var(--background)" }}
            role="img"
            aria-label="NOEDRA base and energy specific components in use"
          >
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c1.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "11.7188%", top: "1.5000%", width: "16.2598%", height: "35.2000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c2.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "10.2539%", top: "11.8000%", width: "6.6895%", height: "6.0000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c3.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "10.1562%", top: "21.8000%", width: "3.8086%", height: "5.2000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c4.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "10.4492%", top: "41.3000%", width: "8.2520%", height: "6.6000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c5.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "10.2539%", top: "51.0000%", width: "15.4785%", height: "38.4000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c6.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "4.1504%", top: "12.5000%", width: "4.9805%", height: "75.2000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c7.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "27.6367%", top: "51.3000%", width: "34.2773%", height: "37.4000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c8.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "27.7832%", top: "12.5000%", width: "33.9355%", height: "36.4000%" }}
            />
            <video
              src={getImagePath("/projects/siemens-energy-design-system/components/c9.mp4")}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute object-cover rounded-[4px]"
              style={{ left: "63.0859%", top: "12.3000%", width: "33.5449%", height: "76.0000%" }}
            />
          </div>
        </section>

        <div className="flex flex-col pt-12">
          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Templates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We created 13 reusable layouts for recurring product needs, bringing together the
              right components, content structures, navigation, and interactions while adapting
              across different viewport sizes and responsive states.
            </p>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center reveal" data-reveal>
          <div className="page-bleed overflow-hidden rounded-none sm:rounded-[12px]">
            <video
              src={getImagePath("/projects/siemens-energy-design-system/templates.mp4")}
              poster={getImagePath("/projects/siemens-energy-design-system/templates.jpg")}
              autoPlay
              loop
              muted
              playsInline
              aria-label="NOEDRA design system templates"
              width={1280}
              height={812}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col pt-12">
          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Across the Product Ecosystem
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              NOEDRA brings the same underlying language into different product contexts, adapting
              shared patterns to the workflows, information, and needs of each product.
            </p>
          </section>

          <section className="mb-12 w-full reveal" data-reveal>
            <h2 className="text-lg font-medium text-foreground mb-2">Scale &amp; Impact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Built to grow beyond a single product, NOEDRA brought a design foundation with 56
              reusable components, templates, documented patterns, accessibility guidance, and
              governance into one shared system, giving teams a common foundation to build from as
              the ecosystem expands.
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
