import Image from "next/image";
import SectionHead from "@/components/clients/SectionHead";
import { LOGO_RATIO, fitLogo, logoSrc, type LogoKey } from "@/components/clients/logo-fit";

/**
 * "WHAT OUR CLIENTS SAY"  -  ESTEIRA DE DEPOIMENTOS (01-10).
 *
 * Pedido: tirar as fotos, deixar só logo + citação, e fazer a faixa andar
 * sozinha. As três citações anteriores eram texto provisório ao lado de retratos
 * de banco de imagem; as de agora vêm da cliente:
 *   • `docs/meetings/quotes.txt`  -  Shell (ELT), Schroders, GSK ×2;
 *   • `docs/meetings/image-meeting-rhea/testimonials-clients.jpeg`  -  os sete
 *     cartões do slide "What Our Clients Say", transcritos LITERALMENTE (a
 *     gramática é a de quem falou; não corrigir sem ela pedir).
 * Nome e cargo só aparecem quando a fonte traz; nenhum foi deduzido.
 *
 * A ORDEM INTERCALA AS EMPRESAS para o mesmo logo nunca cair em dois cartões
 * vizinhos  -  inclusive na emenda do laço (último → primeiro).
 *
 * MOVIMENTO SÓ DE CSS, sem JS: duas cópias da fileira lado a lado e a trilha
 * desliza 50%, o mesmo truque do `LogoMarquee`. Para ao passar o mouse e ao
 * receber foco (a faixa é focável, então dá para parar pelo teclado e ler).
 *
 * ⚠️ AO CONTRÁRIO DO `LogoMarquee`, ESTA RESPEITA `prefers-reduced-motion`: lá
 * são logos decorativos; aqui é TEXTO para ler, e texto andando é exatamente o
 * que a preferência existe para evitar. Com ela ligada a trilha para, a cópia
 * duplicada some e a fileira vira rolagem horizontal com snap.
 */
type Voice = {
  logo: LogoKey;
  company: string;
  quote: string;
  name?: string;
  role?: string;
};

const voices: Voice[] = [
  {
    logo: "shell",
    company: "Shell",
    name: "Lynn Lee",
    role: "Global VP Diversity, Equity and Inclusion, Shell",
    quote:
      "My heartfelt congratulations to this amazing team for winning us a GOLD in leading our Women in Leadership Program globally. This transformational program has had and will continue to have a deep impact for our women. I am very grateful for this opportunity to work with all of you.",
  },
  {
    logo: "frasers-property",
    company: "Frasers Property",
    name: "Panote Sirivadhanabhakdi",
    role: "CEO, Frasers Property Limited",
    quote:
      "CDNA’s work at ELT, ELT-1-2 levels as our transformation partner has been exceptional. We continue to grow, adapt and develop over the last two years and I can see how we are becoming much more honest and much less fixed!",
  },
  {
    logo: "unilever",
    company: "Unilever",
    name: "Benjie Yap",
    role: "President Director, Unilever Indonesia",
    quote:
      "CDNA’s work with myself and my leadership team over 18 months at the time of the organisation’s changing compass and biggest structural change was deeply transformational.",
  },
  {
    logo: "gsk",
    company: "GSK",
    role: "Talent Forum Delegate",
    quote:
      "Of all the programs I’ve attended—including one at Harvard—this delivered the most impactful outcomes.",
  },
  {
    logo: "schroders",
    company: "Schroders",
    quote:
      "Your session gave us a valuable opportunity to reflect on the realities of today’s quickly evolving world and how we process them mentally, physically, and emotionally. Thank you for creating that space and giving us a chance to step away from our day-to-day routine for a bit of reflection.",
  },
  {
    logo: "adidas",
    company: "adidas",
    role: "VP SEA",
    quote:
      "The journey has given deep connection across the team and aligned us around a common goal and objective.",
  },
  {
    logo: "shell",
    company: "Shell",
    quote:
      "Thank you for your thoughtful note and for the incredible support you provided during our ELT session. Your ability to create a space for honest dialogue, vulnerability, and meaningful connection made a lasting impact on the team.",
  },
  {
    logo: "unilever",
    company: "Unilever",
    role: "Head of Consumer Insights",
    quote:
      "I couldn’t have got this promotion to Global Head without the support, provocation and refreshing honesty of my DNA coach!",
  },
  {
    logo: "gsk",
    company: "GSK",
    quote:
      "Both facilitators were energy bursts and exceptional. They clearly know their specialism and were engaging, energetic and enthralling to meet with and learn from.",
  },
  {
    logo: "shell",
    company: "Shell",
    role: "Pod Coaching Insights, Cohort 3",
    quote: "I’m now courageous to have bold conversations and challenge with respect.",
  },
  {
    logo: "gsk",
    company: "GSK",
    quote:
      "The facilitators were a calming presence throughout the course. I felt very comfortable being candid. They injected when they needed but also allowed conversation to flow. It felt like they adjusted their teaching for this particular cohort.",
  },
];

