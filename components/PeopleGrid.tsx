"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import PersonModal, { Avatar, type Person } from "@/components/PersonModal";

/**
 * A grade de retratos que abre o perfil em pop-up.
 *
 * ⚠️ O MODAL SAIU DAQUI EM 15-09 e mora em `components/PersonModal.tsx`. Ele
 * era privado deste arquivo, e a /team passou a precisar do mesmo pop-up — o
 * `CDNA_04_Team.docx` pede "short bio on click or hover" para a grade de
 * liderança, e o botão "+" do mockup é esse gesto. Duas cópias do perfil de uma
 * pessoa divergem na primeira correção feita de um lado só.
 *
 * O QUE FICOU AQUI é só a grade: o cartão, o `hover` com "View profile" e o
 * estado de qual pessoa está aberta. O tipo `Person` e o `Avatar` vêm de lá,
 * porque os dois descrevem a MESMA pessoa — se o CMS ganhar um campo, ele
 * aparece nos dois lugares de uma vez.
 *
 * ⚠️ NÃO RODA MAIS NA HOME. Saiu em 14-09, a pedido da cliente ("I don’t want
 * to see the team faces on there at the start"). Continua na /home-v1, na
 * /home-v3 e na /services/leadership.
 */
export default function PeopleGrid({ people }: { people: Person[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (people.length === 0) return null;

  return (
    <>
      {/* Flex (not grid) so the trailing, incomplete row centers itself: 4 per
          row on desktop, and the remaining cards sit centered below. */}
      <div className="mb-16 flex flex-wrap items-start justify-center gap-6">
        {people.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="group block basis-[calc(50%-12px)] cursor-pointer text-left md:basis-[calc(25%-18px)]"
            aria-label={`View ${p.name}'s profile`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e9e6e3]">
              <Avatar person={p} sizes="(min-width: 768px) 280px, 50vw" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="px-4 pb-4 text-[12px] font-semibold uppercase tracking-[1.5px] text-white">
                  View profile →
                </span>
              </div>
              <div className="absolute bottom-0 left-0 h-[5px] w-9 bg-brand" />
            </div>
            {/* Fixed-height name/role block so cards align along the top and
                never "stair-step" when a role wraps to two lines (FR-407). */}
            <div className="mt-4 min-h-[60px]">
              <h3 className="mb-0.5 text-[17px] font-semibold text-ink transition-colors group-hover:text-brand">
                {p.name}
              </h3>
              <p className="text-[13.5px] leading-snug text-muted">{p.role}</p>
            </div>
          </button>
        ))}
      </div>

      {active !== null &&
        createPortal(
          <PersonModal person={people[active]} onClose={() => setActive(null)} />,
          document.body,
        )}
    </>
  );
}

