# Resposta à Axon — contatos administrativos e fechamento do cutover (31/08/2026)

> ## ⛔ SUBSTITUÍDO — não enviar
>
> Escrito antes da resposta do Amit (01/09 06:51 SGT), que respondeu o mesmo e-mail de 28/08 sem ver
> a do Rico e mudou três pontos: o contato do domínio passou a exigir **carta em papel timbrado**, o
> backup do WordPress virou **tarefa nossa ou USD 300**, e o rollback ficou condicionado a **manter a
> hospedagem ativa**.
>
> **→ `docs/resposta-axon-01-09-2026.md`**
>
> O que continua valendo daqui: a análise da resposta do Rico e o raciocínio sobre o Under Attack,
> ambos reaproveitados no doc novo.

> Base: `docs/emails/axon/*.eml` (thread completa) + `docs/analise-hospedagem-dns-axon-28-08-2026.md`.
> Antecessor: `docs/resposta-axon-dns-28-08-2026.md` (o e-mail que gerou a resposta do Rico).

---

## Onde a thread está

**Rico M. → nós, 31/08 09:51** (cópia: gm@, weidatay@eztech, mike.jackson@, jp.pritchard@,
finance@, Maliha.Bathool@, rhea.l@, amit@axon.com.sg, spencer@axon.com.sg)

Ele confirmou os seis pontos do nosso e-mail (domínio fica, sem EPP, cutover só A/CNAME, M365
intocado, WordPress de pé no rollback, backup completo antes de desligar) e deixou **um pedido** e
**quatro condições**:

| | O que ele pede | Nossa resposta |
|---|---|---|
| **Pedido** | Dados do novo contato administrativo: nome completo, cargo, e-mail monitorado, telefone com DDI, endereço postal se o atual mudar | §1 do e-mail |
| Condição | Valores exatos dos registros + data/hora/fuso **antes** de mexer | Aceito |
| Condição | Não tocar em MX, SPF, DKIM, DMARC | Aceito |
| Condição | Manter o Under Attack ligado | Aceito **com ressalva** — ver abaixo |
| Condição | Validar no domínio ao vivo e confirmar na thread | Aceito |

**Guilherme → nós, 31/08 20:57:** os quatro contatos — ele, Nitin Goil, JP Pritchard e Rhea Leckie.
Confirmou de passagem o endereço atual da Rhea: **`rhea.l@`** (o `rhea.leckie@` que aparecia antes
está morto).

---

## Três coisas que entram por nossa conta

Não foram pedidas pelo Rico — mas esta é a hora de dizer, porque depois fica caro.

**1. O Under Attack tem que sair no go-live.** O Rico escreveu *"keep Under Attack mode enabled as
agreed"*, e o "as agreed" dele é permanente. Nosso combinado era **até a virada dos registros**. Com
o Under Attack ligado todo visitante leva uma tela de desafio e o Google não rastreia o site — é
exatamente o que hoje faz o `/sitemap.xml` devolver 403 (§2.3 da análise). Se não corrigirmos isso
agora, no dia da virada vira discussão.

**2. O backup tem que chegar na mão da CDNA.** Ele disse *"we will arrange the requested full
backup"* — arranjar do lado dele não resolve nada quando o servidor for desligado. Pedimos link de
download, arquivos + dump do banco, **antes** do cutover e não no dia da aposentadoria.

**3. A data da hospedagem continua sem resposta.** O único número que temos é o vencimento do ciclo
anterior — 30/09, inferido da fatura #9143. Isso é daqui a um mês. Ele mesmo levantou a bandeira do
"não deixe para a última hora"; a pergunta devolve a bola.

### Segurança do domínio fica fora — decidido em 31/08

As travas (`clientTransferProhibited` e `clientUpdateProhibited`), o auto-renew e a invalidação dos
EPP já emitidos — §2.7 da análise — **não entram neste e-mail**. Chegaram a ser rascunhados como um
§6 e foram retirados: o assunto vai numa conversa separada, como estava planejado desde 28/08.

**Continua em aberto e é o item mais urgente da lista:** o domínio expira em **13/10** e o registro
público mostra status `active`, sem trava nenhuma.

---

## O que falta preencher

Duas lacunas, ambas pequenas:

1. **Cargo do Guilherme e do Nitin** — estão como `[role]` no rascunho. Os outros dois vieram da
   análise (Rhea: Founder & CEO; JP: Thought Leadership) — vale conferir, saíram de assinatura de
   e-mail.
2. **Telefone com DDI.** Não temos, e o e-mail não trava por isso: ele oferece o número do contato de
   registro sob confirmação, ou a linha principal do escritório. **Sugestão: usar a linha do
   escritório**, não o celular de ninguém — não morre quando a pessoa sai, que é o problema que
   estamos justamente consertando.

## Quem é o contato de registro

