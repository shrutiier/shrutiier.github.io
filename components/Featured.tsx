export default function Featured() {
  const projects = [
    {
      title: "Addressing Challenges in AADS",
      tags: ["Design"],
      year: 2025,
    },
    {
      title: "Revamping HFR&D's Digital Presence",
      tags: ["Design"],
      year: 2025,
    },
    {
      title: "Accessible Web Design for NICMAR Online",
      tags: ["Design"],
      year: 2025,
    },
    {
      title: "Tymli Health",
      tags: ["Design"],
      year: 2025,
    },
    {
      title: "Agentic AI for Workflow Automation",
      tags: ["Design"],
      year: 2025,
    },
    {
      title: "Omnichannel Strategy for a Hospital",
      tags: ["Design"],
      year: 2025,
    },
  ];

  return (
    <section className="py-16 w-full">
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="flex items-center justify-between pb-2">
            <p className="text-foreground font-normal text-sm">{project.title}</p>

            {/* Right side - Tags + Year */}
            <div className="flex items-center space-x-3">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-muted-foreground text-sm font-light rounded-lg px-[-2px]"
                >
                  {tag}
                </span>
              ))}
              <span className="text-sm text-muted-foreground">~</span>
              <span className="text-sm text-muted-foreground font-light">
                {project.year}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
