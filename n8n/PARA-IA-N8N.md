# 36 Bichos — o que colar na IA do n8n

Isto é para o **Assistente** do n8n (menu esquerdo, “Assistente”).
A IA do n8n monta os nodes. Tu só colas os textos na ordem.

Simulação educacional. **Sem dinheiro real.**

---

## O que TU fazes (humano)

1. Abre o n8n: `https://kravenops.app.n8n.cloud`
2. Clica **+** e cria um fluxo novo. Nome: `36 Bichos`.
3. Timezone do fluxo: **America/Sao_Paulo** (⋯ do fluxo → Settings).
4. Abre o **Assistente** (barra esquerda).
5. Cola o **Prompt 1**. Espera ela terminar.
6. Cola o **Prompt 2**. Espera.
7. Segue até o **Prompt 6**.
8. Clica **Publicar**.
9. Clica no node **Cadastro** → copia a URL do formulário → abre no Chrome.

Se a IA errar um node, cola de novo só aquele prompt. Não apaga o que já ficou certo.

---

## Prompt 1 — cola no Assistente

```
Cria um workflow de formulário chamado 36 Bichos. É simulação educacional, sem pagamento real.

Adiciona o node Form Trigger com:
- path: 36-bichos
- formTitle: 36 Bichos — Cadastro
- formDescription: Simulação educacional. Sem dinheiro real. Se já tem conta, usa o mesmo e-mail e senha.
- botão: Entrar no terreiro
- campos obrigatórios:
  - Nome completo (text)
  - E-mail (email)
  - Telefone (text)
  - Senha (password)

Não execute ainda. Só cria este node.
```

---

## Prompt 2 — cola no Assistente

```
Depois do Cadastro, adiciona um node Code chamado Registrar.

Regras do código:
- Usa $getWorkflowStaticData('global') para guardar users, tickets, draws, seq.
- Lê os campos: $json['Nome completo'], $json['E-mail'], $json.Telefone, $json.Senha.
- Valida: nome >= 3, e-mail com @, telefone só dígitos >= 10, senha >= 8.
- Se o e-mail já existe, confere a senha; se não existe, cria a conta.
- Hash da senha: se require('crypto') funcionar, usa pbkdf2Sync 120000 iterações sha256. Se não funcionar, usa esta função e NÃO uses require:

function hash(pw, salt) {
  const s = String(salt) + '|' + String(pw);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

- Garante um sorteio aberto (status open) às 18:00 America/Sao_Paulo. Se não existir, cria.
- Reserva como ocupados pela casa os números: 3, 7, 11, 16, 22, 28, 32, 35.
- Retorna json: { email, name, phone, drawId, aviso, taken }
- aviso deve listar casas ocupadas e as livres, com os 36 animais:

1 Avestruz, 2 Águia, 3 Burro, 4 Borboleta, 5 Cachorro, 6 Cabra, 7 Carneiro, 8 Camelo, 9 Cobra, 10 Coelho, 11 Cavalo, 12 Elefante, 13 Galo, 14 Gato, 15 Jacaré, 16 Leão, 17 Macaco, 18 Porco, 19 Pavão, 20 Peru, 21 Touro, 22 Tigre, 23 Urso, 24 Veado, 25 Vaca, 26 Lobo, 27 Raposa, 28 Coruja, 29 Tubarão, 30 Golfinho, 31 Falcão, 32 Pantera, 33 Rato, 34 Pato, 35 Abelha, 36 Peixe.

Conecta Cadastro → Registrar.
```

---

## Prompt 3 — cola no Assistente

```
Depois de Registrar, adiciona um node Form chamado Escolher bichos.

- formTitle: Escolhe os bichos
- formDescription: expressão {{ $json.aviso }}
- campo dropdown Bichos, multiselect = true, obrigatório
- opções (texto exatamente assim):
01 — Avestruz
02 — Águia
03 — Burro
04 — Borboleta
05 — Cachorro
06 — Cabra
07 — Carneiro
08 — Camelo
09 — Cobra
10 — Coelho
11 — Cavalo
12 — Elefante
13 — Galo
14 — Gato
15 — Jacaré
16 — Leão
17 — Macaco
18 — Porco
19 — Pavão
20 — Peru
21 — Touro
22 — Tigre
23 — Urso
24 — Veado
25 — Vaca
26 — Lobo
27 — Raposa
28 — Coruja
29 — Tubarão
30 — Golfinho
31 — Falcão
32 — Pantera
33 — Rato
34 — Pato
35 — Abelha
36 — Peixe
- botão: Ir ao carrinho / PIX

Conecta Registrar → Escolher bichos.
```

---

## Prompt 4 — cola no Assistente

