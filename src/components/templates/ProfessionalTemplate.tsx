import EditableText from "@/components/EditableText";
import { createProfileEditor } from "@/components/templates/profileEditUtils";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const ProfessionalTemplate = ({ profile, editable = false, onProfileChange }: Props) => {
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
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#21354d] bg-[#08111d] text-[#e6edf7] shadow-[0_34px_90px_rgba(2,7,15,0.72)]"
      style={{ fontFamily: '"Bricolage Grotesque", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(72,183,162,0.22),transparent_34%),radial-gradient(circle_at_86%_15%,rgba(212,96,58,0.18),transparent_36%),radial-gradient(circle_at_82%_88%,rgba(47,95,159,0.2),transparent_36%)]" />

      <header className="relative border-b border-[#1b2d43] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <EditableText
              as="h1"
              className="text-4xl font-semibold tracking-[-0.04em] text-[#f4f8ff] sm:text-5xl"
              value={profile.fullName}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("fullName", value)}
            />
            <EditableText
              className="mt-3 max-w-3xl text-sm leading-relaxed text-[#bfd0e3] sm:text-base"
              value={profile.headline}
              editable={canEdit}
              onValueChange={(value) => updateField("headline", value)}
            />

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-[#2a4664] bg-[#112338] px-3 py-2">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-[#8faac4]">Projects</p>
                <p className="mt-1 text-sm font-semibold text-[#f1f6ff]">{profile.experience.length}</p>
              </div>
              <div className="rounded-xl border border-[#2a4664] bg-[#112338] px-3 py-2">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-[#8faac4]">Skills</p>
                <p className="mt-1 text-sm font-semibold text-[#f1f6ff]">{profile.skills.length}</p>
              </div>
              <div className="rounded-xl border border-[#2a4664] bg-[#112338] px-3 py-2">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-[#8faac4]">Credentials</p>
                <p className="mt-1 text-sm font-semibold text-[#f1f6ff]">{profile.certifications?.length ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#27415c] bg-[#0f1f32] px-4 py-4 text-sm text-[#b4c8dd]">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#8ca9c6]">Contact</p>
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
                className="mt-2 break-all text-[#90f0e2] underline decoration-[#90f0e2]/30 underline-offset-4"
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
                  className="mt-2 inline-block break-all text-[#90f0e2] underline decoration-[#90f0e2]/30 underline-offset-4"
                >
                  {profile.linkedinUrl}
                </a>
              )
            )}
          </div>
        </div>
      </header>

      <main className="relative grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.32fr_0.68fr]">
        <div className="space-y-6">
          {(profile.summary || canEdit) && (
            <section className="rounded-2xl border border-[#22384f] bg-[#0f1d30] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#85a3c0]">About</h2>
              <EditableText
                className="mt-3 text-sm leading-relaxed text-[#d4e0ee]"
                value={profile.summary}
                editable={canEdit}
                onValueChange={(value) => updateField("summary", value)}
              />
            </section>
          )}

          {profile.experience.length > 0 && (
            <section className="rounded-2xl border border-[#22384f] bg-[#0c1727] p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#f2f7ff]">
                  Featured Case Studies
                </h2>
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#85a3c0]">Portfolio</p>
              </div>

              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <article
                    key={index}
                    className="rounded-2xl border border-[#294562] bg-[#102034] p-5 transition-colors hover:border-[#3cc2ae]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.17em] text-[#92adc7]">
                          {`Case ${String(index + 1).padStart(2, "0")}`}
                        </p>
                        <EditableText
                          as="h3"
                          className="mt-2 text-lg font-semibold tracking-[-0.01em] text-[#f4f9ff]"
                          value={exp.title}
                          editable={canEdit}
                          multiline={false}
                          onValueChange={(value) => updateExperienceField(index, "title", value)}
                        />
                      </div>

                      <EditableText
                        as="span"
                        className="rounded-full bg-[#143a4d] px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#9eecdf]"
                        value={exp.duration}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateExperienceField(index, "duration", value)}
                      />
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#afc3d8] sm:text-sm">
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
                        className="mt-3 text-sm leading-relaxed text-[#d2deec]"
                        value={exp.description}
                        editable={canEdit}
                        onValueChange={(value) =>
                          updateExperienceField(index, "description", value)
                        }
                      />
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          {profile.skills.length > 0 && (
            <section className="rounded-2xl border border-[#22384f] bg-[#0f1d30] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#85a3c0]">Capabilities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <EditableText
                    key={index}
                    as="span"
                    className="rounded-full border border-[#2a4f72] bg-[#13324d] px-3 py-1 text-[0.68rem] text-[#c9e7ff]"
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
            <section className="rounded-2xl border border-[#22384f] bg-[#0f1d30] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#85a3c0]">Proof</h3>
              <ul className="mt-3 space-y-2 text-xs text-[#d0deeb] sm:text-sm">
                {profile.certifications.map((certification, index) => (
                  <li key={index} className="rounded-lg border border-[#294562] bg-[#102034] px-3 py-2">
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
            <section className="rounded-2xl border border-[#22384f] bg-[#0f1d30] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#85a3c0]">Education</h3>
              <div className="mt-3 space-y-3">
                {profile.education.map((entry, index) => (
                  <article
                    key={index}
                    className="rounded-lg border border-[#294562] bg-[#102034] px-3 py-3"
                  >
                    <EditableText
                      className="text-sm font-semibold text-[#f3f8ff]"
                      value={entry.institution}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateEducationField(index, "institution", value)}
                    />
                    <EditableText
                      className="mt-1 text-xs text-[#bdd0e3]"
                      value={entry.degree}
                      editable={canEdit}
                      onValueChange={(value) => updateEducationField(index, "degree", value)}
                    />
                    {(entry.duration || canEdit) && (
                      <EditableText
                        className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-[#8ea9c4]"
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

export default ProfessionalTemplate;