O e-mail manda os quatro, mas registrador costuma ter **um** campo de contato administrativo. O
rascunho pede: se só couber um, que seja a **Rhea** — ela já é a contato registrada, então só o
e-mail muda, e os outros três entram na lista de notificação. É a alteração menor e a que menos
depende de dado novo.

**Se preferir o Guilherme no registro** (ele se listou primeiro e é quem de fato monitora), é trocar
o nome nessa frase. Nada mais no e-mail muda.

## Envio

**Responder a todos dentro da thread** — o Rico pediu explicitamente *"confirm in this thread"*, e
agora estamos nela. Um acréscimo: **incluir o `nitin.goil@`**, que não está na cópia e está sendo
indicado como contato do domínio.

---

## 🇬🇧 E-mail — Reply All na thread

**Subject:** Re: corporatednaconsulting.com — domain, and how the cutover will run

Dear Rico,

Thank you for the clear summary — your six points match our understanding exactly, and we are happy
to work to the sequence you set out.

**1. Administrative contact**

Corporate DNA has nominated the following people. Allison Vickery has left the company; her mailbox
should be removed from all domain correspondence.

- Rhea Leckie — Founder & CEO — rhea.l@corporatednaconsulting.com
- Guilherme Mendes — [role] — gm@corporatednaconsulting.com
- Nitin Goil — [role] — nitin.goil@corporatednaconsulting.com
- Jon-Paul Pritchard — Thought Leadership — jp.pritchard@corporatednaconsulting.com

Please note Rhea's address. Earlier correspondence went to an older address of hers which is no
longer in use; the correct one is `rhea.l@corporatednaconsulting.com`.

If the registrar record allows only a single administrative contact, please use **Rhea Leckie** — she
is already the registered contact, so only the email address changes — and add the other three to
your notification list, so that all four receive renewal notices, contact-change confirmations and
any auth code correspondence.

The organisation's postal address is unchanged, so please keep the existing address on record. If the
registrar also requires a direct telephone number for the record contact, please confirm and we will
provide it — Corporate DNA's main office line, if that is acceptable to the registrar.

**2. The cutover**

Agreed on every point:

- we will send you the exact target DNS record values, and the proposed date, time and timezone,
  before making any change;
- the change is limited to the A and CNAME records for the apex and `www`;
- MX, SPF, DKIM and DMARC will not be touched — Microsoft 365 mail is unaffected by this work;
- we will validate the new site on the live domain after the update, and then confirm in this thread.

One clarification on Cloudflare's Under Attack mode. We will keep it enabled through the record
change and validation, as agreed. It does, however, need to be switched off at go-live: it presents
an interstitial challenge to every visitor and prevents search engines from crawling the site — at
present `/sitemap.xml` returns 403 for exactly that reason. We will disable it once the new site is
validated and your server is no longer in the path, and we will tell you when we do.

**3. The rollback period**

We propose **two weeks** from the date we confirm the new site is live and validated. During that
window, please keep the WordPress site running and reachable at its own IP or hostname, so that we
can repoint to it quickly if anything needs reverting.

**4. The WordPress backup**

Thank you for arranging this. Two points to settle:

- please deliver a copy to Corporate DNA — a download link is fine — rather than retaining it only on
  your side; and
- please include both the site files (in particular `/wp-content/uploads`) and a database dump.

We would rather have it in hand before the cutover than at the point the server is retired.

**5. One question from our side**

Could you confirm the exact renewal date of the website hosting? Our only reference is invoice #9143
from the previous cycle. You made the point yourself that this should not be left until the last
minute, and knowing the date allows Corporate DNA to decide on renewal in good time.

Best regards,
Ricardo

---

## 🇧🇷 Resposta ao Guilherme — curta, na thread dele

> Só para fechar as duas lacunas. Não precisa esperar para mandar à Axon: o e-mail acima já pede o
> telefone sob confirmação, então isto aqui é para ter o dado quando eles voltarem.

Perfeito, Guilherme, obrigado. Já estou respondendo a eles com os quatro.

Duas coisinhas para eu não chutar:

1. **Cargo seu e do Nitin** — a Axon pede o cargo junto do nome. Da Rhea e do JP eu tenho.
2. **Um telefone com DDI.** O registrador normalmente exige um para o contato do registro. Minha
   sugestão é usar a **linha principal do escritório** em vez do celular de alguém — é o mesmo motivo
   de estarmos trocando o contato agora: número de pessoa morre quando a pessoa sai.

Uma observação sobre o cadastro: registrador costuma ter só **um** campo de contato administrativo, e
os outros entram como cópia. Pedi para deixarem a **Rhea** nesse campo — ela já é a contato
registrada, então só o e-mail dela muda (o antigo estava errado) — e vocês três recebendo tudo junto.
Se preferir você nesse lugar, me avisa que eu troco.

Abraço,
Ricardo
