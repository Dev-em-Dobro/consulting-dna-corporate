# Daily CDNA — call com a Maliha, 14/09/2026

**Fonte:** `Daily CDNA __ Dobro - Sep 14 2026.mp4` (40m45s).
**Participantes:** Maliha (cliente), Ricardo, Roberto, Guli.
**Formato:** primeira daily do projeto. A Maliha revisou as páginas já construídas e,
no fim, o Guli apresentou a proposta da 5H.

**Método:** faster-whisper `large-v3` na GPU, VAD, `condition_on_previous_text=False`.

> ⚠️ **A call é bilíngue** (Maliha em inglês, Dobro em português). A primeira passagem
> travou o idioma em `pt` e **traduziu** as falas dela — nessa versão as cores do gráfico
> 5H saíram trocadas ("branco sobre vermelho" em vez de "yellow on white"). A transcrição
> abaixo é a passagem multilíngue, com detecção por trecho, e cinco trechos ambíguos foram
> reprocessados isoladamente com `beam_size=10`. **Os pedidos foram extraídos do inglês
> original, não da tradução.**

---

## O que a Maliha pediu

### About
1. **Substituir o logo no topo** pelo logo real da empresa — ela ainda vai enviar.
   *"I haven't done yet and I do need to do, is send you the logo."*
2. **Os cinco blocos horizontais viram verticais:** cinco caixinhas pequenas com o texto
   embaixo, em vez da disposição horizontal atual.
   *"can we make these like vertical by any chance... five little boxes with the text underneath"*
3. **Mapa um pouco menor, com o texto ao lado.** O título "Where we work" continua no topo;
   o corpo do texto (com "Headquarters in London" etc.) sai de baixo do mapa e vai para o lado.
   ⚠️ *Ela disse "the text on the left-hand side" e, na frase seguinte, "we can have that on
   the right". Confirmar de que lado.*
4. **Trazer de volta o scroll de endereços** que existia na landing original — só a faixa de
   baixo, **sem o mapa**. *"I did like on the original landing page that it was scrolling for
   the addresses... without the map, just the bottom bit."*
5. **Foto do time:** ela vai providenciar. Perguntou se já temos a do time sentado na escada
   (pode estar no zip de conteúdo que o Guilherme mandou).
6. Fora isso, **o resto da About está aprovado** — *"Everything else on this page I think is fine."*
7. Ela ainda **precisa mandar fotos para a About** e avisou que **pode pedir rework da página
   no fim**, porque a Ria quer fechar as outras páginas antes de voltar nos destaques.

### Services
8. **Trocar a imagem do hero** — algumas pessoas na foto estão de olhos fechados.
9. **Usar o mesmo backdrop do skyline** que foi usado na outra página.
10. **Grid 4-4-4 na horizontal**, com imagens pequenas, e **as duas últimas embaixo**.
    *"we want to do four four four going across... and then the last two at the bottom"*
11. **Ela envia as imagens** — e lembrou que **toda página tem hero com imagem + imagem de
    fundo**, então precisa mandar as duas de cada página. Vai listar no grupo quais são.
12. **Adicionar uma imagem de destaque** em cada item da grade. ⚠️ *Áudio ruim neste trecho
    (11:58): "I just want the pool going across, a bit of image, just to call out each of the
    [?]". A intenção — cada serviço com uma imagem — está clara; a frase exata não.*
13. **O texto de cada serviço provavelmente vai mudar** — ela ainda não revisou em detalhe.
14. **Drill-down de cada serviço:** ela vai mandar o template de como deve ficar. Achava que
    já tinha enviado, e não enviou.

### Partners
15. **Adicionar os logos dos dois parceiros:** Harvard Business Impact e Imperial College.
    Só esses dois — não é o carrossel de logos da home.

### Team
16. **Cada pessoa ganha uma quote AO LADO do retrato**, não embaixo — é o que o mockup dela
    mostra: retrato à esquerda, card de citação à direita com aspas vermelhas grandes, e só
    nome/cargo/região sob a foto (mais um botão "+").
