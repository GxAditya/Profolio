import EditableText from "@/components/EditableText";
import { createProfileEditor } from "@/components/templates/profileEditUtils";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const MinimalTemplate = ({ profile, editable = false, onProfileChange }: Props) => {
  const {
    canEdit,
    updateField,
    updateExperienceField,
    updateSkill,
    updateCertification,
    updateEducationField,
  } = createProfileEditor(editable, onProfileChange);

  return (
    <div
      className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#d7cfbf] bg-[#f7f0e5] text-[#1f1a14] shadow-[0_25px_70px_rgba(20,16,12,0.28)]"
      style={{ fontFamily: '"Lora", "DM Serif Display", Georgia, serif' }}
    >
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-[#b58d52]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[-80px] h-72 w-72 rounded-full bg-[#2f665f]/15 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#d7cfbf] bg-[#ede2d0] px-6 py-8 lg:border-b-0 lg:border-r">
          <p
            className="text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
            style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
          >
            Portfolio Snapshot
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <EditableText
              className="break-all text-[#3d2f20]"
              value={profile.email}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("email", value)}
            />
            <EditableText
              className="text-[#584632]"
              value={profile.location ?? ""}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("location", value)}
            />
            {canEdit ? (
              <EditableText
                className="break-all text-[#815322] underline decoration-[#815322]/40 underline-offset-4"
                value={profile.linkedinUrl ?? ""}
                editable
                multiline={false}
                onValueChange={(value) => updateField("linkedinUrl", value)}
              />
            ) : (
              profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block break-all text-[#815322] underline decoration-[#815322]/40 underline-offset-4"
                >
                  {profile.linkedinUrl}
                </a>
              )
            )}
          </div>

          {profile.skills.length > 0 && (
            <div className="mt-10">
              <p
                className="mb-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                Toolkit
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <EditableText
                    key={i}
                    as="span"
                    className="rounded-full border border-[#cbbca8] bg-[#f8f3eb] px-3 py-1 text-[0.7rem] text-[#4e3e2b]"
                    style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
                    value={skill}
                    editable={canEdit}
                    multiline={false}
                    onValueChange={(value) => updateSkill(i, value)}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="px-6 py-8 sm:px-9">
          <header className="mb-9 border-b border-[#d7cfbf] pb-7">
            <EditableText
              as="h1"
              className="text-4xl leading-[0.95] text-[#21170f] sm:text-5xl"
              value={profile.fullName}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("fullName", value)}
            />
            <EditableText
              className="mt-4 max-w-2xl text-base text-[#4a3926] sm:text-lg"
              style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              value={profile.headline}
              editable={canEdit}
              onValueChange={(value) => updateField("headline", value)}
            />
          </header>

          {(profile.summary || canEdit) && (
            <section className="mb-10">
              <p
                className="mb-3 text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                Narrative
              </p>
              <EditableText
                className="max-w-3xl text-base leading-relaxed text-[#392a1b]"
                value={profile.summary}
                editable={canEdit}
                onValueChange={(value) => updateField("summary", value)}
              />
            </section>
          )}

          {profile.experience.length > 0 && (
            <section className="mb-10">
              <p
                className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                Selected Work
              </p>
              <div className="space-y-6">
                {profile.experience.map((exp, i) => (
                  <article key={i} className="rounded-2xl border border-[#d4c6b3] bg-[#f4ebde] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <EditableText
                        as="h3"
                        className="text-lg text-[#1f160e]"
                        value={exp.title}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(i, "title", value)}
                      />
                      <EditableText
                        className="text-[0.7rem] uppercase tracking-[0.18em] text-[#6a543b]"
                        style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
                        value={exp.duration}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(i, "duration", value)}
                      />
                    </div>
                    <div
                      className="mt-1 flex flex-wrap items-center gap-1 text-sm text-[#694f34]"
                      style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
                    >
                      <EditableText
                        as="span"
                        value={exp.company}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(i, "company", value)}
                      />
                      {(exp.location || canEdit) && (
                        <>
                          <span aria-hidden>·</span>
                          <EditableText
                            as="span"
                            value={exp.location ?? ""}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) => updateExperienceField(i, "location", value)}
                          />
                        </>
                      )}
                    </div>
                    {(exp.description || canEdit) && (
                      <EditableText
                        className="mt-3 text-sm leading-relaxed text-[#3c2d1d]"
                        value={exp.description}
                        editable={canEdit}
                        onValueChange={(value) => updateExperienceField(i, "description", value)}
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <section className="mb-10">
              <p
                className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                Certifications
              </p>
              <ul
                className="grid gap-2 text-sm text-[#453424] sm:grid-cols-2"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                {profile.certifications.map((certification, i) => (
                  <li key={i} className="rounded-xl border border-[#d4c6b3] bg-[#f5ece0] px-3 py-2">
                    <EditableText
                      as="span"
                      value={certification}
                      editable={canEdit}
                      onValueChange={(value) => updateCertification(i, value)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.education && profile.education.length > 0 && (
            <section>
              <p
                className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-[#7a6750]"
                style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
              >
                Academic Track
              </p>
              <div className="space-y-4">
                {profile.education.map((entry, i) => (
                  <article key={i} className="rounded-xl border border-[#d4c6b3] bg-[#f4ebde] p-4">
                    <EditableText
                      className="text-base text-[#24180f]"
                      value={entry.institution}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateEducationField(i, "institution", value)}
                    />
                    <EditableText
                      className="mt-1 text-sm text-[#503c28]"
                      style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
                      value={entry.degree}
                      editable={canEdit}
                      onValueChange={(value) => updateEducationField(i, "degree", value)}
                    />
                    {(entry.duration || canEdit) && (
                      <EditableText
                        className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-[#7a6750]"
                        style={{ fontFamily: '"Sora", "Manrope", sans-serif' }}
                        value={entry.duration}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateEducationField(i, "duration", value)}
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalTemplate;
