import Link from "next/link";

export default function Work() {
  const projects = [
    {
      title: "NICMAR Online",
      description: "Designed NICMAR Online’s digital presence",
      role: "UX Designer",
      year: 2025,
      href: "/projects/nicmar",
    },
    {
      title: "Smarter Records with Tymli",
      description: "Simplified health records for doctors & patients",
      role: "UX Designer",
      year: 2025,
      href: "/projects/tymli-health",
    },
  ];

  return (
    <section className="pt-6 pb-16 w-full">
      <div className="space-y-1">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.href}
            className="flex items-center justify-between bg-muted hover:bg-muted/60 transition-colors first:rounded-t-[16px] last:rounded-b-[16px] cursor-pointer"
          >
            <div className="flex w-full justify-between items-center px-[12px] py-[8px] cursor-pointer">
              {/* Left: title and description */}
              <div className="flex flex-col items-start text-left min-w-[160px] gap-[0.5px]">
                <span className="text-[14px] md:text-[14px] text-foreground tracking-wider">
                  {project.title}
                </span>
                <span className="text-[13px] md:text-[13px] tracking-wide font-normal text-muted-foreground">
                  {project.description}
                </span>
              </div>

              {/* Right: role and year (hidden on mobile) */}
              <div className="hidden md:flex flex-col items-end text-right min-w-[160px] gap-[2px]">
                <span className="text-xs uppercase text-muted-foreground tracking-wide font-mono">
                  {project.role}
                </span>
                <span className="text-muted-foreground/75 text-[14px] font-mono">
                  {project.year}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
