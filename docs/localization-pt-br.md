# Português do Brasil

O seletor PT/EN dos menus grava `site_locale` em um cookie e recarrega a URL atual. Os caminhos e slugs continuam em inglês. Sem o cookie (ou com `site_locale=en`), o site mantém o conteúdo original em inglês.

O catálogo [pt-BR-visible.json](../messages/pt-BR-visible.json) contém a cópia visível traduzida. [LocaleRuntime.tsx](../components/LocaleRuntime.tsx) aplica as traduções a textos e atributos da página, inclusive conteúdo inserido após a navegação. A página fica oculta durante a primeira tradução em português para evitar a exibição momentânea do texto em inglês. O título da aba também é traduzido.

As artes com texto têm versões em português selecionadas por [LocalizedImage.tsx](../components/LocalizedImage.tsx). As capas dos livros publicados e fotografias documentais de eventos preservam os originais. Endereços postais e nomes de locais físicos permanecem com a grafia original para facilitar a localização. Para alterar a redação portuguesa, edite as substituições editoriais em [curate-pt-br.py](../scripts/curate-pt-br.py) e execute `python scripts/curate-pt-br.py`; o script é idempotente.

O catálogo cobre a cópia publicada no momento desta entrega. Quando o conteúdo em inglês for alterado ou um novo artigo for publicado, acrescente as novas frases ao catálogo e revise sua tradução. A renderização inicial e as descrições de metadados permanecem em inglês; a versão em português é aplicada no navegador. Não use este mecanismo para conteúdo novo sem atualizar o catálogo.
