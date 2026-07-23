"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SocialType = "linkedin" | "x" | "instagram" | "email";
type Social = { type: SocialType; href: string };

export type Person = {
  name: string;
  role: string;
  img?: string;
  location?: string;
  bio: string[];
  bioHtml?: string;
  socials?: Social[];
  values?: string;
  strengths?: string;
  specialties?: string[];
  trackRecord?: string[];
  clients?: string;
  languages?: string;
  skills?: string[];
};

const SOCIAL_LABEL: Record<SocialType, string> = {
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
  email: "Email",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Person photo, with a branded initials fallback when the CMS has no image. */
function Avatar({ person, sizes }: { person: Person; sizes: string }) {
  if (person.img) {
    return (
      <Image
        src={person.img}
        alt={`${person.name} — ${person.role}`}
        fill
        sizes={sizes}
        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink/90 text-4xl font-bold tracking-tight text-white/90">
      {initials(person.name)}
    </div>
  );
}

function SocialIcon({ type }: { type: SocialType }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };
  switch (type) {
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95C20.6 8.69 22 10.4 22 13.6V21h-4v-6.56c0-1.56-.03-3.57-2.18-3.57-2.18 0-2.52 1.7-2.52 3.46V21H9V9Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-6.03l-4.72-6.17L5.6 21H2.63l6.94-7.93L2.25 3h6.18l4.27 5.64L17.53 3Zm-1.06 16.2h1.65L7.6 4.71H5.83L16.47 19.2Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
  }
}

function SocialLinks({ socials }: { socials: Social[] }) {
  return (
    <div className="mb-6 mt-4 flex items-center gap-3">
      {socials.map((s) => (
        <a
          key={s.type}
          href={s.href}
          aria-label={SOCIAL_LABEL[s.type]}
          target={s.type === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white transition-colors hover:bg-brand-dark"
        >
          <SocialIcon type={s.type} />
        </a>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-brand">
        {label}
      </div>
      {children}
    </div>
  );
}

function PersonModal({ person, onClose }: { person: Person; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={person.name}
    >
      <div
        className="relative my-auto w-full max-w-[880px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center bg-white/80 text-2xl leading-none text-ink transition-colors hover:bg-brand hover:text-white md:text-ink"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e9e6e3] md:aspect-auto">
            {person.img ? (
              <Image
                src={person.img}
                alt={person.name}
                fill
                sizes="300px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full min-h-[240px] w-full items-center justify-center bg-ink/90 text-5xl font-bold text-white/90">
                {initials(person.name)}
              </div>
            )}
            <div className="absolute bottom-0 left-0 h-[5px] w-12 bg-brand" />
          </div>

          <div className="max-h-[80vh] overflow-y-auto px-7 py-8 md:px-9 md:py-10">
            <h2 className="text-[26px] font-bold leading-tight tracking-[-0.5px] text-ink">
              {person.name}
            </h2>
            <p className="mt-1 text-[14px] font-semibold uppercase tracking-[1px] text-brand">
              {person.role}
            </p>

            {person.socials && person.socials.length > 0 && (
              <SocialLinks socials={person.socials} />
            )}

            {person.bioHtml ? (
              // First-party CMS rich text — rendered as HTML. Utility selectors
              // style the headings/lists/bold the CMS emits inside the bio.
              <div
                className="space-y-4 text-[15px] leading-relaxed text-muted [&_h3]:mb-1.5 [&_h3]:mt-6 [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[1.5px] [&_h3]:text-brand [&_p]:mb-3 [&_strong]:text-ink [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: person.bioHtml }}
              />
            ) : (
              <div className="space-y-4 text-[15px] leading-relaxed text-muted">
                {person.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-7">
              {person.specialties && (
                <Field label="Specialist areas">
                  <ul className="space-y-1.5">
                    {person.specialties.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}

              {person.trackRecord && (
                <Field label="Selected track record">
                  <ul className="space-y-1.5">
                    {person.trackRecord.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}

              {person.clients && (
                <Field label="Client experience">
                  <p className="text-[14.5px] leading-relaxed text-ink/80">
                    {person.clients}
                  </p>
                </Field>
              )}

              <div className="grid gap-7 sm:grid-cols-2">
                {person.values && (
                  <Field label="Values">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.values}
                    </p>
                  </Field>
                )}
                {person.strengths && (
                  <Field label="Strengths">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.strengths}
                    </p>
                  </Field>
                )}
                {person.languages && (
                  <Field label="Languages">
                    <p className="text-[14.5px] leading-relaxed text-ink/80">
                      {person.languages}
                    </p>
                  </Field>
                )}
              </div>

              {person.skills && (
                <Field label="Skills & credentials">
                  <ul className="space-y-1.5">
                    {person.skills.map((s, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-[14.5px] leading-snug text-ink/80 before:absolute before:left-0 before:top-[9px] before:h-1.5 before:w-1.5 before:bg-brand"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </Field>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PeopleGrid({ people }: { people: Person[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (people.length === 0) return null;

  return (
    <>
      <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-3">
        {people.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="group block cursor-pointer text-left"
            aria-label={`View ${p.name}'s profile`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e3]">
              <Avatar person={p} sizes="(min-width: 768px) 380px, 50vw" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="px-4 pb-4 text-[12px] font-semibold uppercase tracking-[1.5px] text-white">
                  View profile →
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-[5px] w-9 bg-brand" />
            </div>
            <h3 className="mb-0.5 mt-4 text-[17px] font-semibold text-ink transition-colors group-hover:text-brand">
              {p.name}
            </h3>
            <p className="text-[13.5px] leading-snug text-muted">{p.role}</p>
          </button>
        ))}
      </div>

      {active !== null && (
        <PersonModal person={people[active]} onClose={() => setActive(null)} />
      )}
    </>
  );
}
