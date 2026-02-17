import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
}

const CreativeTemplate = ({ profile }: Props) => (
  <div className="min-h-[600px] rounded-xl bg-gradient-to-br from-[hsl(280,60%,92%)] via-[hsl(220,60%,92%)] to-[hsl(180,50%,90%)] px-6 py-16">
    <div className="mx-auto max-w-3xl">
      <header className="mb-14 text-center">
        <h1 className="font-serif text-5xl font-bold text-foreground">
          {profile.fullName}
        </h1>
        <p className="mt-3 font-serif text-lg italic text-muted-foreground">
          {profile.headline}
        </p>
        {profile.email && (
          <p className="mt-2 text-sm text-muted-foreground">{profile.email}</p>
        )}
      </header>

      {profile.summary && (
        <section className="mb-12 rounded-2xl bg-background/60 p-8 shadow-sm backdrop-blur-sm">
          <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
            About
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {profile.summary}
          </p>
        </section>
      )}

      {profile.experience.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-center font-serif text-lg font-semibold text-foreground">
            Experience
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.experience.map((exp, i) => (
              <div
                key={i}
                className="rounded-2xl bg-background/60 p-6 shadow-sm backdrop-blur-sm"
              >
                <h3 className="font-serif text-base font-semibold text-foreground">
                  {exp.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {exp.company} · {exp.duration}
                </p>
                {exp.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="text-center">
          <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="rounded-full bg-background/70 px-4 py-1.5 text-xs font-medium text-foreground shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);

export default CreativeTemplate;
