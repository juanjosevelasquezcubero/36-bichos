# 36 Bichos

Simulação educacional do tabuleiro de 36 animais: cadastro, várias fichas, PIX fictício e sorteio. **Não há dinheiro real.**

## Baixar o ZIP

No GitHub: botão verde **Code** → **Download ZIP**.

Link direto:
https://github.com/juanjosevelasquezcubero/36-bichos/archive/refs/heads/main.zip

## Rodar no VS Code

1. Instale [Node.js 22](https://nodejs.org/) (LTS).
2. Extraia o ZIP e abra a pasta no VS Code: **File → Open Folder**.
3. Terminal:

```bash
npm install
npm run dev
```

4. Abra http://localhost:8080

### Fluxo

- Criar conta (nome, e-mail, telefone, senha) ou entrar
- Marcar um ou mais bichos livres → carrinho → PIX simulado
- Depois do pagamento o tabuleiro volta com o cronômetro
- Às 18h (horário de Brasília) o sorteio roda sozinho
- Botão **Forçar sorteio agora (treino)** adianta o resultado
- Acerto paga 18× a ficha (R$ 5,00 → R$ 90,00)
