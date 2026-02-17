import EditableText from "@/components/EditableText";
import { createProfileEditor } from "@/components/templates/profileEditUtils";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const projectSurfaces = [
  "border-[#6d3a22]/30 bg-[#ffe5c2]",
  "border-[#0f675e]/32 bg-[#d7f6f0]",
  "border-[#27457a]/28 bg-[#dde9ff]",
  "border-[#8f3518]/28 bg-[#ffd7c2]",
] as const;

const CreativeTemplate = ({ profile, editable = false, onProfileChange }: Props) => {
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
      className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-[#5a2e19] bg-[#f6b164] text-[#24140d] shadow-[0_30px_90px_rgba(42,20,9,0.34)]"
      style={{ fontFamily: '"Bricolage Grotesque", "Segoe UI", sans-serif' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,246,228,0.62),transparent_36%),radial-gradient(circle_at_90%_22%,rgba(12,95,88,0.24),transparent_36%),radial-gradient(circle_at_84%_86%,rgba(182,52,23,0.2),transparent_34%)]" />

      <header className="relative border-b border-[#5a2e19]/35 px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <EditableText
              as="h1"
              className="text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[0.84] tracking-[-0.04em] text-[#28150d]"
              value={profile.fullName}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("fullName", value)}
            />
            <EditableText
              className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4a2917] sm:text-base"
              value={profile.headline}
              editable={canEdit}
              onValueChange={(value) => updateField("headline", value)}
            />

            <div className="mt-6 flex flex-wrap gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-[#6d351a]">
              <span className="rounded-full border border-[#6a3921]/35 bg-[#ffe3bd]/75 px-3 py-1">
                {profile.experience.length} projects
              </span>
              <span className="rounded-full border border-[#6a3921]/35 bg-[#ffe3bd]/75 px-3 py-1">
                {profile.skills.length} skills
              </span>
              <span className="rounded-full border border-[#6a3921]/35 bg-[#ffe3bd]/75 px-3 py-1">
                {profile.certifications?.length ?? 0} credentials
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#6a3a23]/35 bg-[#ffe7c7]/72 px-4 py-4 text-xs text-[#4f2b17]">
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#6d351a]">Contact</p>
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
                className="mt-2 break-all font-semibold text-[#7a2410] underline decoration-[#7a2410]/35 underline-offset-4"
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
                  className="mt-2 inline-block break-all font-semibold text-[#7a2410] underline decoration-[#7a2410]/35 underline-offset-4"
                >
                  {profile.linkedinUrl}
                </a>
              )
            )}
          </div>
        </div>
      </header>

      <main className="relative grid gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-5">
          {(profile.summary || canEdit) && (
            <section className="rounded-3xl border border-[#6b3b24]/35 bg-[#ffe5c0]/78 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#70361a]">About</h2>
              <EditableText
                className="mt-2 text-sm leading-relaxed text-[#4c2917] sm:text-base"
                value={profile.summary}
                editable={canEdit}
                onValueChange={(value) => updateField("summary", value)}
              />
            </section>
          )}

          {profile.experience.length > 0 && (
            <section className="rounded-3xl border border-[#6b3b24]/35 bg-[#ffe0b6]/80 p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#2b160d]">
                  Featured Projects
                </h2>
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#6d351a]">Portfolio Grid</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {profile.experience.map((exp, index) => (
                  <article
                    key={index}
                    className={`rounded-2xl border p-4 ${projectSurfaces[index % projectSurfaces.length]}`}
                  >
                    <p className="text-[0.62rem] uppercase tracking-[0.17em] text-[#6b3920]">
                      {`Project ${String(index + 1).padStart(2, "0")}`}
                    </p>
                    <EditableText
                      as="h3"
                      className="mt-2 text-base font-bold uppercase tracking-[0.08em] text-[#2b160d]"
                      value={exp.title}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateExperienceField(index, "title", value)}
                    />

                    <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#5d3119]">
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
                        className="mt-3 text-xs leading-relaxed text-[#4f2b17] sm:text-sm"
                        value={exp.description}
                        editable={canEdit}
                        onValueChange={(value) =>
                          updateExperienceField(index, "description", value)
                        }
                      />
                    )}

                    <EditableText
                      className="mt-3 text-[0.62rem] uppercase tracking-[0.16em] text-[#6d351a]"
                      value={exp.duration}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateExperienceField(index, "duration", value)}
                    />
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          {profile.skills.length > 0 && (
            <section className="rounded-3xl border border-[#0f655d]/35 bg-[#d9f7f1]/84 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0e5b53]">Skills</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <EditableText
                    key={index}
                    as="span"
                    className="rounded-full border border-[#168379]/22 bg-[#ecfffb] px-3 py-1 text-[0.68rem] font-semibold text-[#0d665d]"
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
            <section className="rounded-3xl border border-[#8f3416]/30 bg-[#ffd5bf]/84 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a3012]">Credentials</h3>
              <ul className="mt-3 space-y-2 text-xs text-[#5f2610] sm:text-sm">
                {profile.certifications.map((certification, index) => (
                  <li key={index} className="rounded-xl border border-[#8d3a16]/20 bg-[#ffe9dc] px-3 py-2">
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
            <section className="rounded-3xl border border-[#2d456f]/30 bg-[#dce8ff]/84 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2d456f]">Education</h3>
              <div className="mt-3 space-y-3">
                {profile.education.map((entry, index) => (
                  <article
                    key={index}
                    className="rounded-xl border border-[#3a5688]/20 bg-[#eef3ff] px-3 py-3"
                  >
                    <EditableText
                      className="text-sm font-semibold text-[#1f2f52]"
                      value={entry.institution}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) => updateEducationField(index, "institution", value)}
                    />
                    <EditableText
                      className="mt-1 text-xs text-[#3f5480]"
                      value={entry.degree}
                      editable={canEdit}
                      onValueChange={(value) => updateEducationField(index, "degree", value)}
                    />
                    {(entry.duration || canEdit) && (
                      <EditableText
                        className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-[#5d6f9a]"
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

export default CreativeTemplate;
