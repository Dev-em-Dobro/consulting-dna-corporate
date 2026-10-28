const elements = [
  "Liderança e exemplo",
  "Propósito, estratégia e desempenho",
  "Protagonismo e responsabilidade pelos resultados",
  "Franqueza radical",
  "Processos a manter, encerrar ou mudar",
  "Experiência dos colaboradores",
  "Equipes essenciais",
  "Diferenciação por desempenho",
  "Colaboração entre áreas",
  "Agilidade nas decisões e encaminhamento aos níveis responsáveis",
];

/** Keeps the approved diagram unchanged while making every label readable in PT-BR. */
export default function CultureEcosystemTranslation() {
  return (
    <div data-no-translate className="locale-pt-only mt-5 rounded-sm bg-white p-5 text-[#171b2d]">
      <p className="text-center font-serif text-lg font-semibold">Transformação cultural</p>
      <p className="mt-1 text-center text-xs">Pessoas · desempenho · possibilidades</p>
      <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs leading-snug">
        {elements.map((element, index) => (
          <li key={element}><span className="font-bold text-[#bf2e36]">{index + 1}. </span>{element}</li>
        ))}
      </ol>
    </div>
  );
}
