# 36 Bichos no n8n

Simulação educacional: 36 animais, cadastro, várias fichas, PIX fictício e sorteio às 18h. **Não há dinheiro real.**

## Importar

No n8n: **⋯ → Import from File** e escolha:

| Arquivo | O que é |
|---|---|
| [36-bichos-formularios.json](./36-bichos-formularios.json) | Jogo em formulários nativos |
| [36-bichos-app.json](./36-bichos-app.json) | Tela completa (webhook HTML + API + cron) |
| [36-bichos-sorteio.json](./36-bichos-sorteio.json) | Cron 18h avulso (opcional) |

Ative o workflow. Detalhes em [COMO-IMPORTAR.txt](./COMO-IMPORTAR.txt).

## Fluxo

Cadastro (nome, e-mail, telefone, senha) → vários bichos livres → se ocupado, palpite livre → carrinho → PIX simulado → espera → sorteio → **Você ganhou** (18×) ou **Boa sorte na próxima**.
