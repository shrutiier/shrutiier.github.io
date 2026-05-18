"use client";
import Image from "next/image";
import { getImagePath } from "@/utils/getImagePath";

export default function Art() {
  return (
    <section className="flex-1 flex flex-col w-full">
      {/* Removed outer vertical divider lines */}

      {/* <div className="text-md text-muted-foreground pt-32 pb-20 text-center">
        {" "}
        A selection of my favorite artworks
      </div> */}

      {/* Artwork grid - full width */}
      <div className="py-6">
        <div className="grid grid-cols-3 gap-2 relative z-10 w-full">
          <div
            className="group overflow-hidden rounded-[2px]"
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              (e.currentTarget as HTMLDivElement).style.setProperty("--x", `${x}%`);
              (e.currentTarget as HTMLDivElement).style.setProperty("--y", `${y}%`);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.removeProperty("--x");
              (e.currentTarget as HTMLDivElement).style.removeProperty("--y");
            }}
          >
            <Image
              src={getImagePath("/artworks/mother-teresa.jpg")}
              alt="Artwork"
              width={1299}
              height={1920}
              className="block w-[calc(100%+3px)] max-w-none h-auto object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.8]"
              style={{ transformOrigin: "var(--x,50%) var(--y,50%)" }}
            />
          </div>
          <div
            className="group overflow-hidden rounded-[2px]"
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              (e.currentTarget as HTMLDivElement).style.setProperty("--x", `${x}%`);
              (e.currentTarget as HTMLDivElement).style.setProperty("--y", `${y}%`);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.removeProperty("--x");
              (e.currentTarget as HTMLDivElement).style.removeProperty("--y");
            }}
          >
            <Image
              src={getImagePath("/artworks/god-of-death.jpg")}
              alt="Artwork"
              width={1299}
              height={1920}
              className="block w-[calc(100%+3px)] max-w-none h-auto object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.8]"
              style={{ transformOrigin: "var(--x,50%) var(--y,50%)" }}
            />
          </div>
          <div
            className="group overflow-hidden rounded-[2px]"
            onMouseMove={(e) => {
              const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const x = ((e.clientX - r.left) / r.width) * 100;
              const y = ((e.clientY - r.top) / r.height) * 100;
              (e.currentTarget as HTMLDivElement).style.setProperty("--x", `${x}%`);
              (e.currentTarget as HTMLDivElement).style.setProperty("--y", `${y}%`);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.removeProperty("--x");
              (e.currentTarget as HTMLDivElement).style.removeProperty("--y");
            }}
          >
            <Image
              src={getImagePath("/artworks/pearl-earring-girl.jpg")}
              alt="Artwork"
              width={1299}
              height={1920}
              className="block w-[calc(100%+3px)] max-w-none h-auto object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.8]"
              style={{ transformOrigin: "var(--x,50%) var(--y,50%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
