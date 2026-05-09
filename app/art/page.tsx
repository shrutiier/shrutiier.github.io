import Image from "next/image";
import Footer from "@/components/Footer";
import { getImagePath } from "@/utils/getImagePath";

export default function Art() {
  return (
    <main className="flex-1 flex flex-col px-[8%] xl:px-[24%] min-h-screen w-full">
      {/* Removed vertical divider lines */}

      <div className="text-md text-muted-foreground pt-32 pb-20 text-center">
        {" "}
        A selection of my favorite artworks
      </div>

      {/* Artwork grid - full width */}
      <div className="py-6 -mx-[8%] xl:-mx-[24%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 lg:px-8 relative z-10">
          <Image
            src={getImagePath("/artworks/mother-teresa.jpg")}
            alt="Artwork"
            width={800}
            height={1000}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="rounded-md w-full h-auto object-cover"
          />
          <Image
            src={getImagePath("/artworks/god-of-death.jpg")}
            alt="Artwork"
            width={800}
            height={1000}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="rounded-md w-full h-auto object-cover"
          />
          <Image
            src={getImagePath("/artworks/pearl-earring-girl.jpg")}
            alt="Artwork"
            width={800}
            height={1000}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="rounded-md w-full h-auto object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row border-t-[0.5px] px-10 -mt-[0.5px]">
        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
