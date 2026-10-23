"""Apply editorial fixes to the visible-copy PT-BR catalogue.

The initial catalogue was assembled from every rendered route. Keep these
overrides explicit so names, product vocabulary and culturally awkward literal
translations are easy to review and maintain.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOGUE = ROOT / "messages" / "pt-BR-visible.json"
data = json.loads(CATALOGUE.read_text(encoding="utf-8"))

names = set(re.findall(r'\bname:\s*"([A-Z][^\"]+)"', (ROOT / "lib" / "team.ts").read_text(encoding="utf-8")))
names.update({"Peter", "Sarah", "Nitin", "Phil Paul", "Paul Polman", "Sharon Lim", "Maliha Bathool", "Tom Cross", "Daniela Rusu", "Michele Perry", "Justin Bridge", "Rachel Monteverdi", "Catherine", "CorporateDNA", "CorporateDNA Consulting", "Frasers Property", "DP World", "Dyson", "Shell", "GSK", "HSBC", "Unilever", "Aston Martin", "Dubai Holding", "Notion Press", "One Frasers", "Morgan Stanley", "Talentnet", "Kedaara", "TERRAGRN", "Harvard Business Impact", "Imperial College London", "Explore Performance", "Brandon Hall", "Collins Aerospace", "Bank of England"})
names.difference_update({"Asia", "Americas", "UK", "UKEE"})

# Recover personal and organisation names wherever the translator altered them.
for source in sorted(names, key=len, reverse=True):
    translated_name = data.get(source)
    if not translated_name or translated_name == source:
        continue
    for key, value in data.items():
        if source in key and translated_name in value:
            data[key] = value.replace(translated_name, source)
    if source in data:
        data[source] = source

for key, value in list(data.items()):
    # The company name and 5H framework terminology are product names.
    if "CorporateDNA" in key or "Corporate DNA" in key or "CDNA" in key:
        for wrong in ("DNA Corporativo Consultoria", "Consultoria CorporativaDNA", "DNA Corporativo", "ADN Corporativo", "ADN"):
            value = value.replace(wrong, "CorporateDNA")
        value = value.replace("CorporateDNA Consultoria", "CorporateDNA Consulting")
    if "faculty" in key.lower():
        value = re.sub(r"corpo docente", "rede de especialistas", value, flags=re.I)
        value = value.replace("um rede de especialistas", "uma rede de especialistas")
        value = value.replace("o rede de especialistas", "a rede de especialistas")
        value = value.replace("ao rede de especialistas", "à rede de especialistas")
        value = value.replace("nosso rede de especialistas", "nossa rede de especialistas")
    if "coaching" in key.lower() or "coach" in key.lower():
        value = re.sub(r"\btreinamento\b", "coaching", value, flags=re.I)
        value = re.sub(r"\btreinados\b", "orientados por coaching", value, flags=re.I)
    if "DP World" in key:
        value = value.replace("Mundo DP", "DP World")
    if "Frasers Property" in key:
        value = value.replace("Propriedade Frasers", "Frasers Property").replace("propriedade Frasers", "Frasers Property")
    value = value.replace("Médio Oriente", "Oriente Médio").replace("médio oriente", "Oriente Médio")
    value = value.replace("connosco", "conosco").replace("económicas", "econômicas").replace("económico", "econômico").replace("Cingapura", "Singapura")
    value = re.sub(r"\bequipas\b", "equipes", value, flags=re.I)
    value = re.sub(r"\bequipa\b", "equipe", value, flags=re.I)
    value = re.sub(r"\bsénior\b", "sênior", value, flags=re.I)
    value = re.sub(r"\bcolectiv([ao]s?)\b", r"coletiv\1", value, flags=re.I)
    if "Asia" in key:
        value = re.sub(r"\bAsia\b", "Ásia", value)
    if "Americas" in key:
        value = re.sub(r"\bAmericas\b", "Américas", value)
    data[key] = value

overrides = {
    "Home": "Início",
    "Data": "Data",
    "Insights": "Insights",
    "Singapore": "Singapura",
    "Our clients trust us to": "Nossos clientes confiam em nós para",
    "Keep leadership real": "manter uma liderança de verdade",
    "Leadership Judgement": "Discernimento na liderança",
    "When technology changes fast, culture has to move with it": "Quando a tecnologia muda rapidamente, a cultura precisa acompanhar essa evolução",
    "When technology changes fast, culture has to move with it.": "Quando a tecnologia muda rapidamente, a cultura precisa acompanhar essa evolução.",
    "Content for": "Conteúdo sobre",
    "is coming soon.": "em breve.",
    "Leadership change, measured where it matters.": "A transformação da liderança, medida onde mais importa.",
    "Insights | CorporateDNA": "Insights | CorporateDNA",
    "The neuroscience-led framework behind our results across 36 countries.": "A estrutura baseada em neurociência que orienta nossos resultados em 36 países.",
    "About the event": "Sobre o evento",
    "All events": "Todos os eventos",
    "Who wins when AI and your gut disagree?": "O que fazer quando a IA e a sua intuição discordam?",
    "What is your judgement default, and what might you be missing?": "Como você costuma formar seu julgamento e o que pode estar deixando passar?",
    "Why might disagreement produce better judgement than agreement?": "Por que a divergência pode levar a decisões melhores do que o consenso?",
    "Event details": "Detalhes do evento",
    "Speaker event": "Palestra",
    "Speaker event, 23 September 2026": "Palestra, 23 de setembro de 2026",
    "Economic Times Conference": "Conferência Economic Times",
    "CHRO Nexus Forum": "CHRO Nexus Forum",
    "Executive Series Singapore": "Série Executiva em Singapura",
    "Executive Series Singapore | Events | CorporateDNA": "Série Executiva em Singapura | Eventos | CorporateDNA",
    "Marcus Evans Talent 4.0 Conference": "Conferência Talent 4.0 da Marcus Evans",
    "HR Tech Conference": "Conferência HR Tech",
    "HR Tech Conference in Singapore": "Conferência HR Tech em Singapura",
    "Who we build capability with": "Parcerias que ampliam nossa atuação",
    "The complete client interviews.": "Entrevistas completas com clientes.",
    "Where we bring leaders together to shape": "Onde reunimos líderes para moldar a",
    "Event information": "Informações do evento",
    "Event photos": "Fotos do evento",
    "In the conversation": "Na conversa",
    "Insights paper": "Artigo de Insights",
    "Read the note": "Leia a publicação",
    "The full programme and further details will be announced here.": "A programação completa e outros detalhes serão divulgados aqui.",
    "Upcoming event": "Próximo evento",
    "CHRO Nexus Forum | Events | CorporateDNA": "CHRO Nexus Forum | Eventos | CorporateDNA",
    "Economic Times Conference | Events | CorporateDNA": "Conferência Economic Times | Eventos | CorporateDNA",
    "Executive Series Singapore | Events | CorporateDNA": "Série Executiva Singapura | Eventos | CorporateDNA",
    "Executive Series | Events | CorporateDNA": "Série Executiva | Eventos | CorporateDNA",
    "HR Tech Conference | Events | CorporateDNA": "Conferência HR Tech | Eventos | CorporateDNA",
    "Marcus Evans Talent 4.0 Conference | Events | CorporateDNA": "Conferência Talent 4.0 da Marcus Evans | Eventos | CorporateDNA",
    "Speaker event | Events | CorporateDNA": "Palestra | Eventos | CorporateDNA",
    "Mike presenting at the CLO100 event": "Mike apresentando no evento CLO100",
    "Participants attending Mike's CLO100 session": "Participantes da sessão de Mike no CLO100",
    "The keynote explored how courage is HR's new leadership currency, how ownership rebuilds trust, and how accountability anchors leadership impact.": "A palestra abordou como a coragem se tornou essencial à liderança de RH, como o senso de responsabilidade reconstrói a confiança e como a prestação de contas sustenta o impacto da liderança.",
    "The session explored how HR has transitioned from efficiency with systems, to efficiency with people, and efficiency with meaning.": "A sessão explorou a evolução do RH: da eficiência dos sistemas à eficiência centrada nas pessoas e, agora, à eficiência com propósito.",
    "Together, we explored three questions that are becoming increasingly important for leadership teams.": "Juntos, exploramos três perguntas cada vez mais importantes para as equipes de liderança.",
    "What stood out was that the most valuable conversations did not come from immediate agreement. They came from challenge, different perspectives and working through disagreement together.": "As conversas mais valiosas não nasceram de um acordo imediato. Vieram do questionamento, de perspectivas diferentes e da disposição de trabalhar juntos apesar das divergências.",
    "In the AI era, judgement is not simply an individual leadership strength. It is becoming a collective capability for executive teams and boards. We also shared our insights paper, Collective Executive Judgement in the AI Era, drawing on conversations with 150+ senior leaders and our work with executive teams and boards.": "Na era da IA, o discernimento deixou de ser apenas uma competência individual de liderança. Ele se torna uma capacidade coletiva das equipes executivas e dos conselhos. Também compartilhamos nosso artigo Collective Executive Judgement in the AI Era, baseado em conversas com mais de 150 líderes seniores e em nosso trabalho com equipes executivas e conselhos.",
    "It was great to be back in KL meeting clients. This visit was more special as Nitin was invited to attend the 3rd edition of the CHRO Nexus Forum, a gathering of top CHROs from the region.": "Foi ótimo voltar a Kuala Lumpur e encontrar clientes. A visita foi ainda mais especial porque Nitin foi convidado para a terceira edição do CHRO Nexus Forum, que reuniu líderes de RH da região.",
    "In today's world, everyone's building a hybrid workplace. But almost nobody's building a hybrid talent strategy. 39% of core workplace skills are expected to change by 2030, and 6 in 10 employees will need reskilling within just three years.": "Hoje, muitas organizações criam ambientes de trabalho híbridos, mas poucas desenvolvem uma estratégia híbrida de talentos. Até 2030, estima-se que 39% das competências essenciais do trabalho mudarão, e seis em cada dez profissionais precisarão se requalificar em apenas três anos.",
    "Yesterday, HR's mandate was digital transformation. Today, that has expanded to AI transformation. Tomorrow, the mandate shifts again, to Human-AI transformation, where ethics and bias will need to be addressed in every decision. That is building efficiency with meaning.": "Antes, a missão do RH era a transformação digital. Hoje, ela inclui a transformação pela IA. Amanhã, será a transformação da relação entre pessoas e IA, com ética e vieses considerados em cada decisão. É assim que se constrói eficiência com propósito.",
    "Cookies": "Cookies",
    "Cookie consent": "Consentimento de cookies",
    "Close menu": "Fechar menu",
    "Accept": "Aceitar",
    "Decline": "Recusar",
    "We use cookies to improve your experience and analyse site usage. By clicking “Accept”, you consent to our use of cookies.": "Usamos cookies para melhorar sua experiência e analisar o uso do site. Ao clicar em “Aceitar”, você concorda com o uso de cookies.",
    "Please enter your name.": "Informe seu nome.",
    "Please enter your work email.": "Informe seu e-mail profissional.",
    "Please enter a valid email address.": "Informe um endereço de e-mail válido.",
    "Please tell us about the challenge you are facing.": "Conte-nos qual desafio você está enfrentando.",
    "Sending…": "Enviando…",
    "Too many attempts. Please wait a moment and try again.": "Muitas tentativas. Aguarde um momento e tente novamente.",
    "Something went wrong sending your message. Please try again, or email us directly.": "Não foi possível enviar sua mensagem. Tente novamente ou envie um e-mail diretamente para nossa equipe.",
    "Grit": "Determinação",
    "Coaching": "Coaching",
    "coaching": "coaching",
    "Thought Leadership": "Conteúdo e conhecimento",
    "Senior women": "Mulheres em cargos de liderança",
    "Breadcrumb": "Trilha de navegação",
    "Habit nudges": "Estímulos para novos hábitos",
    "CEO led": "Conduzido pelo CEO",
    "PhD led": "Conduzido por especialistas com doutorado",
    "Our people": "Nossa equipe",
    "One DNA TEAM": "One DNA TEAM",
    "The DNA Experience": "A experiência DNA",
    "The DNA experience": "A experiência DNA",
    "CorporateDNA Consulting": "CorporateDNA Consulting",
    "CorporateDNA Insights": "Insights da CorporateDNA",
    "The CDNA": "A CorporateDNA",
    "The 5H": "Os 5H",
    "We’ve led. We’ve learned. We bring both": "Lideramos. Aprendemos. Unimos as duas experiências.",
    "Practitioners first. Consultants second": "Profissionais experientes primeiro. Consultores depois.",
    "A senior leadership team, backed by a global faculty of 60+ practitioners delivering across 36 countries.": "Uma equipe de líderes experientes, apoiada por uma rede global de mais de 60 especialistas que atuam em 36 países.",
    "CEO, Founder, Author, Head of MENA": "CEO, fundadora, autora e responsável pelo Oriente Médio e Norte da África",
    "Head of UKEE": "Responsável pelo Reino Unido e Europa",
    "UK & Europe": "Reino Unido e Europa",
    "Head of UK & Europe": "Responsável pelo Reino Unido e Europa",
    "Mike Jackson, Head of UK & Europe": "Mike Jackson, responsável pelo Reino Unido e Europa",
    "Head of Thought Leadership & Innovation": "Responsável por Conteúdo e Inovação",
    "Senior Faculty - Executive Coach": "Especialista sênior · Coach executivo",
    "After years in senior rooms, I’ve learned to listen as closely to what isn’t being said as to what is. That’s often where the real work is.": "Depois de anos trabalhando com a alta liderança, aprendi a ouvir com a mesma atenção o que não é dito e o que é. Muitas vezes, é aí que está o trabalho mais importante.",
    "With executive teams and top 100 leaders, there’s a certain science to creating magic in the room. It’s finding the optimal blend of ‘care and dare’, then bringing judgement, curiosity, maturity and trust together so people can go further than they thought they would.": "Ao trabalhar com equipes executivas e os 100 principais líderes de uma organização, existe uma ciência por trás de criar momentos transformadores. É encontrar o equilíbrio entre cuidado e coragem e reunir discernimento, curiosidade, maturidade e confiança para que as pessoas avancem além do que imaginavam.",
    "Nitin": "Nitin",
    "Peter": "Peter",
    "Sarah": "Sarah",
    "Shell": "Shell",
    "shell": "Shell",
    "dyson": "Dyson",
    "DP World": "DP World",
    "dp world": "DP World",
    "Frasers": "Frasers",
    "UKEE": "UKEE",
    "SDI": "SDI",
    "TERRAGRN": "TERRAGRN",
    "VP SEA": "VP do Sudeste Asiático",
    "Notion Press, 2025": "Notion Press, 2025",
    "Keeping Leadership Real": "Liderança de verdade",
    "Discuss a leadership challenge": "Converse sobre um desafio de liderança",
    "Trusted by leadership teams at": "Equipes de liderança que confiam em nós",
    "bank of england": "Bank of England",
    "dubai holding": "Dubai Holding",
    "frasers property": "Frasers Property",
    "collins aerospace": "Collins Aerospace",
    "hbo max": "HBO Max",
    "Our purpose is to make leadership": "Nosso propósito é tornar a liderança",
    "Work sponsored by Chairman / CXO": "Projetos patrocinados pelo presidente do conselho ou pela diretoria executiva",
    "Regions of global delivery": "Regiões em que atuamos",
    "Faculty of senior practitioners": "Rede de especialistas experientes",
    "Results, not promises. Measured where it matters.": "Resultados concretos, medidos onde mais importa.",
    "Equip the Top 150 to lead through complexity, accelerate transformation and sustain business performance.": "Preparar os 150 principais líderes para enfrentar a complexidade, acelerar a transformação e sustentar os resultados do negócio.",
    "higher promotion rate versus non-participants over three years": "taxa de promoção mais alta do que a de não participantes ao longo de três anos",
    "Senior advisors who have sat where our clients sit.": "Consultores experientes que já estiveram no lugar dos nossos clientes.",
    "A leadership team of seasoned advisors, backed by a global faculty of 75 practitioners delivering across 36 countries.": "Uma equipe de consultores experientes, apoiada por uma rede global de 75 especialistas que atuam em 36 países.",
    "Different by design": "Diferentes por escolha",
    "There is an authentic and consistent mould for a DNA facilitator or coach.": "Nossos facilitadores e coaches compartilham uma forma autêntica e consistente de trabalhar.",
    "Beyond content and expertise, our people bring themselves.": "Nossa equipe vai além do conhecimento técnico e coloca sua experiência humana em cada projeto.",
    "Harvard Business Impact": "Harvard Business Impact",
    "Imperial College London": "Imperial College London",
    "Explore Performance": "Explore Performance",
    "Corporate Vision": "Corporate Vision",
    "Leadership: It’s In Your DNA": "Leadership: It’s In Your DNA",
    "CorporateDNA: How Great Companies Build What Competitors Can't Copy and clients want to emulate": "CorporateDNA: How Great Companies Build What Competitors Can't Copy and clients want to emulate",
    "© Corporate DNA Consulting. All rights reserved.": "© Corporate DNA Consulting. Todos os direitos reservados.",
    "CorporateDNA Consulting on LinkedIn": "CorporateDNA Consulting no LinkedIn",
    "We work with": "Trabalhamos com",
    "Executive Teams, SLT/ET-1 leaders": "equipes executivas e líderes SLT/ET-1",
    "Top 100–150 leadership populations": "grupos dos 100 a 150 principais líderes",
    "to build the leadership capability their organisation needs for what comes next.": "para desenvolver a capacidade de liderança de que a organização precisa para o futuro.",
    "Every journey starts with your": "Cada jornada começa com a sua",
    "business transformation": "transformação do negócio",
    ", not a standard curriculum. Whether you are scaling, integrating, reshaping culture, accelerating performance or navigating disruption, we identify the leadership shifts required and design a tailored journey to meet them.": ", e não com um programa padrão. Seja para crescer, integrar negócios, mudar a cultura, acelerar resultados ou enfrentar mudanças, identificamos as transformações necessárias na liderança e desenhamos uma jornada sob medida.",
    "Collective": "Clareza",
    "clarity": "coletiva",
    "Bigger": "Perspectiva",
    "perspective": "mais ampla",
    "Greater": "Mais",
    "judgement": "discernimento",
    "Focused 1–2 day interventions that strengthen how Executive Teams lead together: aligning around purpose, making critical decisions, navigating tensions and increasing their collective capacity to drive transformation.": "Intervenções focadas de um a dois dias que fortalecem a liderança coletiva das equipes executivas: alinhar o propósito, tomar decisões críticas, lidar com tensões e ampliar a capacidade de conduzir transformações.",
    "We develop SLT and ET-1 leaders to step beyond functional or market leadership: strengthening their leadership identity, Inner and Outer Game, to lead across boundaries, influence horizontally and turn strategy into execution.": "Desenvolvemos líderes SLT e ET-1 para atuar além de sua função ou mercado. Fortalecemos sua identidade de liderança, seu jogo interior e exterior, e sua capacidade de colaborar entre áreas e transformar estratégia em execução.",
    "Top 100 – 150 leaders": "Os 100 a 150 principais líderes",
    "Mastering the dualities and competing commitments of leadership.": "Dominar as tensões e prioridades concorrentes da liderança.",
    "Live business challenges": "Desafios reais do negócio",
    "Mastery Labs": "Laboratórios de aperfeiçoamento",
    "Leadership shifts you can see in the business.": "Mudanças na liderança visíveis nos resultados do negócio.",
    "Head of Asia": "Responsável pela Ásia",
    "Head of Americas": "Responsável pelas Américas",
    "CEO Americas": "CEO para as Américas",
    "Asia Pacific": "Ásia-Pacífico",
    "Americas": "Américas",
    "Asia": "Ásia",
    "A faculty of 60+ senior practitioners across 36 countries.": "Uma rede de mais de 60 especialistas experientes em 36 países.",
    "With headquarters in London, Singapore, Dubai, Riyadh and Miami, and a faculty of 60+ senior practitioners, we deliver globally.": "Com escritórios em Londres, Singapura, Dubai, Riade e Miami e uma rede de mais de 60 especialistas experientes, atuamos em todo o mundo.",
    "The team that carries every project from promise to impact. Our senior programme managers across UKEE, ASIA and Middle East are the connective tissue of every client engagement, holding the client relationship, faculty, roadmap and delivery together. They bring the discipline, care and continuity that turns great thinking into a consistently great client experience.": "A equipe que conduz cada projeto da promessa ao impacto. Nossos gerentes seniores de programa no Reino Unido, na Ásia e no Oriente Médio conectam o cliente, os especialistas, o planejamento e a entrega. Sua disciplina, atenção e continuidade transformam boas ideias em uma experiência consistente para cada cliente.",
    "The best programmes feel like one team, not client and consultant. Shared success means staying connected to the client, faculty and outcomes throughout, adapting as we learn and taking ownership together for what lands.": "Os melhores programas funcionam como uma só equipe. O sucesso compartilhado exige conexão contínua entre cliente, especialistas e resultados, com adaptações ao longo do caminho e responsabilidade conjunta pelo que entregamos.",
    "Our facilitators and coaches come from the behavioural sciences, organisation development, psychology and business. They span over twenty nationalities and a wide range of social identities. They are senior enough to have sat where our clients sit.": "Nossos facilitadores e coaches têm experiência em ciências comportamentais, desenvolvimento organizacional, psicologia e negócios. Representam mais de vinte nacionalidades e diferentes identidades sociais. São profissionais experientes que já estiveram no lugar de nossos clientes.",
    "We blend our individual talents with the collective expertise of our global pool of 75 members across 36 countries, and deliver the power of the “DNA experience” to every client. Each time, every time.": "Combinamos os talentos de cada pessoa com o conhecimento coletivo de uma rede global de 75 profissionais em 36 países. Assim, levamos a experiência DNA a cada cliente, em cada projeto.",
    "Relationships are at the core of who we are. We build long-term, deep relationships with our people and become part of each other’s stories. We are part of a family who care about each other, stay close and grow, laugh and unmask together.": "Os relacionamentos estão no centro de quem somos. Construímos vínculos profundos e duradouros com nossa equipe e fazemos parte da história uns dos outros. Somos uma comunidade que cuida das pessoas, cresce, ri e pode ser autêntica em conjunto.",
    "Our best-in-class people are full of great character and personality, representing a range of backgrounds in the behavioural sciences and business; coming from different markets around the world, and representing a wide range of social identities.": "Nossa equipe reúne profissionais de diferentes culturas, mercados e áreas das ciências comportamentais e dos negócios. Essa diversidade de experiências, personalidades e identidades sociais fortalece nosso trabalho.",
    "I’ve seen brilliant strategies die in flat rooms. Part of the craft is knowing when to challenge, when to change the energy, and when to get out of the way.": "Já vi estratégias brilhantes perderem força em reuniões sem energia. Parte do trabalho é saber quando desafiar, quando mudar o ritmo e quando abrir espaço para a equipe avançar.",
    "When smart people keep repeating a pattern they say they want to change, I look for the commitment underneath it. Surface that, and resistance starts to make sense.": "Quando pessoas inteligentes repetem um padrão que dizem querer mudar, procuro o compromisso oculto por trás dele. Ao trazê-lo à tona, a resistência começa a fazer sentido.",
}
data.update(overrides)
# Postal addresses and venue names must remain searchable exactly as published.
for address in (
    "London WC2N 4JS", "Singapore 068894", "Miami, Florida, 33131",
    "Riyadh, 13321, RASA6101", "Dubai World Trade Centre",
    "Sheikh Rashid Tower, 4th Floor", "Dubai, United Arab Emirates",
    "United States of America",
    "63 Robinson Road, Level 8", "The Great Room, Afro Asia",
    "1221 Brickell Ave, Suite 900", "1221 Brickell Avenue, Suite 900",
    "Dubai World Trade Centre, Dubai", "60 St Martin's Ln, Covent Garden",
    "2nd Floor, Al Sahafah, Dist. 13671",
    "60 St Martin’s Lane, Covent Garden", "Dist. 13671, Riyadh 13321, RASA6101",
    "2888 King Fahd Road, Saudi Journalists",
    "Association Building, 2nd Floor, Al Sahafah",
    "2888 King Fahd Road, Saudi Journalists Association Building",
):
    if address in data:
        data[address] = address
CATALOGUE.write_text(json.dumps(dict(sorted(data.items(), key=lambda item: (len(item[0]), item[0].lower()))), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
