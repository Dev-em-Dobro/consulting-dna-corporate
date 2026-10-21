# Acesso às telas de edição

As telas e APIs internas de edição continuam no código, mas estão fechadas por padrão. `proxy.ts` devolve 404 antes de renderizar páginas ou executar APIs. Os handlers de gravação também verificam a flag, impedindo salvamentos caso a configuração do proxy mude.

## Rotas bloqueadas

- Páginas: `/edit`, `/edit-home`, `/edit-about`, `/edit-team`, `/edit-services`, `/edit-services/[slug]`, `/edit-clients`, `/edit-impact`, `/edit-approach`, `/edit-insights`, `/edit-events`.
- APIs, em GET e POST: `/api/home-copy`, `/api/about-copy`, `/api/team-copy`, `/api/services-index-copy`, `/api/service-pages-copy`, `/api/service-pages-copy/[slug]`, `/api/clients-copy`, `/api/impact-copy`, `/api/approach-copy`, `/api/insights-copy`, `/api/events-copy`.

O webhook assinado `/api/revalidate` continua disponível para a atualização do conteúdo publicado pelo CMS externo. O site público continua lendo a última versão salva das cópias.

## Reativação

Configure `SITE_EDITING_ENABLED=true` no ambiente do servidor e faça novo deploy. Sem essa variável, ou com qualquer valor diferente de `true`, o acesso permanece fechado. Antes de habilitar em produção, implemente autenticação de administrador: essa flag sozinha restaura o antigo acesso sem login.

## Verificação

Em 21/10/2026, com a flag desligada e o build de produção executado localmente, GET nas 11 páginas e GET/POST nas 11 APIs acima retornaram 404. GET em `/`, `/services`, `/our-impact` e `/insights` retornou 200; o POST não assinado em `/api/revalidate` continuou retornando 401. As 10 páginas públicas principais foram verificadas sem links para `/edit`. `npm test` cobre a classificação das rotas e o valor padrão da flag.
