import Link from "next/link";

export default function Work() {
  const projects = [
    {
      title: "NOEDRA Design system",
      description: "Designing for energy operations",
      role: "UX Designer",
      year: 2026,
      href: "/projects/siemens-energy-design-system",
    },
    {
      title: "Tymli Health",
      description: "Smarter digital health records",
      role: "UX Designer",
      year: 2025,
      href: "/projects/tymli-health",
    },
    {
      title: "NICMAR Online",
      description: "Accessible online presence",
      role: "UX Designer",
      year: 2025,
      href: "/projects/nicmar",
    },
    {
      title: "Human Factors R&D",
      description: "A clearer web presence",
      role: "UX Designer",
      year: 2024,
      href: "/projects/hfrd",
    },
  ];

  return (
    <section className="w-full">
      {/* A plain list split by hairlines between the rows only. */}
      <div>
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.href}
            className="group flex items-center justify-between border-b border-border/70 last:border-b-0 cursor-pointer"
          >
            <div className="flex w-full justify-between items-baseline px-2 py-[14px] cursor-pointer">
              {/* Left: title */}
              <div className="flex flex-col items-start text-left min-w-[160px] gap-[0.5px]">
                <span
                  className="text-[14px] md:text-[14px] text-foreground tracking-wider transition-colors group-hover:text-accent"
                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {project.title}
                </span>
                {/* Description hidden for now
                <span
                  className="text-[13px] md:text-[13px] tracking-wide font-normal text-muted-foreground"
                  style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                >
                  {project.description}
                </span>
                */}
              </div>

              {/* Right: role / year, on the same line as the title (hidden on mobile) */}
              <span className="hidden md:block shrink-0 text-right text-xs uppercase text-muted-foreground tracking-wide font-mono transition-colors group-hover:text-accent-muted">
                {project.role} / {project.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
