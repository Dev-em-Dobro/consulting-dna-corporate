# Navegadores embutidos (WhatsApp/Instagram) × hidratação do React

> Lição aprendida em 2026-08 depurando o intro do hero no mobile. Vale para
> qualquer projeto Next.js/React que use classes no `<html>` setadas por
> script inline.

## O problema

Navegadores embutidos em apps (WhatsApp, Instagram, Facebook, TikTok…)
**injetam código na página** antes do React hidratar. Isso quebra a
hidratação (React error **#418** minificado) e o React entra em recuperação:
re-renderiza a árvore client-side — incluindo o `<html>` com o `className`
que está no JSX.

**Consequência silenciosa:** qualquer classe adicionada ao `<html>` por
script inline no `<head>` (o padrão `document.documentElement.classList.add('js')`
usado para esconder conteúdo antes das animações de entrada) é **apagada**.
Todo CSS gated nessas classes morre sem nenhum erro visível — no nosso caso,
o intro em canvas rodava perfeitamente, mas invisível (`display:none`),
parecendo "imagem congelada".

`suppressHydrationWarning` no `<html>` **não** impede isso — ele só suprime o
warning de atributos; a falha #418 vinda de nós injetados no DOM dispara a
recuperação do mesmo jeito.

## A correção (padrão a reutilizar)

Reaplicar as classes num **layout effect** pós-hidratação (roda antes do
próximo paint), além do script inline:

```ts
// lib/hero-intro.ts (este repo)
export function applyEnvClasses(): void {
  const el = document.documentElement;
  el.classList.add("js");
  if (isTouchDevice()) el.classList.add("touch");
}
```

Chamada no início do `useGSAP`/`useLayoutEffect` dos componentes que dependem
das classes (aqui: `HeroV1.tsx` e `Preloader.tsx`). O script inline continua
necessário para o primeiro paint; o effect garante a sobrevivência ao wipe.

## Outras lições da mesma investigação

1. **Detecção de celular**: `max-width` E `hover`/`pointer` do CSS são
   mascarados pelo modo "Site para computador" do iOS. O único sinal que o
   iOS não falsifica é `navigator.maxTouchPoints > 1` (hardware). O script
   inline seta uma classe `touch` no `<html>` e o CSS usa `html.js.touch`
   em vez de media queries.

2. **Autoplay de vídeo no iPhone não é confiável** (Modo de Baixo Consumo
   rejeita `video.play()` mesmo muted+playsinline). Para um intro que precisa
   SEMPRE rodar: sequência de frames desenhada em `<canvas>` via GSAP —
   nenhuma política de autoplay se aplica a canvas. Frames extraídos com:
   `ffmpeg -i video.mp4 -vf "fps=12,scale=720:-2" -c:v libwebp -quality 62 f-%03d.webp`

3. **Depurar bug que só acontece no celular do usuário**: overlay de
   diagnóstico opt-in por query param (`?herodebug` em `HeroV1.tsx`) que
   mostra na tela detecção, caminho escolhido, contadores e erros de JS —
   um print do usuário substitui horas de adivinhação. Foi um print desse
   overlay que revelou o `touchClass=false` + erro #418.

4. **Emular o cenário no Playwright antes de subir**: autoplay bloqueado
   (`HTMLMediaElement.prototype.play` rejeitando com `NotAllowedError`),
   wipe de classes (interceptar `DOMTokenList.prototype.add`), viewport
   980px com `maxTouchPoints` forjado — cada correção foi validada nos
   cenários reais antes do deploy.
