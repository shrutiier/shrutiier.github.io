import Image from "next/image";
import Footer from "@/components/Footer";
import { getImagePath } from "@/utils/getImagePath";


export default function ProjectPage()  {
  return (
    <main className="flex flex-col min-h-screen w-full">
      {/* Main Content Container */}
      <div className="flex-1 flex flex-col w-full px-0 sm:px-[8%] xl:px-[24%]">
        <div className="flex flex-col px-6 sm:px-10 pt-32">
          {/* Meta Info */}
          <section className="mb-2 w-full">
            <p className="uppercase tracking-widest text-sm text-muted-foreground font-mono">
              FISTUDIOZ • UX Designer • 2025
            </p>
          </section>

          {/* Intro Section */}
          <section className="mb-12 w-full">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              NICMAR Online
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              In a world rapidly moving online, one of India&apos;s most profound AEC institutions,
              NICMAR (National Institute of Construction Management and Research), set out to
              translate their 40-year legacy into a credible and accessible digital platform;
              launching their first online BIM course.
            </p>
            <br />
            <p className="text-muted-foreground leading-relaxed">
              Our goal was to build NICMAR Online&apos;s digital presence from scratch by developing the
              foundational UX and visual design.
            </p>
          </section>

          {/* Strategy Section */}
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">Strategy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Studying competitors showed us that premium courses need simple discovery and strong
              credibility. We mapped a user flow from discovery to application to payment; balancing
              NICMAR&apos;s academic stature with modern trends, while remaining intuitive for a
              traditionally-inclined user base.
            </p>
          </section>
        </div>

        {/* Secondary Image */}
        <section className="mt-6 w-full flex justify-center">
          <div className="w-full sm:-mx-[8%] xl:-mx-[24%] overflow-hidden rounded-none sm:rounded-[12px]">
            <Image
              src={getImagePath("/projects/nicmar/nicmar-accessibility.jpg")}
              alt="Accessibility Overview"
              width={1920}
              height={925}
              className="block w-full h-auto object-cover -mb-[2px]"
            />
          </div>
        </section>

        {/* Accessibility Section */}
        <div className="flex flex-col px-6 sm:px-10 pt-12">
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">
              Accessibility as a Non-Negotiable
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              At NICMAR Online, accessibility was essential. We integrated WCAG 2.1 Level A/AA
              compliance into all design and development.
            </p>

            <br />

            <p className="text-muted-foreground leading-relaxed">
              Key accessibility details included:
            </p>

            <ul className="list-disc pl-6 mt-2 text-muted-foreground leading-relaxed">
              <li>Contrast ratios for clarity in dark mode</li>
              <li>Keyboard navigation for a mouse-free journey</li>
              <li>
                Screen reader validation with Mac&apos;s VoiceOver for accurate interpretation of content
              </li>
              <li>And more...</li>
            </ul>
          </section>

          {/* Results Section */}
          <section className="mb-12 w-full">
            <h2 className="text-lg font-normal text-foreground/90 mb-2">Results</h2>
            <p className="text-muted-foreground leading-relaxed">
              Through testing and iterative refinements, we made sure to comply with WCAG 2.1 Level
              A/AA standards; opening educational opportunities to more learners and making learning
              more accessible.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Explore the platform at{" "}
              <a
                href="https://www.nicmaronline.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground/60"
              >
                www.nicmaronline.com
              </a>
              .
            </p>
          </section>

          {/* Footer */}
          <div className="pt-6 pb-10">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