17. ⚠️ **NÃO é "um card por linha".** Isso foi **sugestão do Guli** (*"do you want it maybe just
    one person in each line?"*), não pedido dela. Ela respondeu apontando para o próprio
    mockup — *"if we keep it like this, where it's got their name, their role, and the region…
    along with their quote, I think Ria really liked this"*. **O mockup dela é 3 por linha**,
    igual ao que já está no ar; o que muda é a quote sair de baixo e ir para o lado.
    Os dados continuam vindo do **bloco 2 do Word**.
18. **Referência visual no Drive:** o mockup de página inteira, subido às 12:19 durante a call.
    Cópia em `docs/mockup-team-maliha-14-09-2026.png`.
19. **Remover o "global presence" desta página.**
20. **Fotos de região:** UK, Europe e GCC estão OK. Ajustes:
    - **India** — pode precisar trocar, *"some of our clients are very sensitive"*.
    - **Americas** — a foto atual não funciona (aparentemente é Miami e não se reconhece).
      Ela quer algo que a pessoa bata o olho e diga "ah, sim, América". Cogitou White House e
      Estátua da Liberdade, mas lembrou que "Americas" inclui América do Sul e Central.
      **Ela vai enviar a imagem.**
    - **Asia** — Marina Bay Sands, Singapura. Aprovada.
21. **MVP vai ao ar só com os client directors.** Os senior practitioners entram depois.

### Client impact / Case studies
22. **A `/cases/unilever` que já está no alpha é o modelo.** Ela navegou de `/our-clients`
    para `/cases/unilever` e disse *"this will ultimately be the inspiration behind the case
    studies"* — não é referência externa, é a nossa própria página. **Nada a receber aqui.**
    (Confirmado nos frames da tela compartilhada: URL `consulting-dna-corporate-alpha.vercel.app`.)
23. **23 case studies** previstos, cada um com **challenge / what we did / what changed**.
24. **Tirar "related case studies" e "client voice"** — fica só o bloco de métricas, que
    aparece quando a pessoa abre o case. ⚠️ *Nenhum desses dois blocos existe no site nem no
    brief (`grep` em `docs/` e `app/cases/` não acha nada). Ela nunca rolou a página além do
    topo, então não estava apontando para algo na tela — devem vir de outro template dela.
    **Perguntar o que são antes de assumir que não há trabalho aqui.***
25. **A página top level de Clients & Impact é que está pendente com ela** — *"and then the
    top level page, do I have that ready to show you? I don't think I do, it's not ready yet."*
26. **Status:** 3 de 23 prontos. Ela confirmou que **não precisa dos 23 para ir ao ar**, mas
    precisa de *"at least a handful"* — dois ou três não bastam.
27. A **landing page de Services** depende disso: ela tem quase tudo pronto, mas os call-outs
    de case studies travam o envio.

### Home / landing page
28. **Decisão dela: a home vem primeiro**, e não por último. *"The landing page first, I guess.
    There won't be many changes."* Isso contraria o que o Guilherme tinha dito (fechar as outras
    páginas e voltar na home no fim) — ela assumiu a confusão como culpa dela.
29. **Tirar as fotos do time do topo** — *"I don't want to see the team faces on there at the start."*
30. **A metade de baixo pode ficar** como está.
31. **O book pode ficar.**
32. **Os endereços provavelmente saem** — *"I don't really see it on a landing page."*
33. **O mapa parece duplicado** — revisar.
34. **Awards & mentions viram um banner**, em vez de chamar que fomos finalistas/semifinalistas.
35. **Awards desatualizados:** tem coisa de 2008 ali. Ela vai falar com a Ria sobre o que manter.

### 5H (proposta do Guli)
Ela aprovou com entusiasmo — *"I love this and I will sell her on it very easily"*, *"I can see
a lot of thought and effort has gone into it and you're really bringing the vision that Ria had
to life."* Pedidos concretos:

36. **Replicar o slider/carrossel na versão desktop também.** Ela prefere o carrossel às caixas:
    *"I think I like this version more than the boxes."*
37. **Amarelo sobre branco está ilegível** — *"I can't see the yellow on white, I can't read that
    very well."* Mexer nas cores ou no fundo.
38. **O H de "Heart" deveria voltar a ser vermelho**, não marrom. A Ria é muito particular com o
    vermelho porque é parte da marca e *"it's close to her heart"* — as outras cores são
    negociáveis, essa não.
39. **`self-assessment` é uma palavra só**, mas pode quebrar em duas linhas com hífen. Já
    `360 assessment` e `situational assessment` estão corretos como estão.
