import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
}

const MinimalTemplate = ({ profile }: Props) => (
  <div className="mx-auto max-w-2xl px-6 py-16 font-sans">
    <header className="mb-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        {profile.fullName}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{profile.headline}</p>
      {profile.email && (
        <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
      )}
    </header>

    {profile.summary && (
      <section className="mb-14">
        <p className="text-base leading-relaxed text-muted-foreground">
          {profile.summary}
        </p>
      </section>
    )}

    {profile.experience.length > 0 && (
      <section className="mb-14">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Experience
        </h2>
        <div className="space-y-8">
          {profile.experience.map((exp, i) => (
            <div key={i}>
              <h3 className="text-base font-semibold text-foreground">
                {exp.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {exp.company} · {exp.duration}
              </p>
              {exp.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {profile.skills.length > 0 && (
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <span
              key={i}
              className="rounded-full border border-border px-3 py-1 text-xs text-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    )}
  </div>
);

export default MinimalTemplate;
