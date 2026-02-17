import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const ProfessionalTemplate = ({ profile, editable = false, onProfileChange }: Props) => (
  <div
    className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#1f2734] bg-[#070d17] text-[#e8edf5] shadow-[0_28px_90px_rgba(3,7,14,0.85)]"
    style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(29,177,167,0.20),transparent_36%),radial-gradient(circle_at_10%_90%,rgba(255,129,82,0.18),transparent_34%)]" />

    <header className="relative border-b border-[#1b2a3c] px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Product Portfolio</p>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <h1
            className="text-4xl font-semibold tracking-[-0.03em] text-[#f6f9ff] sm:text-5xl"
            contentEditable={editable}
            suppressContentEditableWarning
            onInput={(event) => {
              if (!editable || !onProfileChange) return;
              const text = event.currentTarget.textContent ?? "";
              onProfileChange((prev) => ({ ...prev, fullName: text }));
            }}
          >
            {profile.fullName}
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed text-[#b9c8d9] sm:text-base"
            contentEditable={editable}
            suppressContentEditableWarning
            onInput={(event) => {
              if (!editable || !onProfileChange) return;
              const text = event.currentTarget.textContent ?? "";
              onProfileChange((prev) => ({ ...prev, headline: text }));
            }}
          >
            {profile.headline}
          </p>
        </div>
        <div className="rounded-2xl border border-[#223449] bg-[#0e1724] px-4 py-3 text-xs text-[#9cb7d0]">
          <p>{profile.email || "No email shared"}</p>
          {profile.location && <p className="mt-1">{profile.location}</p>}
          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[#6ae7d6] underline decoration-[#6ae7d6]/30 underline-offset-4"
            >
              Open LinkedIn
            </a>
          )}
        </div>
      </div>
    </header>

    <div className="relative grid grid-cols-1 gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-7">
        {profile.summary && (
          <section className="rounded-2xl border border-[#1d2b3b] bg-[#0f1724] p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Studio Note</p>
            <p className="mt-3 text-sm leading-relaxed text-[#d7e4f3] sm:text-[0.95rem]">
              {profile.summary}
            </p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section className="rounded-2xl border border-[#1d2b3b] bg-[#0b131f] p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Case Highlights</p>
            <div className="mt-4 space-y-4">
              {profile.experience.map((exp, i) => (
                <article
                  key={i}
                  className="rounded-xl border border-[#223449] bg-[#101d2c] p-4 transition-colors hover:border-[#2fa99f]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#eef4ff] sm:text-base">{exp.title}</h3>
                    <span className="rounded-full bg-[#123544] px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-[#8ce7db]">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#9fb5ca] sm:text-sm">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <p className="mt-3 text-xs leading-relaxed text-[#d3deea] sm:text-sm">
                      {exp.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="space-y-6">
        {profile.skills.length > 0 && (
          <section className="rounded-2xl border border-[#1d2b3b] bg-[#0f1724] p-5">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Capabilities</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#27506b] bg-[#123040] px-3 py-1 text-[0.68rem] text-[#cbe6ff]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.certifications && profile.certifications.length > 0 && (
          <section className="rounded-2xl border border-[#1d2b3b] bg-[#0f1724] p-5">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Credentials</p>
            <ul className="mt-3 space-y-2 text-xs text-[#d3deea] sm:text-sm">
              {profile.certifications.map((certification, i) => (
                <li key={i} className="rounded-lg border border-[#213246] bg-[#0d1c2b] px-3 py-2">
                  {certification}
                </li>
              ))}
            </ul>
          </section>
        )}

        {profile.education && profile.education.length > 0 && (
          <section className="rounded-2xl border border-[#1d2b3b] bg-[#0f1724] p-5">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#86a7c8]">Learning Path</p>
            <div className="mt-3 space-y-3">
              {profile.education.map((entry, i) => (
                <article key={i} className="rounded-lg border border-[#213246] bg-[#0d1c2b] px-3 py-3">
                  <p className="text-sm font-semibold text-[#f1f6ff]">{entry.institution}</p>
                  <p className="mt-1 text-xs text-[#b8cde2]">{entry.degree}</p>
                  {entry.duration && (
                    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-[#8ba7c0]">
                      {entry.duration}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

export default ProfessionalTemplate;
