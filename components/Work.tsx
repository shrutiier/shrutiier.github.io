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
      title: "Human Factors Research & Design",
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
            className="group flex items-center justify-between border-b border-border last:border-b-0 cursor-pointer"
          >
            {/* Title, then role / year trailing it on the same line: title / role / year.
                Wraps under the title on narrow screens rather than overflowing. */}
            <div className="flex w-full flex-wrap items-baseline gap-x-2 px-2 py-[14px] cursor-pointer">
              <span className="text-[15px] font-medium text-foreground transition-colors group-hover:text-accent-muted">
                {project.title}
              </span>
              {/* Description hidden for now
              <span className="text-[13px] font-normal text-muted-foreground">
                {project.description}
              </span>
              */}
              <span className="text-[12px] uppercase text-muted-foreground tracking-wide font-mono transition-colors group-hover:text-accent-muted">
                / {project.role} / {project.year}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