40. **Tirar o "making the learning real"**, mantendo os FAQs. ⚠️ *O Guli defendeu manter como
    call-out forte e a conversa terminou em "it's up to you" — **decisão em aberto.***
41. Confirmado que os FAQs são **expand/collapse**, não dropdown.
42. Ela vai mandar o gráfico **na DM do Guli**, não no grupo — *"I know what Ria likes and
    doesn't like, and if she sees it, she panics."*

---

## O que a Maliha ficou de enviar

| # | Item |
|---|---|
| 1 | Logo da empresa |
| 2 | Foto do time (e verificar a do time na escada) |
| 3 | Imagens de hero + background de **todas** as páginas, listadas no grupo |
| 4 | Imagens da grade de Services |
| 5 | Logos Harvard Business Impact e Imperial College (ou confirmar se achamos) |
| 6 | Imagem para "Americas" |
| 7 | Template do drill-down de cada serviço |
| 8 | Página top level de Clients & Impact (*"it's not ready yet"*) |
| 9 | Landing page de Services (travada nos case studies) |
| 10 | Fotos para a About |
| 11 | Um Word doc consolidando o que a Ria mandou por e-mail — *"all I get is emails"* |

---

## Pontos levantados pela Dobro

- **Mobile** (Guli): virar linhas em colunas deixa o texto estranho no mobile. A Maliha
  respondeu que o mobile **importa sim** — a empresa faz muitos eventos e quer distribuir QR
  code levando para o site, o que é tráfego mobile por definição. Ficou combinado que qualquer
  decisão de mobile é falada com ela. Ela também topou medir com analytics depois.
- **Palavras longas no gráfico 5H** (Guli): `resourcefulness` e `accountability` o obrigaram a
  reduzir texto para caber. Ele pediu para trocarem `resourcefulness` por algo menor —
  *"please, please change this word for something else."* **Sem resposta na call.**
- **Texto divergente entre versões** (Guli): o texto do gráfico antigo e o que a Ria mandou para
  o site estão diferentes. Precisa de uma fonte única. Devem ser **25 elementos** nos cinco H's.
- **Cor consistente** (Guli): a cor de cada H precisa ser a mesma em todas as aparições.

---

## A confirmar

1. **Lado do texto no mapa da About** (item 3) — ela disse esquerda e depois direita.
2. **"Making the learning real" sai ou fica** (item 39).
3. **Trocar `resourcefulness`** por uma palavra mais curta.
4. **Ordem de trabalho** (item 27): a home passou para primeiro. Vale confirmar com a Ria,
   já que a orientação anterior veio do Guilherme.
5. **Trecho 11:58** (item 12) — a frase exata do pedido de imagem em Services.

---

## Transcrição

> Passagem multilíngue, idioma detectado por trecho. Timestamps em mm:ss.

