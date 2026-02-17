import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
}

const ProfessionalTemplate = ({ profile }: Props) => (
  <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-border shadow-sm">
    {/* Navy header */}
    <header className="bg-[hsl(220,60%,22%)] px-10 py-10 text-white">
      <h1 className="text-3xl font-bold tracking-tight">{profile.fullName}</h1>
      <p className="mt-1 text-base text-white/80">{profile.headline}</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-border bg-card px-8 py-8">
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Contact
          </h2>
          <p className="text-sm text-foreground">{profile.email || "—"}</p>
        </div>

        {profile.skills.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Skills
            </h2>
            <ul className="space-y-1.5">
              {profile.skills.map((skill, i) => (
                <li key={i} className="text-sm text-foreground">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="px-10 py-8">
        {profile.summary && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Summary
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile.summary}
            </p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Experience
            </h2>
            <div className="space-y-6">
              {profile.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-[hsl(220,60%,22%)] pl-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {exp.company} · {exp.duration}
                  </p>
                  {exp.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  </div>
);

export default ProfessionalTemplate;
