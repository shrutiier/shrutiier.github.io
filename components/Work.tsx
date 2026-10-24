import Link from "next/link";

export default function Work() {
  const projects = [
    {
      title: "NOEDRA Design system",
      description: "Design system for energy operation platforms",
      role: "UX Designer",
      year: 2026,
      href: "/projects/siemens-energy-design-system",
    },
    {
      title: "Tymli Health",
      description: "Health records for doctors and patients",
      role: "UX Designer",
      year: 2025,
      href: "/projects/tymli-health",
    },
    {
      title: "NICMAR Online",
      description: "Accessible platform for NICMAR Online",
      role: "UX Designer",
      year: 2025,
      href: "/projects/nicmar",
    },
    {
      title: "Human Factors Research & Design",
      description: "A clearer web presence",
      role: "UX Designer",
      year: 2024,
      href: "/projects/hfrd",
    },
  ];

  return (
    <section className="w-full">
      {/* A plain list, no dividers between the rows. */}
      <div>
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.href}
            className="group flex items-center justify-between cursor-pointer"
          >
            {/* Title with its description beneath on the left, year pushed to the far right of the row. */}
            <div className="flex w-full items-baseline justify-between gap-x-4 py-[14px] cursor-pointer">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-accent-muted">
                  {project.title}
                </span>
                <span className="text-[13px] font-normal text-muted-foreground transition-colors group-hover:text-accent-muted">
                  {project.description}
                </span>
              </div>
              <span className="shrink-0 text-[12px] uppercase text-muted-foreground tracking-wide font-mono transition-colors group-hover:text-accent-muted">
                {project.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
