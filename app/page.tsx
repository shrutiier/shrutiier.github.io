import Footer from "@/components/Footer";
import Work from "@/components/Work";
import Art from "@/components/Photos";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col w-full min-h-screen">
      {/* Centered container — has horizontal padding only on larger screens */}
      <div className="flex flex-col w-full px-0 sm:px-[8%] xl:px-[24%]">
        {/* Header Section */}
        <section className="flex flex-col py-12 px-6 sm:px-12 pt-32">
          <h1
            className="text-[24px] md:text-[24px] mb-2 leading-none text-foreground"
            style={{ fontFamily: "IBM Plex Serif", fontWeight: 400 }}
          >
            Shruti
          </h1>
          <p
            className="text-muted-foreground text-[16px] max-w-2xl"
            style={{ fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            A running log of what I&apos;ve been doing.
          </p>
        </section>

        {/* Featured Work Section */}
        <section className="flex flex-col md:flex-row px-6 sm:px-10 py-4">
          <div className="w-full">
            <Work />
          </div>
        </section>

        {/* Art Section */}
        <section className="flex flex-col md:flex-row py-4 px-6 sm:px-12">
          <Art />
        </section>

        {/* Footer */}
        <section className="px-6 sm:px-12 py-4">
          <Footer />
        </section>
      </div>
    </main>
  );
}
