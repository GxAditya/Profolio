import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const CreativeTemplate = ({ profile, editable = false, onProfileChange }: Props) => (
  <div
    className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#281b12] bg-[#f4b96f] text-[#1f140f] shadow-[0_30px_90px_rgba(34,20,10,0.35)]"
    style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,238,209,0.55),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(45,197,178,0.28),transparent_32%),radial-gradient(circle_at_70%_20%,rgba(243,99,73,0.25),transparent_35%)]" />

    <div className="relative">
      <header className="border-b border-[#3c2214]/30 px-6 pb-8 pt-9 sm:px-10">
        <p
          className="text-[0.7rem] uppercase tracking-[0.32em] text-[#5f3114]"
          style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
        >
          Live Portfolio Page
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1
              className="text-[clamp(2.6rem,8vw,5rem)] leading-[0.88] tracking-[-0.02em] text-[#24120c]"
              style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
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
              className="mt-3 max-w-2xl text-sm leading-relaxed text-[#402311] sm:text-base"
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
          <div className="rounded-2xl border border-[#4c2d1e]/35 bg-[#ffe8ca]/70 p-4 text-xs text-[#4a2b18]">
            {profile.email && <p>{profile.email}</p>}
            {profile.location && <p className="mt-1">{profile.location}</p>}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-semibold text-[#7a2e16] underline decoration-[#7a2e16]/40 underline-offset-4"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_1fr]">
        {profile.summary && (
          <section className="rounded-3xl border border-[#4e3020]/35 bg-[#ffe8c8]/78 p-6 lg:col-span-2">
            <p
              className="text-[0.72rem] uppercase tracking-[0.26em] text-[#6f3c1d]"
              style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
            >
              What I Build
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#472914] sm:text-base">
              {profile.summary}
            </p>
          </section>
        )}

        {profile.experience.length > 0 && (
          <section className="rounded-3xl border border-[#4e3020]/35 bg-[#ffe2bd]/80 p-6">
            <p
              className="text-[0.72rem] uppercase tracking-[0.26em] text-[#6f3c1d]"
              style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
            >
              Build Log
            </p>
            <div className="mt-4 space-y-4">
              {profile.experience.map((exp, i) => (
                <article key={i} className="rounded-2xl border border-[#5b351f]/30 bg-[#fff1dc] p-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#25130b]">
                    {exp.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#6a3b1f]">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""} · {exp.duration}
                  </p>
                  {exp.description && (
                    <p className="mt-3 text-xs leading-relaxed text-[#4e2c17] sm:text-sm">
                      {exp.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-6">
          {profile.skills.length > 0 && (
            <section className="rounded-3xl border border-[#4e3020]/35 bg-[#d5f3ee]/78 p-6">
              <p
                className="text-[0.72rem] uppercase tracking-[0.26em] text-[#0a5f53]"
                style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
              >
                Stack Signals
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-[#167b6f]/25 bg-[#e8fbf8] px-3 py-1 text-[0.68rem] font-semibold text-[#0e675c]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <section className="rounded-3xl border border-[#4e3020]/35 bg-[#ffd4bc]/78 p-6">
              <p
                className="text-[0.72rem] uppercase tracking-[0.26em] text-[#8a3012]"
                style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
              >
                Credentials
              </p>
              <ul className="mt-3 space-y-2 text-xs text-[#5f2812] sm:text-sm">
                {profile.certifications.map((certification, i) => (
                  <li key={i} className="rounded-xl border border-[#8d3a16]/20 bg-[#ffe6d8] px-3 py-2">
                    {certification}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.education && profile.education.length > 0 && (
            <section className="rounded-3xl border border-[#4e3020]/35 bg-[#efe7ff]/78 p-6">
              <p
                className="text-[0.72rem] uppercase tracking-[0.26em] text-[#4a2e96]"
                style={{ fontFamily: '"Bebas Neue", "Sora", sans-serif' }}
              >
                Academic Roots
              </p>
              <div className="mt-3 space-y-3">
                {profile.education.map((entry, i) => (
                  <article key={i} className="rounded-xl border border-[#4f3598]/20 bg-[#f7f3ff] px-3 py-3">
                    <p className="text-sm font-semibold text-[#28185f]">{entry.institution}</p>
                    <p className="mt-1 text-xs text-[#4f3c84]">{entry.degree}</p>
                    {entry.duration && (
                      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-[#6c58a3]">
                        {entry.duration}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  </div>
);

export default CreativeTemplate;
