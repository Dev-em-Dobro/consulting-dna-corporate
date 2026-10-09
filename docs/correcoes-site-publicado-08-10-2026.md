# Correções do site publicado — 08/10/2026

Auditoria de `https://corporatednaconsulting.com/` após a migração para a Vercel. Foram abertas as 72 URLs do sitemap, as oito páginas de eventos e a página de parcerias. Também foram testados o menu móvel, a busca e o filtro dos casos, o modal e o carrossel da equipe, as âncoras principais, a validação do formulário e os três PDFs de Insights.

## Prioridade alta

### 1. Publicar o conteúdo das páginas legais

- [ ] Substituir o conteúdo provisório de `/privacy`, `/cookies` e `/terms` pelos textos aprovados pela CDNA.
- [ ] Conferir títulos, corpo, links e formatação após a publicação.

**Evidência:** as três páginas estão acessíveis, mas mostram praticamente apenas `privacy`, `Cookies` e `Terms`, respectivamente. Estão no sitemap e não têm `noindex`. O conteúdo vem dos singletons `privacy`, `cookies` e `terms` do CMS, renderizados por `components/views/LegalView.tsx`.

**Concluído quando:** cada URL exibir a política completa correspondente, com texto aprovado e legível no celular e no desktop.

### 2. Resolver as 37 páginas de regiões vazias

- [ ] Decidir quais regiões terão página individual com conteúdo real.
- [ ] Para as páginas mantidas, publicar corpo específico da região no CMS.
- [ ] Para as páginas sem conteúdo, retirar links públicos para elas e removê-las do sitemap; definir se devem responder `404`, redirecionar para `/services/regions` ou permanecer temporariamente com `noindex`, conforme a estratégia de conteúdo.
- [ ] Revisar a página `/services/regions`, que hoje lista e vincula todas as 37 regiões.

**Evidência:** todas as 37 URLs de `/services/regions/[region]` abertas na auditoria exibiram `Content for <região> is coming soon.`. Todas constam no sitemap. A saída provisória vem de `components/views/RegionView.tsx`; as rotas e os metadados estão em `app/services/regions/[region]/page.tsx`.

**Concluído quando:** nenhuma região anunciada ao visitante abrir uma página de conteúdo provisório, e o sitemap contiver apenas páginas que se deseja indexar.

### 3. Corrigir os redirecionamentos para a âncora inexistente

- [ ] Alterar `/our-way` e `/our-way/our-thinking` para um destino existente e equivalente, provavelmente `/approach`, após conferir a intenção editorial.
- [ ] Testar o destino final no navegador.

**Evidência:** ambos redirecionam para `/#approach`, mas a página inicial não contém um elemento com `id="approach"`. As regras estão em `next.config.mjs`. As âncoras `/#book`, `/#contact` e `/about#values` existem.

**Concluído quando:** os dois endereços antigos levam diretamente à seção ou página correta.

## Prioridade média

### 4. Resolver a página de Awards

- [ ] Publicar o conteúdo aprovado em `/awards`, ou retirar a página do sitemap e da indexação até estar pronta.

**Evidência:** a página diz `Awards & partnerships content is coming soon.`, está no sitemap e não tem `noindex`.

**Concluído quando:** a página oferecer o conteúdo prometido ou deixar de ser apresentada aos buscadores como página pronta.

### 5. Atender ao requisito literal de redirecionamento 301

- [ ] Revisar os redirecionamentos de URLs antigas importantes em `next.config.mjs` e trocar `permanent: true` por `statusCode: 301` onde a exigência contratual/editorial for especificamente **301**.
- [ ] Confirmar cada regra prioritária com o código HTTP e o destino final, sem cadeias desnecessárias.

**Evidência:** `/our_services.html`, `/our_team.html` e `/privacy-policy.html` responderam `308 Permanent Redirect`. O `www` respondeu `301` para o domínio principal. O código 308 também é permanente, mas não satisfaz a solicitação explícita de 301 para as páginas antigas importantes.

**Concluído quando:** a lista de URLs antigas prioritárias estiver mapeada para páginas correspondentes e cada resposta tiver o código 301 solicitado.

### 6. Atualizar o sitemap de eventos

- [ ] Definir quais páginas de eventos devem ser indexadas.
- [ ] Incluir `/events` e os eventos públicos indexáveis em `app/sitemap.ts`, ou aplicar `noindex` aos que não devam aparecer em busca.

**Evidência:** `/events` e oito páginas de detalhe estão acessíveis por links do site, mas não aparecem no sitemap publicado.

**Concluído quando:** o sitemap e a política de indexação dos eventos refletirem as páginas realmente publicadas.

### 7. Conferir a biografia da Rhea

- [ ] Pedir revisão editorial da biografia no modal de `/team`.

**Evidência:** o cartão da equipe indica `UAE`, enquanto a biografia afirma que ela vive em Singapura desde 2013. O texto também fixa a idade em `47`, dado que envelhece automaticamente.

**Concluído quando:** localização, idade e demais dados biográficos estiverem aprovados e coerentes com a página atual.

## Validação pendente

### 8. Testar a entrega real do formulário

- [ ] Com autorização para criar um lead de teste, enviar uma única mensagem pela página `/contact`.
- [ ] Confirmar o estado de sucesso na página e a chegada do registro ao CMS ou caixa de destino.
- [ ] Limpar ou identificar o registro como teste depois da conferência.

**Já verificado:** campos obrigatórios vazios e e-mail inválido mostram erros corretamente; a página inicial usa o mesmo componente `components/ContactForm.tsx`. A entrega de ponta a ponta não foi testada porque o envio cria um lead real e pode notificar a equipe.

### 9. Completar conferência visual de imagens

- [ ] Fazer passagem visual final em desktop e celular após as correções de conteúdo, incluindo imagens carregadas somente ao rolar e carrosséis.

**Já verificado:** nenhuma imagem carregada nas páginas principais percorridas apareceu quebrada. Os três PDFs de Insights responderam `200` com `Content-Type: application/pdf`. Isso não cobre todos os estados de carregamento de todas as imagens das 72 páginas.

## Funcionalidades que passaram nos testes

- Menu móvel abriu, expandiu Serviços e navegou para Clientes.
- Busca por `Dyson` e filtro `Manager Development` reduziram os casos corretamente.
- Modal de perfil abriu e fechou; o carrossel da equipe avançou uma imagem.
- O botão `Start a conversation` da home chegou à seção `#contact`.
- Dez páginas de serviços, nove estudos de caso, 37 páginas de regiões e oito detalhes de eventos abriram sem página 404 nos testes.
- `robots.txt` e `sitemap.xml` responderam `200`; o sitemap contém 72 URLs.
