import Image from "next/image";
import Footer from "@/components/Footer";
import { getImagePath } from "@/utils/getImagePath";

export default function ProjectPage() {
  return (
    <main className="flex flex-col min-h-screen w-full">
      <div className="flex-1 flex flex-col w-full px-0 sm:px-[8%] xl:px-[24%]">
        <div className="flex flex-col px-6 sm:px-10 pt-32">
          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              FISTUDIOZ • UX Designer • 2026
            </p>
          </section>

          <section className="mb-12 w-full">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              NOEDRA Design system
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Collaborated in building a design system for Siemens Energy&apos;s digital grid products
              ecosystem - NOEDRA. The project focused on creating a shared foundation for
              dashboards, monitoring systems and operational interfaces used across multiple DG
              projects.
            </p>
          </section>

          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">System Architecture</h2>

            <div className="space-y-8">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  A complete enterprise design system built in Figma with foundation tokens,
                  semantic tokens, component tokens, accessibility guidelines, governance
                  frameworks, and documentation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-normal text-foreground/90 mb-2">
                  1. Building Blocks
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    <span className="text-foreground">Foundation Tokens</span> - Built the
                    foundational token architecture covering color, typography, spacing, elevation,
                    themes, and modes.
                  </li>
                  <li>
                    <span className="text-foreground">Semantic Tokens</span> - Created an
                    intent-driven semantic structure for interaction states, layered surfaces,
                    status systems, overlays, accessibility, and data visualization.
                  </li>
                  <li>
                    <span className="text-foreground">Component Tokens</span> - Mapped scalable
                    component architecture to semantic foundations using a DTCG-aligned structure to
                    improve consistency between design and implementation.
                  </li>
                </ul>
              </div>

            </div>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center">
          <div className="w-full sm:-mx-[8%] xl:-mx-[24%] overflow-hidden rounded-none sm:rounded-[12px]">
            <Image
              src={getImagePath("/projects/siemens-energy-design-system/foundation.jpg")}
              alt="NOEDRA foundation tokens and design system architecture"
              width={1920}
              height={895}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col px-6 sm:px-10 pt-12">
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">2. Components:</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="text-foreground">Base Components</span> - Forms, navigation,
                tables, overlays, notifications, inputs, and data visualization patterns.
              </li>
              <li>
                <span className="text-foreground">Energy Specific Components</span> - Gauge charts,
                monitoring widgets, substations, operational dashboards, connectors, and energy
                analytics interfaces.
              </li>
            </ul>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center">
          <div className="w-full sm:-mx-[8%] xl:-mx-[24%] overflow-hidden rounded-none sm:rounded-[12px]">
            <Image
              src={getImagePath("/projects/siemens-energy-design-system/components.jpg")}
              alt="NOEDRA base and energy specific components"
              width={1920}
              height={895}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col px-6 sm:px-10 pt-12">
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">
              3. NOEDRA Design System Templates
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Built a reusable template library on top of the design system to accelerate adoption
              across DG projects.
            </p>
          </section>
        </div>

        <section className="mt-6 w-full flex justify-center">
          <div className="w-full sm:-mx-[8%] xl:-mx-[24%] overflow-hidden rounded-none sm:rounded-[12px]">
            <Image
              src={getImagePath("/projects/siemens-energy-design-system/templates.jpg")}
              alt="NOEDRA design system templates"
              width={1920}
              height={895}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        <div className="flex flex-col px-6 sm:px-10 pt-12">
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">Design System Scale</h2>
            <p className="text-muted-foreground leading-relaxed">
              Published scalable Figma libraries with structured variants, naming conventions,
              variables, modes, documentation, developer-ready architecture, and components for
              large desktop, desktop, tablet, and mobile versions.
            </p>
            <br />
            <p className="text-muted-foreground leading-relaxed">
              The system included 237 components and 27,453 component inserts.
            </p>
            <br />
            <p className="text-muted-foreground leading-relaxed">
              Delivered within a short timeline to enable early adoption and establish a shared
              design foundation across multiple Siemens Energy teams and products.
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