/* ~9s por cartão: a 380px de cartão dá uns 45px/s, devagar o bastante para
   ler a citação curta inteira antes de ela sair da tela. */
const DURATION_S = voices.length * 9;

const css = `
.cv-track { animation: cv-slide ${DURATION_S}s linear infinite; }
.cv-viewport:hover .cv-track,
.cv-viewport:focus-within .cv-track { animation-play-state: paused; }
@keyframes cv-slide { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .cv-track { animation: none; }
  .cv-viewport { overflow-x: auto; scroll-snap-type: x mandatory; mask-image: none !important; -webkit-mask-image: none !important; }
  .cv-card { scroll-snap-align: start; }
  .cv-dup { display: none; }
}
`;

const fade = "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)";

function VoiceCard({ v, hidden }: { v: Voice; hidden?: boolean }) {
  const { w, h } = fitLogo(LOGO_RATIO[v.logo], 2200, 132, 42);
  return (
    <figure
      aria-hidden={hidden || undefined}
      className={`cv-card mx-2.5 flex w-[300px] shrink-0 flex-col border border-line bg-white p-6 sm:w-[380px] sm:p-7 ${hidden ? "cv-dup" : ""}`}
    >
      <div className="flex h-11 items-center">
        <Image
          src={logoSrc(v.logo)}
          alt={hidden ? "" : v.company}
          width={600}
          height={Math.round(600 / LOGO_RATIO[v.logo])}
          sizes="132px"
          style={{ width: w, height: h }}
          className="object-contain"
        />
      </div>
      <blockquote className="mb-6 mt-5 font-serif text-[16px] leading-[1.55] text-ink sm:text-[17px]">
        “{v.quote}”
      </blockquote>
      {(v.name || v.role) && (
        <figcaption className="mt-auto border-t border-line pt-4">
          {v.name && <span className="block text-[14px] font-semibold text-ink">{v.name}</span>}
          {v.role && (
            <span className="mt-0.5 block text-[11.5px] font-semibold uppercase leading-[1.45] tracking-[0.8px] text-muted">
              {v.role}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

export default function ClientVoices() {
  return (
    <section id="voices" className="bg-white">
      <style>{css}</style>
      <div className="mx-auto max-w-[1440px] px-6 pt-16 md:px-10 md:pt-20">
        <SectionHead label="What our clients say" />
        <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
          Stronger leaders. Brighter futures.
        </h2>
      </div>
      {/* Largura total da janela, fora do contêiner de 1440px: a esteira entra e
          sai pelas bordas da tela em vez de ser cortada a 40px delas. */}
      <div
        className="cv-viewport mt-8 overflow-hidden pb-16 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand md:pb-20"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
        role="region"
        aria-label="Client testimonials (pauses on hover or focus)"
        tabIndex={0}
      >
        <div className="cv-track flex w-max items-stretch">
          {voices.map((v, i) => (
            <VoiceCard key={`a${i}`} v={v} />
          ))}
          {voices.map((v, i) => (
            <VoiceCard key={`b${i}`} v={v} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
