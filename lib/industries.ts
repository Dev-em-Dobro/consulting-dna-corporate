/**
 * Os setores da faixa "Industries we work in" da Clients & Impact.
 *
 * ⚠️ A LISTA É A DO MOCKUP DELA, e não uma leitura do conteúdo publicado.
 * A fala na daily de 16-09 foi explícita sobre este bloco — *"the industries we
 * work in (…) we've done energy, technology, pharma, financial services, family
 * business, just calling that out again, just literally it can be exactly like
 * this"* — e os oito nomes abaixo são os que estão desenhados na imagem 2 do
 * drive (`5. Clients& Impact/…01_34_00 PM.png`).
 *
 * POR QUE NÃO SAI DOS CASES. O caminho natural seria agrupar por
 * `facets.industry`, e ele está fechado por ora: os nove cases cadastrados em
 * 16-09 vieram com `industry` VAZIO (a planilha não tem essa coluna) e os seis
 * antigos usam o vocabulário da geração passada. Derivar hoje daria uma faixa
 * de um ou dois setores. Quando a classificação existir no CMS, esta lista vira
 * o rótulo e a contagem passa a ser calculada — o layout não muda.
 *
 * ⚠️ PRECISA DE APROVAÇÃO E DE FOTO. Os nomes vieram de uma imagem gerada por
 * IA, não de documento assinado, e o 27-08 exige sign-off do que vai ao ar. As
 * fotografias de fundo são dela: *"that's my job"*. Até chegarem, cada bloco cai
 * no campo de cor — o mesmo recurso dos cards de serviço.
 */
export type Industry = {
  /** Rótulo exibido; quebra em duas linhas no desenho dela. */
  name: string;
  /** Ícone de traço, desenhado em `IndustriesGrid`. */
  icon: "leaf" | "pharma" | "finance" | "consumer" | "retail" | "tech" | "industry" | "services";
  /** Foto de fundo quando ela mandar; sem ela, campo de cor. */
  image?: string;
};

export const industries: Industry[] = [
  { name: "Energy & Natural Resources", icon: "leaf" },
  { name: "Pharma & Healthcare", icon: "pharma" },
  { name: "Financial Services", icon: "finance" },
  { name: "Consumer Goods & Beverages", icon: "consumer" },
  { name: "Retail & Luxury", icon: "retail" },
  { name: "Technology & Digital", icon: "tech" },
  { name: "Industrial & Manufacturing", icon: "industry" },
  { name: "Professional Services", icon: "services" },
];