```
Depois de Escolher bichos, adiciona um node Code chamado Reservar e PIX.

O código deve:
- Ler prev = $input.first().json
- Pegar os bichos de prev.Bichos (array ou string). Extrair o número de cada item.
- Números só de 1 a 36, sem repetir. Se vazio, erro: Escolhe pelo menos um bicho.
- Preço da ficha: 500 centavos (R$ 5,00).
- Para cada número: se outro e-mail já tem esse animal neste drawId, NÃO vende. Troca pelo bicho livre mais próximo e avisa: "01 ocupado. Trocamos por 02 Águia."
- Grava tickets do usuário com status awaiting_pix.
- Gera payload PIX fictício (EMV) com valor do total, txid SIM + timestamp, chave simulacao-educacional@local, nome 36 BICHOS SIM, cidade PORTO ALEGRE, moeda 986. CRC16 CCITT.
- Retorna o prev + msgs, nomes, total, totalFmt em pt-BR, payload, txid, ganho (R$ 90,00 por ficha, 18x).

Conecta Escolher bichos → Reservar e PIX.
```

---

## Prompt 5 — cola no Assistente

```
Depois de Reservar e PIX:

1) Node Form Confirmar PIX
- formTitle: PIX simulado
- formDescription: expressão que mostre fichas, total, ganho por acerto e o código PIX ({{ $json.payload }})
- dropdown Confirmação obrigatório:
  - Já paguei (simulação)
  - Cancelar
- botão Continuar

2) Node IF Pagou?
- true se {{ $json.Confirmação }} igual a Já paguei (simulação)

3) No ramo false: Form completion Cancelado
- título: Carrinho cancelado
- mensagem: Nada foi cobrado. Abre o formulário de novo quando quiser jogar.

4) No ramo true: Code Marcar pago
- pega tickets daquele email+drawId com status awaiting_pix e muda para paid com paidAt agora.
- devolve o json anterior + pago: true

Conecta:
Reservar e PIX → Confirmar PIX → Pagou?
Pagou? true → Marcar pago
Pagou? false → Cancelado
```

---

## Prompt 6 — cola no Assistente

```
Depois de Marcar pago:

1) Form Espera do sorteio
- formTitle: Pagamento confirmado
- formDescription: fichas travadas + "Sorteio oficial às 18h (Brasília). Pode forçar agora no treino."
- dropdown E agora:
  - Forçar sorteio agora (treino)
  - Esperar o sorteio das 18h
- botão Seguir

2) IF Forçar?
- true se E agora = Forçar sorteio agora (treino)

3) false: Form completion Aguardar 18h
- título: Tá na fila do sorteio
- mensagem: Pagamento ok. O sorteio das 18h corre no cron. Sem dinheiro real.

4) true: Code Sortear
- pega o draw do usuário (drawId) ou o open
- se ainda não drawn: winningNumber = inteiro aleatório de 1 a 36, status drawn, drawnAt agora
- compara as fichas paid do e-mail com o winningNumber
- se acertou: titulo "Você ganhou", mensagem com ganho em R$ (ficha 5,00 × 18 = 90,00 por acerto)
- se errou: titulo "Você perdeu", mensagem "Boa sorte na próxima. Ganho R$ 0,00."
- inclui o nome do bicho sorteado (usa a lista 01 Avestruz … 36 Peixe)

5) Form completion Resultado
- completionTitle: {{ $json.titulo }}
- completionMessage: Bicho sorteado + mensagem de ganho ou boa sorte

Conecta:
Marcar pago → Espera do sorteio → Forçar?
Forçar? true → Sortear → Resultado
Forçar? false → Aguardar 18h

Timezone do workflow: America/Sao_Paulo.

No final adiciona um Schedule Trigger "Todo dia 18h" com cron 0 18 * * * ligado a um Code que sorteia todos os draws open cujo scheduledAt já passou, e cria o próximo draw open com as casas da casa ocupadas (3,7,11,16,22,28,32,35).
```

---

## Prompt extra — se a IA perguntar “posso executar?”

```
Não testes com dinheiro. É simulação. Publica o workflow. A URL de produção do Form Trigger Cadastro é o jogo. path 36-bichos.
```

---

## Conferência (depois que a IA terminar)

No canvas tem de existir, nesta ordem:

Cadastro → Registrar → Escolher bichos → Reservar e PIX → Confirmar PIX → Pagou? → Marcar pago → Espera do sorteio → Forçar? → Sortear → Resultado

Ramos: Pagou? não → Cancelado. Forçar? não → Aguardar 18h. Cron 18h → Code de sorteio.

Aí: **Publicar** → node Cadastro → URL do form → jogar.
