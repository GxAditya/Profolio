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
      className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#d8d3c9] bg-[#f6f3ec] text-[#1f1a15] shadow-[0_30px_80px_rgba(28,18,9,0.16)]"
      style={{ fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif' }}
    >
      <header className="border-b border-[#dad3c6] bg-[#f0ebe1] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <EditableText
              as="h1"
              className="text-4xl font-semibold tracking-[-0.04em] text-[#18120d] sm:text-5xl"
              value={profile.fullName}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("fullName", value)}
            />
            <EditableText
              className="mt-3 max-w-3xl text-base leading-relaxed text-[#3f372f]"
              value={profile.headline}
              editable={canEdit}
              onValueChange={(value) => updateField("headline", value)}
            />

            <div className="mt-6 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.14em] text-[#5f554b]">
              <span className="rounded-full border border-[#cec4b3] bg-[#f8f4ec] px-3 py-1">
                {profile.experience.length} project stories
              </span>
              <span className="rounded-full border border-[#cec4b3] bg-[#f8f4ec] px-3 py-1">
                {profile.skills.length} capabilities
              </span>
              <span className="rounded-full border border-[#cec4b3] bg-[#f8f4ec] px-3 py-1">
                {profile.education?.length ?? 0} education items
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d5cdbd] bg-[#f8f5ee] px-4 py-4 text-sm text-[#3d352d]">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#736759]">Contact</p>
            <EditableText
              className="mt-3 break-all"
              value={profile.email}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("email", value)}
            />
            <EditableText
              className="mt-1"
              value={profile.location ?? ""}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("location", value)}
            />
            {canEdit ? (
              <EditableText
                className="mt-2 break-all text-[#2a628a] underline decoration-[#2a628a]/35 underline-offset-4"
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
                  className="mt-2 inline-block break-all text-[#2a628a] underline decoration-[#2a628a]/35 underline-offset-4"
                >
                  {profile.linkedinUrl}
                </a>
              )
            )}
          </div>
        </div>
      </header>

      <main className="grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          {(profile.summary || canEdit) && (
            <section className="rounded-2xl border border-[#d9d2c5] bg-[#fbf9f4] p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#6f6253]">About</p>
              <EditableText
                className="mt-3 text-sm leading-relaxed text-[#3d362e] sm:text-base"
                value={profile.summary}
                editable={canEdit}
                onValueChange={(value) => updateField("summary", value)}
              />
            </section>
          )}

          {profile.experience.length > 0 && (
            <section className="rounded-2xl border border-[#d9d2c5] bg-[#fbf9f4] p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1d1712]">
                  Selected Work
                </h2>
                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#6f6253]">
                  Portfolio Cases
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {profile.experience.map((exp, index) => (
                  <article key={index} className="rounded-2xl border border-[#d9d2c5] bg-[#f2ece2] p-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#7a6b59]">
                      {`Project ${String(index + 1).padStart(2, "0")}`}
                    </p>

                    <EditableText
                      as="h3"
                      className="mt-2 text-lg font-semibold tracking-[-0.01em] text-[#1e1711]"
                      value={exp.title}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateExperienceField(index, "title", value)}
                    />

                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#5d5246] sm:text-sm">
                      <EditableText
                        as="span"
                        value={exp.company}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(index, "company", value)}
                      />
                      {(exp.location || canEdit) && (
                        <>
                          <span aria-hidden>·</span>
                          <EditableText
                            as="span"
                            value={exp.location ?? ""}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) => updateExperienceField(index, "location", value)}
                          />
                        </>
                      )}
                    </div>

                    {(exp.description || canEdit) && (
                      <EditableText
                        className="mt-3 text-sm leading-relaxed text-[#3f362d]"
                        value={exp.description}
                        editable={canEdit}
                        onValueChange={(value) =>
                          updateExperienceField(index, "description", value)
                        }
                      />
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <EditableText
                        className="text-[0.62rem] uppercase tracking-[0.18em] text-[#7a6b59]"
                        value={exp.duration}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(index, "duration", value)}
                      />
                      <span className="rounded-full border border-[#cabfae] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#6b5f51]">
                        Case Study
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          {profile.skills.length > 0 && (
            <section className="rounded-2xl border border-[#d9d2c5] bg-[#fbf9f4] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f6253]">
                Capabilities
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <EditableText
                    key={index}
                    as="span"
                    className="rounded-full border border-[#cec4b3] bg-[#f1ece3] px-3 py-1 text-[0.7rem] text-[#342d26]"
                    value={skill}
                    editable={canEdit}
                    multiline={false}
                    onValueChange={(value) => updateSkill(index, value)}
                  />
                ))}
              </div>
            </section>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <section className="rounded-2xl border border-[#d9d2c5] bg-[#fbf9f4] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f6253]">
                Credentials
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[#3d352d]">
                {profile.certifications.map((certification, index) => (
                  <li key={index} className="rounded-lg border border-[#d9d2c5] bg-[#f2ece2] px-3 py-2">
                    <EditableText
                      as="span"
                      value={certification}
                      editable={canEdit}
                      onValueChange={(value) => updateCertification(index, value)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.education && profile.education.length > 0 && (
            <section className="rounded-2xl border border-[#d9d2c5] bg-[#fbf9f4] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6f6253]">
                Education
              </h3>
              <div className="mt-3 space-y-3">
                {profile.education.map((entry, index) => (
                  <article key={index} className="rounded-lg border border-[#d9d2c5] bg-[#f2ece2] px-3 py-3">
                    <EditableText
                      className="text-sm font-semibold text-[#211a14]"
                      value={entry.institution}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateEducationField(index, "institution", value)}
                    />
                    <EditableText
                      className="mt-1 text-xs text-[#4d443a]"
                      value={entry.degree}
                      editable={canEdit}
                      onValueChange={(value) => updateEducationField(index, "degree", value)}
                    />
                    {(entry.duration || canEdit) && (
                      <EditableText
                        className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-[#6f6253]"
                        value={entry.duration}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateEducationField(index, "duration", value)}
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinimalTemplate;
