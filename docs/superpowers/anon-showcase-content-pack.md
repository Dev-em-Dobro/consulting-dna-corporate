# Anon Showcase — Pacote de Conteúdo Fake (semear no CMS local)

Cole estes itens no CMS local (Docker) que serve `/api/content`. Todos os textos
são fictícios e coerentes com a marca **Meridian Leadership Advisory** e o método
**The 5P Framework** (Perspective · People · Perception · Performance · Persistence).

Publique cada item em **inglês** (locale `en`) — é o locale que o site renderiza.
Só é preciso **1 de cada** para os screenshots das telas Home, Case e Solução/5P.

---

## 1) Case — `type: case`

- **slug:** `northwind-energy`
- **title:** `Aligning a new executive team at Northwind Energy`
- **summary:** `How Meridian helped a global energy group align its top team and accelerate its first-100-days agenda.`
- **tags:** `Executive alignment`, `Energy`, `EMEA`
- **introduction:** `A newly appointed CEO inherited a capable but fragmented top team, pulling in different directions on strategy, pace and priorities.`
- **challenge:** `The leadership team agreed on the destination but not the route. Decisions stalled in re-litigation, and the wider organisation received mixed signals about what mattered most.`
- **approach:** `Over ten weeks, Meridian ran a structured alignment programme built on the 5P Framework — surfacing each leader's perspective, rebuilding trust across the team, and converting shared intent into a small set of enterprise decisions with clear owners.`
- **outcome:** `The team left with a single, coherent leadership narrative, a decision-rights map, and a cadence that keeps alignment live rather than one-off.`
- **measurableResult:** `Decision cycle time reduced 34%; top-team alignment score up from 61 to 88.`
- **quote:** `Meridian gave us a common language for how we lead together — the difference in our first hundred days was night and day.`
- **quoter:** `Chief HR Officer, Northwind Energy`
- **facets:**
  - industry: `Energy`
  - service: `Executive team alignment`
  - region: `EMEA`
  - outcome: `Faster decisions`

> Se o CMS exigir uma imagem de capa (`coverUrl`/`coverMediaId`), use qualquer
> imagem neutra/abstrata — **não** um logo ou foto real. Pode reaproveitar
> `/5P-methodology.svg` ou um dos `/avatars/a*.svg` do site.

---

## 2) Solution — `type: solution`

- **slug:** `executive-team-alignment`
- **title:** `Executive Team Alignment`
- **summary / intro:** `We align senior teams behind strategy so decisions move faster and the organisation feels one coherent leadership voice.`
- **Os 5 passos (The 5P Framework):**
  1. **Perspective** — surface how each leader thinks, reasons and reads the situation.
  2. **People** — rebuild trust and the relationships the team runs on.
  3. **Perception** — sharpen the team's shared read of signals, risk and intuition.
  4. **Performance** — turn shared intent into concrete decisions and owners.
  5. **Persistence** — embed rituals and habits so alignment stays live.

> Se a solução tiver `proofRefs` (client-proof), pode adicionar 1 referência
> fictícia apontando para o case: quote curto, author `Chief HR Officer`,
> role `Northwind Energy`, caseSlug `northwind-energy`.

---

## 3) Pessoas — `type: person` (2–3 itens)

| name | role / jobTitle | bio (curta) |
|------|-----------------|-------------|
| `Elena Hart` | `Founder` | `Two decades advising CEOs and executive teams across four continents. Author of "The Leadership Code".` |
| `Marcus Reed` | `Managing Partner` | `Former group HR director turned advisor; leads Meridian's executive alignment practice.` |
| `Sofia Almeida` | `Principal` | `Behavioural scientist focused on how senior teams make decisions under pressure.` |

> **Avatares:** aponte cada pessoa para uma imagem neutra. Pode usar os
> `/avatars/a1.svg` … `/avatars/a6.svg` que já existem no site, ou qualquer
> silhueta genérica. **Nunca** fotos reais.

---

## 4) Home singleton — `page_home`

| campo | valor |
|-------|-------|
| `years` | `18` |
| `countries` | `36` |
| `faculty` | `75` |
| `sponsoredPct` | `90%` |

(Se o CMS estiver indisponível, o site já cai nesses mesmos valores por fallback —
mas semear garante que a Home renderize idêntico ao print pretendido.)

---

## Checklist antes de printar

- [ ] Case `northwind-energy` publicado (locale `en`).
- [ ] Solution `executive-team-alignment` publicada.
- [ ] 2–3 pessoas publicadas com avatar neutro.
- [ ] `page_home` com os 4 números.
- [ ] Nenhuma capa/foto/logo real usada em nenhum item.