[00:00] E aí, bom dia. Tranquilo?
[00:03] Deve em triplo agora, né?
[00:05] Porque eu vi ali, era deve em dobro, deve Faton no Taker, deve em dobro de volta.
[00:15] Começamos as dailies, então? Hoje é a primeira que vocês estão fazendo?
[00:20] Primeira.
[00:21] Mandei o link pra ela ali.
[00:24] Acho que só Amaliha vai participar.
[00:29] Boa.
[00:30] Deixa eu botar ela aqui na call.
[00:31] Hello, hello, hello, good morning, how are we? Fine, and you? Oh my god, thank you, can I know everyone's names?
[01:05] I'm Ricardo, I'm Roberto, and I am Guli, Guli is my nickname and Paolo is my real name,
[01:17] but I was introduced as Gullilo, and your name is is it Maliha? Maliha, yes. Nice to meet you.
[01:33] So how do you want to do this daily? Do you have anything in mind? So how would you guys prefer it?
[01:43] do you want me to give you feedback on the pages you've already built or do you want to use a
[01:49] different approach uh yes yes sure will you wanted to show you uh 5h the 585h page that he's yeah
[02:01] but we can do that later after you do this your revision malika if you if it's fine by you actually
[02:08] Let me bring up my screen. How do I do this? Sorry, I don't use this. This one, I think?
[02:19] It's the one that has a laptop on it. Yeah.
[02:26] I'm using two screens. I think I got confused. You can see my screen?
[02:30] Yes.
[02:32] The website, right?
[02:33] Yeah.
[02:35] I'll record the meeting. Is that okay?
[02:38] Yeah, sure. Okay. So I'll go through the About page first. One of the things I haven't done yet, and I do need to do, is send you the logo.
[02:54] So let me just replace the actual company logo at the top. It's minor changes. It's nothing significant on this one.
[03:04] I've just had a pop-up to avoid infinity mode. This bit, perfect. I will get you a team photo.
[03:15] I'm wondering, do you guys already have the one of the teams sitting on the stairs?
[03:20] Guilherme sent us a content zip, I think, that we could go through that zip and see if we have it.
[03:33] But let me open the test page here, just one moment.
[03:40] Yeah, because he sent us a folder and there's a lot of images there.
[03:45] so okay okay don't we are not sure if this one is there but we can look I can
[03:54] ask AI go through it see if there's any quicker than you so I will send it to
[04:02] you but I'll dig it out and I'll send it across love this bit question here can
[04:11] we make these like vertical by any chance so you know currently they're in
[04:16] horizontals can we have like is it five five little boxes with the text
[04:23] underneath and then this one can we make the map just a tiny bit smaller and have
[04:32] the text on the left hand side sure yes where we work can remain at the top but
[04:38] but the body of the text, the with the headers, with headquarters in London, etc.
[04:44] We can have that on the right.
[04:46] Everything else on this page, I think, is fine.
[04:53] I did like on the original landing page that it was scrolling for the addresses.
[04:59] I wonder if it's still there.
[05:03] Okay.
[05:05] You see this bit here?
[05:12] Yes.
[05:14] If we can have just, without the map, if we can have just the bottom bit.
[05:18] That would look really cool, I think. I don't know if that's possible.
[05:23] You mean this part on that page?
[05:26] Hmm.
[05:28] Yes.
[05:29] Without the map, though.
[05:30] Without the map.
[05:32] If it's possible.
[05:33] I guess it's fine.
[05:36] Thank you.
[05:38] Okay, that was an easy one.
[05:40] Which map do you want me to do next?
[05:46] Services, I think.
[05:48] the services okay if you have any appointment about the design please because we are
[05:58] no i'm moving everything here yeah don't worry okay i have the concern but i i know that you
[06:05] have the same concern right now it's that some of these changes that mali has asked
[06:10] it's something that we can struggle in to make the mobile version because like when you change
[06:17] the the text to but this i know that you have this and don't worry malia i in my understanding they
[06:25] are considering that we can have both different approaches one for for desktop the other one for
[06:31] mobile when you change the the lines to columns the text it goes a bit it gets really really
[06:41] weird yeah okay but don't worry it's a concern for mobile and as i am i am understanding you guys
[06:50] don't have this need for mobile you strongly believe that every real everyone will reach
[06:59] your website from the desktop yeah but it's just like smaller concerns that are popping in my head
[07:08] We can always measure it, because I think most of the users use the mobile version,
[07:17] but we can measure it with analytics later, we will check that.
[07:25] Perfect, but it's just for now it's my concern, go on, it's working really great.
[07:34] think one of the things that as a business they do want to do because we host a lot of events
[07:41] they want to place a qr code and direct people to the website once we we're ready um
[07:49] i'm conscious that will be mobile based
[07:55] have their laptops with them at that point yeah makes sense okay if there's anything we
[08:01] need to make any decisions on when it comes to the mobile version just give me a shout
[08:05] and we all okay i i don't think it's a concern because we can have different
[08:12] details like in the mobile version and in the desk desktop version so it's okay it's working
[08:20] okay so the next one so with the services page um i realized i didn't actually give you a sample of
[08:30] what we kind of want it to look like and i'm just going to flash it up on my screen now if i can
[08:35] very quickly i realized today actually i didn't send it to you um
[08:41] i'm so sorry
[08:48] okay so with these services page definitely need to change this image because some of the girls
[09:04] have their eyes closed um but just for you to know those all those images i just put put anything
[09:11] there so we had something to see but we will ask you to i i think i already asked in the group
[09:21] some some of the images but i can send another message there and tell you exactly what images
[09:28] are because every page has a hero section with an image with a background image so we
[09:35] need those two okay okay noted um and i have just saved the wrong image so so sorry give me one
[09:44] second one way to be going on real chat bear with me so sorry guys this one sleep up okay
[10:08] so for the services page we're on the right track but we want it to look a little bit different
[10:15] and I'm thinking with the services if we use the same backdrop as we did the skyline again
[10:22] I think so I think we use the same backdrop again and then what we want it to do is for each of the
[10:32] services we have so we're on the right track but I think we want to do four four four going across
[10:39] four going across for little images yeah sure and then the last two at the bottom if you send us the
[10:47] the images we can we can do it sure yeah okay yeah send those across to you and then the partners we
[10:54] can keep in um can we add in the company logos here so harvard business impact and imperial
[11:00] college sure we can do that it's possible do you mean the logos like we have on the home page that
[11:10] they are passing no it's only two i guess no no it's the so it's just the two partner logos so
[11:21] okay harvard impact and imperial college so just there to them too it's possible
[11:28] yeah do you have this those logos let me make an evidence okay but anything that that you think
[11:43] that we can find ourselves you can tell me and i will look up and send to you and you can see
[11:50] if that's the right logo or image or anything okay thank you um what's that bit and i think
[11:58] the rest of this is fine i just want the pool going across, a bit of image, just to call out, I guess, each of the [?]
[12:08] guess it will be better with an image there I've got question for you when you
[12:21] guys the previous iteration of the website you can obviously drill down
[12:31] into okay okay I mean I need to go into each of these services and just double
[12:39] check the text I haven't gone into the detail of the text itself yet but I do
[12:47] think this might need to be changed a bit. Did I not send you the drill down version of each service?
[13:28] That's something I need to do. Why didn't I like to do that? That's the case today.
[13:51] No, I will get you the drill down of the template of how we want this to look and feel
[13:56] and i'll send that across to you as well so i thought i did next one our team and our team is
[14:07] missing okay okay so in the documents i think you guys there was quotes next to each of these people
[14:27] a bit like this image yeah yeah that part i didn't get so so we can talk now uh do you want it to
[14:40] those cards like they are now do you want it maybe just one one person in each line
[14:47] and then because there's two texas text for each person right
[14:53] So if we keep it like this, where it's got their name, their role, and the region which is on the word document I sent you, along with their quote, I think Ria really liked this.
[15:07] She wanted it to be a bit more like this.
[15:11] Sure. This text, the text, the paragraph, that's not the right text? Do you mean that there should be a quote there?
[15:21] there yeah it's on the block two of the word document i sent you so i've got their name
[15:27] their role the region and their quote sure okay i'll look into that thank you
[15:35] and then what we'll do in the future not now um as an mvp we'll go live with
[15:42] just the client directors um but in the future we'll add in some of our senior practitioners
[15:48] and we'll add their profiles here okay did i send this snippet to you
[16:00] what do you mean by snippet in this example of what we'd like it to look like in the page
[16:07] yeah no no no i don't think so no in the drive there's a doc and for four images in the team
[16:19] folder okay okay yeah let me drag that in now so I just drop it in the same
[16:40] folder yeah thank you I love what you're doing with the website by the way please
[16:51] don't mind my feedback okay thank you much and then we have we'll get the
[17:01] group photo that's all fine that's all okay i think we can remove the global presence from
[17:07] this page right yeah yeah sure um and then that's it that's all we've done so far right
[17:18] and now i've sent you we're currently working on what we want the client and impact to look like
[17:24] i can give you an example of that if you want to see that now just to pay yourself or if you say
[17:29] I just want it that's when it's ready sure you can okay yeah I have that we think I believe
[17:44] this page this this page I didn't yeah I haven't said anything anything with it
[17:51] we haven't done anything with it I was like well I'm working on it yeah
[17:57] but so let me show you this one first sure because I've just found this one so this will
[18:06] ultimately be the inspiration behind the case studies um there'll be 23 i think coming across
[18:15] and then each of them would have a challenge what we did what changed we can get rid of the related
[18:21] case studies client voice and then just some metrics that will happen when you dig into it
[18:26] to find out more so this page will look like this page ideally okay and then the top level page
[18:38] Do I have that ready to show you? I don't think I do. Sorry, guys. It's not ready yet.
[18:49] That's fine.
[18:55] No. Okay. And that's me done, I think.
[19:01] Can you just go back to the theme page, please?
[19:06] Yep.
[19:09] And scroll it, please. More, more, more, more, more, more, more, more.
[19:17] do you like that those photos in you you you have to send send me some other
[19:25] photos if you because I think that those ones will not be in there unless you
[19:31] liked it anyway any of those I like the next session yeah I like the UK Europe
[19:37] GCC Asia India some of our clients are very sensitive sure you might have to
[19:45] change this one okay and then america's what is something fundamentally america i don't know
[19:52] white house white house the statue of liberty yeah something along those lines something that
[20:00] as soon as people see it they'll be like oh yeah america sure asia i don't know what is what is
[20:06] this marina bay sands in singapore nice i know this one america but america's uh when we when
[20:17] we say americas we are talking about south america central america yes because i think he if we put
[20:27] What's the... I don't know, USA photo, maybe?
[20:34] What is on... Let me just check what is on images that we use.
[20:42] The problem is America is so wide.
[20:48] It's going to be hard to find a photo there.
[20:52] See this corner of the photo?
[20:55] I don't know what this is supposed to be, but apparently it represents Miami.
[21:00] We are not seeing the photo that you are showing, I guess, Maliha.
[21:06] I'll send it to you.
[21:09] I will send it to you.
[21:11] Okay.
[21:15] But I'll send you an image of my Americas.
[21:19] I'll ask Gili.
[21:20] Father Gili.
[21:21] Father Gili, yeah.
[21:23] Okay.
[21:25] I have...
[21:28] I wanted to show you, Maliha, the proposition that we created for the 5-H approach.
[21:36] porque isso é algo que é um pouco diferente das outras páginas, posso compartilhar minha tela agora?
[21:43] Sim, claro, por favor.
[21:45] Obrigado.
[21:47] E foi embora.
[21:51] Ela foi.
[21:54] Desligar a tela, né?
[21:58] Sim.
[21:59] Olá de novo, Maliha.
[22:03] Desculpe.
[22:04] Não se preocupe.
[22:06] Eu faço isso todo o tempo também.
[22:08] It happens. Tell me when you can see my screen, Maliha.
[22:18] I can see your screen.
[22:20] Okay. Is Maliha Batu?
[22:22] Yeah.
[22:23] Okay. I had a friend called Batu.
[22:27] It means virgin in Arabic.
[22:30] It means what?
[22:31] It means virgin in Arabic.
[22:35] Ah, okay. Good to know.
[22:39] I don't know why I'm muting that.
[22:41] Yeah, no, it's nice because she was a real good friend of me when I was a kid.
[22:49] This is the place where we draw the websites, like the layouts that we need to draw specifically.
[22:57] And this is the proposition that we have for 5H.
[23:01] I followed the text that you shared.
[23:03] I don't know if it was you or Ria or Gilly, but anyway, the main proposition is this,
[23:10] I draw everything considering mobile first because this is the methodology
[23:15] that I'm actually used to so I think in vertical right now alluded with the
[23:24] five-age and neuroscience that formula that attack here we have here we image
[23:29] that someone said I put up for this facilitation image and this is something
[23:35] that we need to also have.
[23:38] I don't even have a site, but I like
[23:41] where you're leading with this.
[23:43] OK.
[23:44] On your page, facilitation.
[23:50] Yeah.
[23:52] Thank you, Maliha.
[23:55] And then we have a small introductory text.
[23:59] So we have the title and the text.
[24:01] The only change that I made here is
[24:03] to put this on bold, because I think that is very important.
[24:06] This transformation requires all the leaders, faculties, just
[24:09] not your brain at the time two games every leader is playing both here the suggestion was for me to
[24:16] create two columns but i also added this circular arrows that is supposed to have a small movement
[24:29] just because i understand that ria for ria is very important that everything is connected and
[24:35] the circle is really important because there's not a beginning and an end and it's a loop.
[24:43] So this is a small detail that I think that can go really good. And I also unified the
[24:50] colors of the graphic, we're going to talk more about that in a minute, with the colors
[24:57] that the circular graphic used to have. I made small differences in the colors just
[25:04] because we changed the the red and we need to change everything considering it but this is
[25:11] something for the user to keep like memorizing how the head is the purple the heart of course
[25:17] it's not like rationalized it's subjective but yeah here you have the space for a video that
[25:26] we actually don't have right now but it's somebody asked me for this space and here we have five
[25:33] intelligence one whole leader here is one of you what sorry i said i love what you've done here
[25:41] i like this thank you thank you i i hope everyone likes the proposition was for the desktop to make
[25:49] like five columns and from desktop it works like a charm because you have a plenty of space but here
[25:57] we could could not do like parallels because we don't have space yeah so the
[26:05] other option was to make lines and I don't know I know that real wasn't be
[26:11] wouldn't be comfortable with that so I created a slider that has like a card
[26:16] system and these rotates as well so with automatic I'm sorry it's too early for
[26:26] for my English when the user enters for the first time there is an automatic
[26:32] animation that starts to show that just you to give the user this insight that
[26:38] is something but then you have like a carousel of information and when the
[26:45] card changes these also changes and this creates this circular loop that I
[26:51] strongly believe you for a year one should have I love this and I will sell
[26:56] her on it very easily if we were to replicate this on the laptop version of
[27:03] the website would it be possible yes yes easily done I was a lot of effort
[27:12] Easily done, I guess, Ricardo and Guilherme, right? Guilherme, no. Ricardo and Roberto, sorry.
[27:20] Yeah, I think I like this version more than the boxes.
[27:25] Okay. The other one is very good to have all the information in one page only.
[27:32] This is more modern and hype and aesthetic and everything.
[27:37] I like it like this.
[27:41] All right. Let's go to the other part. That is the graphic. Yay. I had to redraw this.
[27:49] Very good. Very nice. A lot of information. I have the same constraints, no exceptions, like resourcefulness. Please, please change this word for something else. Accountability. Those are the two words
[28:10] that I needed to make smaller text adjustments to fit. Everything else I made in a slightly
[28:18] different approach and the one that i think that is the most important is i didn't
[28:23] make like a very dark medium dark medium very light and light brown i made this changing between
[28:32] dark and medium brown because this creates the possibility for the user to read when we have
[28:38] like the the white over the yellow uh i know that this must be a very sensitive drawing for ria and
[28:50] for your team so i wanted to present to her to see what it's her thoughts regarding that but i
[29:00] believe that this is something that it's slightly better without changing the core
[29:06] for everything and there is something else that is important some of this text was updated
[29:14] from one version to another i saw the older graphic that we have and i saw the description
[29:22] that rea sends us for the website and they were different so this is something to be aware okay
[29:31] so there should be 25 elements into the five H's. One thing I would say is, I don't know,
[29:45] I can't see the yellow on white. I can't read that very well. I don't know if we can
[29:55] play around with the colours and the background colours. So this one I can spell on her. The
[30:02] brown for the h's i for the heart sorry she'd probably go more for a red i don't know if we
[30:13] can do it back to red we can but i followed the the colors that you already had so the
[30:23] show was brown on yours why is that yes okay and i if i screenshot this and send it in the
[30:33] whatsapp group are you guys all in the whatsapp group uh yes is there a team chat here let me
[30:44] see if the ghoul is there so i don't think he's there i can send it in where's my snippet tool
[30:54] but you can send in the group and i and i share with you yeah i can share it in the group
[31:01] one second why is this not loading one come on okay
[31:20] So she'll be very particular about the red because it's close to her heart.
[31:35] Any of the other colors we could have sold her, but the red is very because it's part
[31:42] of the branding as well.
[31:46] Perfect, okay.
[31:48] The important part for us is that this color needs to match every single time that they
[31:54] are shown.
[31:55] So here and everything.
[31:58] are you seeing my screen again okay here ria asked for the circular graphic in a whole because she
[32:07] understand that this is very important and and this is the complete version okay and then we
[32:13] have self-assessment 360 assessment and situational assessment she asked for someone asked i don't
[32:20] know if it was really she but for three icons that represent this and i am assuming this is
[32:26] the part of the methodology that you do to understand the do the diagnostics and everything
[32:33] okay this is that i just don't think and this is an english question actually i wanted to put like
[32:41] 360 situational and self-separated from the assessment word i don't know how can i do that
[32:51] But self-assessment, it's an entire word or it has this division? Because auto-conhecimento
[33:01] in Portuguese, I have some similarities in Portuguese, that is only one word, it's weird
[33:06] for me, like self... It is one word, but to fit it on two lines, we tend to use a little dash.
[33:12] Okay, the... So you put a dash in the... I don't know also, but it's like this.
[33:19] yeah okay okay 360 assessment is right situational assessment is right yeah it's three different
[33:26] types of five-page assessment you can do perfect and then here we have the 5hs and assessment and
[33:34] then we have this text and then we have some metrics like 125 plus organized scenarios and
[33:43] assessment and then phd led it's something that is not numerical is the first time that we're using
[33:48] that like in this disposition but it's okay it works doesn't require any changes and then we
[33:55] have the making the learning real that is like a bold bold phrase i think we can take
[34:02] that bit out what do you think we can keep the faqs in but take out the making the learning
[34:09] real i think that we can put like this yeah because then we have the the like a strong call
[34:17] out like make the learning real ready to lead with 5h but i don't know it's up to you actually
[34:24] but this is supposed to work as drop down menus drop down the menus no actually it's
[34:32] you can open and close when you have like okay okay then you click the button and then you
[34:41] yeah expense and collapse perfect okay and this is the main structure that i've drawn for the website
[34:47] uh the content is everything here but the the icons that i know that that the
[34:55] our twin devs can make and i just want to validate that with you thanks a lot
[35:05] now i really like it thank you i can see a lot of thought and effort has gone into it and you're
[35:09] really bringing the vision that we had to life so thank you thank you maria thanks guys i guess
[35:17] that's it guys i'm gonna share the graphic in the group so ria and everyone can have a look
[35:25] what do you believe my liha is better for me to send to you directly and then it's okay yeah
[35:34] because um but i know what ria likes and doesn't like and if she sees it she panics
[35:41] okay thank you thank you i'll send you like nadine so thank you thanks guys this is so
[35:50] zoomed in on my face yeah it happens it happened yes yeah that's it that's it that's it thanks
[36:02] thank you what i'll do guys um oh i need to send you guys the services landing page which is
[36:09] so I've got most of it but what we're doing on the services landing page
[36:15] there'll be a few call outs for case studies and they're not ready yet so I
[36:19] can't send you that part until the case studies are ready case studies are
[36:23] work-in-progress I've got maybe three at the moment out of 23 so it's happening
[36:31] just not fast enough
[36:32] do you think that
[36:35] we need those to
[36:39] to go live
[36:43] I mean as long as we've got two or three on there
[36:46] no we need at least
[36:48] a few a handful
[36:49] so what I'll
[36:52] do I need to go through what Ria sent
[36:54] me today
[36:56] she sent me quite a lot in the last 40
[36:58] minutes while we've been talking
[37:00] I just saw my emails going ping
[37:02] ping ping
[37:03] um so i'll go through what she sent me and i'll try and put it into a word document for all of
[37:09] you because all i get is emails okay and i need some photos also on the about page and i'm so
[37:16] sorry we may ask you to rework that at the end because what she wants to do she wants to do all
[37:21] the others first and then direct to the landing page for anything key um that she wants to call
[37:29] out which ones work on the others first the landing page that is not the about page not
[37:37] landing the home page yeah i i thought i think that ria wanted to finish all the other pages
[37:49] and then we go back to the home page later so we because we will have all the pages that was
[37:54] a part of that and then i started that might have been my fault because i said to her right if you
[38:00] want to work on the landing page first, give me all the content for the landing
[38:06] page, but bear in mind we're gonna do it here and here and here. Would you rather
[38:11] do it here and then come back and pull out the keys? That might be my fault.
[38:18] I don't know. How do you think it's better?
[38:25] The landing page first, I guess. There won't be many changes, I would say. I'd probably take off the
[38:33] team photos um a lot of the information you have on there would probably remain
[38:41] it would just be i don't want to see the team faces on there at the start um the bottom half
[38:49] can stay the book can stay the address is probably not i don't really see it on a landing page
[38:56] the map looks like a duplicate awards and mentions i'm thinking maybe we just have it as a banner
[39:05] rather than calling out that we were the finalists or the semi-finalists even though that's what we
[39:10] were but just there's some uh old ones here too i don't know if you guys want to keep those
[39:18] the awards yeah it's 2008 i will speak to ria because our awards are a bit outdated at the
[39:29] I'm sending you the graphic right away, Molly.
[39:42] Thank you, guys.
[39:46] Anything else?
[39:47] No.
[39:49] It's my business day.
[39:50] It's your start of business day.
[39:51] So have a good day, guys.
[40:09] And I'll catch you tomorrow.
[40:10] Thank you.
[40:14] Bye.
[40:24] yeah nice nice meeting you nice to meet you too speak tomorrow guys take care tomorrow bye
