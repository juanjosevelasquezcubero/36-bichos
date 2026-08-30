Constrói AGORA o workflow completo chamado "36 Bichos — fluxo completo". Faz tudo neste pedido, sem perguntar, sem dividir em etapas, sem executar. Timezone do workflow: America/Sao_Paulo. É simulação educacional, sem dinheiro real.

Cria e liga TODOS estes nodes, nesta ordem e com estes nomes exactos:

1) Sticky Note "LEIA ISTO"
Texto: Publicar o fluxo. Clicar no node Cadastro. Abrir a URL de produção do formulário no navegador. Não usar o botão Executar no meio do jogo. Sorteio às 18h Brasília.

2) Form Trigger "Cadastro"
path: 36-bichos
formTitle: 36 Bichos — Cadastro
formDescription: Simulação educacional. Sem dinheiro real. Se já tens conta, usa o mesmo e-mail e senha.
botão: Entrar no terreiro
campos obrigatórios:
- Nome completo (text)
- E-mail (email)
- Telefone (text)
- Senha (password)

3) Code "Registrar"
4) Form "Escolher bichos"
5) Code "Reservar e PIX"
6) Form "Confirmar PIX"
7) IF "Pagou?"
8) Form completion "Cancelado"
9) Code "Marcar pago"
10) Form "Espera do sorteio"
11) IF "Forçar?"
12) Form completion "Aguardar 18h"
13) Code "Sortear"
14) Form completion "Resultado"
15) Schedule Trigger "Todo dia 18h" com cron 0 18 * * *
16) Code "Sortear abertos"

Ligações:
Cadastro → Registrar → Escolher bichos → Reservar e PIX → Confirmar PIX → Pagou?
Pagou? TRUE → Marcar pago → Espera do sorteio → Forçar?
Pagou? FALSE → Cancelado
Forçar? TRUE → Sortear → Resultado
Forçar? FALSE → Aguardar 18h
Todo dia 18h → Sortear abertos

Os 36 animais (número e nome), usa em todos os codes e no dropdown:
01 Avestruz, 02 Águia, 03 Burro, 04 Borboleta, 05 Cachorro, 06 Cabra, 07 Carneiro, 08 Camelo, 09 Cobra, 10 Coelho, 11 Cavalo, 12 Elefante, 13 Galo, 14 Gato, 15 Jacaré, 16 Leão, 17 Macaco, 18 Porco, 19 Pavão, 20 Peru, 21 Touro, 22 Tigre, 23 Urso, 24 Veado, 25 Vaca, 26 Lobo, 27 Raposa, 28 Coruja, 29 Tubarão, 30 Golfinho, 31 Falcão, 32 Pantera, 33 Rato, 34 Pato, 35 Abelha, 36 Peixe.

Regras de negócio em todos os codes:
- Persistência só com $getWorkflowStaticData('global'): users, tickets, draws, seq.
- NÃO uses require('crypto'). Hash da senha com FNV:

function hash(pw, salt) {
  const s = String(salt) + '|' + String(pw);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}

- Ficha custa 500 centavos (R$ 5,00). Acerto paga 18 vezes (R$ 90,00 por ficha).
- Casas da casa já ocupadas em cada sorteio novo: 3, 7, 11, 16, 22, 28, 32, 35.
- Sorteio aberto status open, horário 18:00 America/Sao_Paulo. Se não existir, cria. Se o horário já passou, cria o do dia seguinte.
- Se o animal escolhido já estiver comprado por outro e-mail neste sorteio, NÃO vende esse número: troca pelo bicho livre mais próximo e avisa "01 ocupado. Trocamos por 02 Águia."
- Pode escolher vários bichos de uma vez.
- PIX é fictício: payload EMV, chave simulacao-educacional@local, nome 36 BICHOS SIM, cidade PORTO ALEGRE, moeda 986, CRC16. Não cobra dinheiro de verdade.

Node Escolher bichos:
formTitle Escolhe os bichos
formDescription ={{ $json.aviso }}
dropdown Bichos, multiselect true, obrigatório, opções exactamente "01 — Avestruz" até "36 — Peixe"
botão: Ir ao carrinho / PIX

Node Confirmar PIX:
formTitle PIX simulado
formDescription mostra fichas, total, ganho 18× e {{ $json.payload }}
dropdown Confirmação: "Já paguei (simulação)" e "Cancelar"
botão Continuar

IF Pagou?: {{ $json.Confirmação }} igual a Já paguei (simulação)

Cancelado (completion): título Carrinho cancelado. Mensagem: Nada foi cobrado.

Marcar pago: tickets daquele email+drawId com status awaiting_pix passam a paid com paidAt agora.

Espera do sorteio:
formTitle Pagamento confirmado
formDescription fichas travadas + sorteio 18h Brasília
dropdown E agora: "Forçar sorteio agora (treino)" e "Esperar o sorteio das 18h"

IF Forçar?: {{ $json['E agora'] }} igual a Forçar sorteio agora (treino)

Aguardar 18h (completion): título Tá na fila do sorteio.

Sortear: se o draw ainda não é drawn, winningNumber aleatório de 1 a 36. Se alguma ficha paid do utilizador acertou: titulo Você ganhou e mostra o ganho em reais (5,00 × 18). Se errou: titulo Você perdeu e "Boa sorte na próxima. Ganho R$ 0,00." Inclui o nome do bicho sorteado.

Resultado (completion):
completionTitle ={{ $json.titulo }}
completionMessage ={{ 'Bicho sorteado: ' + $json.bicho + '\n\n' + $json.mensagem }}

Sortear abertos (cron): todos os draws open com scheduledAt já passado ficam drawn com número 1–36; garante um novo draw open com as casas da casa ocupadas.

Cola este código no node Registrar:

const ANIMALS = [{"n":1,"name":"Avestruz"},{"n":2,"name":"Águia"},{"n":3,"name":"Burro"},{"n":4,"name":"Borboleta"},{"n":5,"name":"Cachorro"},{"n":6,"name":"Cabra"},{"n":7,"name":"Carneiro"},{"n":8,"name":"Camelo"},{"n":9,"name":"Cobra"},{"n":10,"name":"Coelho"},{"n":11,"name":"Cavalo"},{"n":12,"name":"Elefante"},{"n":13,"name":"Galo"},{"n":14,"name":"Gato"},{"n":15,"name":"Jacaré"},{"n":16,"name":"Leão"},{"n":17,"name":"Macaco"},{"n":18,"name":"Porco"},{"n":19,"name":"Pavão"},{"n":20,"name":"Peru"},{"n":21,"name":"Touro"},{"n":22,"name":"Tigre"},{"n":23,"name":"Urso"},{"n":24,"name":"Veado"},{"n":25,"name":"Vaca"},{"n":26,"name":"Lobo"},{"n":27,"name":"Raposa"},{"n":28,"name":"Coruja"},{"n":29,"name":"Tubarão"},{"n":30,"name":"Golfinho"},{"n":31,"name":"Falcão"},{"n":32,"name":"Pantera"},{"n":33,"name":"Rato"},{"n":34,"name":"Pato"},{"n":35,"name":"Abelha"},{"n":36,"name":"Peixe"}];
function store(){const s=$getWorkflowStaticData('global');if(!s.users)s.users={};if(!s.tickets)s.tickets=[];if(!s.draws)s.draws=[];if(!s.seq)s.seq=1;return s;}
function hash(pw,salt){const s=String(salt)+'|'+String(pw);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
function pad(n){return String(n).padStart(2,'0');}
function nextDrawIso(){const now=new Date();const sp=new Date(now.getTime()-180*60*1000);let t=Date.UTC(sp.getUTCFullYear(),sp.getUTCMonth(),sp.getUTCDate(),21,0,0,0);if(t<=now.getTime())t+=86400000;return new Date(t).toISOString();}
function openDraw(s){let d=s.draws.find(x=>x.status==='open');if(d)return d;d={id:++s.seq,scheduledAt:nextDrawIso(),status:'open',winningNumber:null,drawnAt:null};s.draws.push(d);for(const n of [3,7,11,16,22,28,32,35]){s.tickets.push({id:++s.seq,email:'house',drawId:d.id,animalNumber:n,status:'paid',priceCents:500});}return d;}
function taken(s,drawId){return s.tickets.filter(t=>t.drawId===drawId&&['cart','awaiting_pix','paid'].includes(t.status)).map(t=>t.animalNumber);}
const j=$input.first().json;
const name=String(j['Nome completo']||j.Nome||'').trim();
const email=String(j['E-mail']||j.Email||'').trim().toLowerCase();
const phone=String(j.Telefone||'').replace(/\D/g,'');
const password=String(j.Senha||'');
if(name.length<3)throw new Error('Nome com no mínimo 3 letras.');
if(!email.includes('@'))throw new Error('E-mail inválido.');
if(phone.length<10)throw new Error('Telefone incompleto.');
if(password.length<8)throw new Error('Senha com no mínimo 8 caracteres.');
const s=store();
if(s.users[email]){if(s.users[email].passwordHash!==hash(password,s.users[email].salt))throw new Error('Conta já existe e a senha não confere.');}
else{const salt=Date.now().toString(36)+Math.random().toString(36).slice(2);s.users[email]={name,email,phone,salt,passwordHash:hash(password,salt),createdAt:new Date().toISOString()};}
const draw=openDraw(s);
const ocupados=taken(s,draw.id);
const livres=ANIMALS.filter(a=>!ocupados.includes(a.n)).map(a=>pad(a.n)+' '+a.name).join(', ');
const aviso='Casas ocupadas: '+ocupados.map(pad).join(', ')+'. Livres: '+livres+'. Marca um ou vários. Se o teu já tiver dono, o sistema troca por um palpite livre. Ficha R$ 5,00. Acerto paga 18× (R$ 90,00). Simulação, sem dinheiro real.';
return [{json:{email,name,phone,drawId:draw.id,aviso,taken:ocupados}}];

Cola este código no node Reservar e PIX:

const ANIMALS = [{"n":1,"name":"Avestruz"},{"n":2,"name":"Águia"},{"n":3,"name":"Burro"},{"n":4,"name":"Borboleta"},{"n":5,"name":"Cachorro"},{"n":6,"name":"Cabra"},{"n":7,"name":"Carneiro"},{"n":8,"name":"Camelo"},{"n":9,"name":"Cobra"},{"n":10,"name":"Coelho"},{"n":11,"name":"Cavalo"},{"n":12,"name":"Elefante"},{"n":13,"name":"Galo"},{"n":14,"name":"Gato"},{"n":15,"name":"Jacaré"},{"n":16,"name":"Leão"},{"n":17,"name":"Macaco"},{"n":18,"name":"Porco"},{"n":19,"name":"Pavão"},{"n":20,"name":"Peru"},{"n":21,"name":"Touro"},{"n":22,"name":"Tigre"},{"n":23,"name":"Urso"},{"n":24,"name":"Veado"},{"n":25,"name":"Vaca"},{"n":26,"name":"Lobo"},{"n":27,"name":"Raposa"},{"n":28,"name":"Coruja"},{"n":29,"name":"Tubarão"},{"n":30,"name":"Golfinho"},{"n":31,"name":"Falcão"},{"n":32,"name":"Pantera"},{"n":33,"name":"Rato"},{"n":34,"name":"Pato"},{"n":35,"name":"Abelha"},{"n":36,"name":"Peixe"}];
function store(){const s=$getWorkflowStaticData('global');if(!s.users)s.users={};if(!s.tickets)s.tickets=[];if(!s.draws)s.draws=[];if(!s.seq)s.seq=1;return s;}
function pad(n){return String(n).padStart(2,'0');}
function animal(n){return ANIMALS.find(a=>a.n===n);}
function taken(s,drawId){return s.tickets.filter(t=>t.drawId===drawId&&['cart','awaiting_pix','paid'].includes(t.status)).map(t=>t.animalNumber);}
function money(cents){return (cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function emv(id,value){return id+String(value.length).padStart(2,'0')+value;}
function crc16(payload){let crc=0xffff;for(let i=0;i<payload.length;i++){crc^=payload.charCodeAt(i)<<8;for(let b=0;b<8;b++)crc=(crc&0x8000)?((crc<<1)^0x1021):(crc<<1),crc&=0xffff;}return crc.toString(16).toUpperCase().padStart(4,'0');}
function pix(txid,cents){const amount=(cents/100).toFixed(2);const gui=emv('00','BR.GOV.BCB.PIX')+emv('01','simulacao-educacional@local');const add=emv('05',String(txid).slice(0,25));const base=emv('00','01')+emv('01','12')+emv('26',gui)+emv('52','0000')+emv('53','986')+emv('54',amount)+emv('58','BR')+emv('59','36 BICHOS SIM')+emv('60','PORTO ALEGRE')+emv('62',add)+'6304';return base+crc16(base);}
const prev=$input.first().json;
const raw=prev.Bichos||prev.bichos||[];
const list=Array.isArray(raw)?raw:String(raw).split(',');
function num(v){const m=String(v).match(/(\d+)/);return m?Number(m[1]):0;}
const nums=[...new Set(list.map(num).filter(n=>n>=1&&n<=36))];
if(!nums.length)throw new Error('Escolhe pelo menos um bicho.');
const s=store();
const drawId=prev.drawId;
const email=prev.email;
const msgs=[];
for(const n of nums){
  const clash=s.tickets.find(t=>t.drawId===drawId&&t.animalNumber===n&&t.email!==email&&['cart','awaiting_pix','paid'].includes(t.status));
  if(clash){
    const ocup=taken(s,drawId);
    const free=ANIMALS.filter(a=>!ocup.includes(a.n)).sort((a,b)=>Math.abs(a.n-n)-Math.abs(b.n-n));
    const sug=free[0];
    if(sug){s.tickets.push({id:++s.seq,email,drawId,animalNumber:sug.n,status:'cart',priceCents:500,pixTxid:null});msgs.push(pad(n)+' ocupado. Trocamos por '+pad(sug.n)+' '+sug.name+'.');}
    else msgs.push(pad(n)+' ocupado e não há livre.');
    continue;
  }
  const mine=s.tickets.find(t=>t.drawId===drawId&&t.email===email&&t.animalNumber===n);
  if(!mine)s.tickets.push({id:++s.seq,email,drawId,animalNumber:n,status:'cart',priceCents:500,pixTxid:null});
}
const mine=s.tickets.filter(t=>t.email===email&&t.drawId===drawId);
const total=mine.reduce((a,t)=>a+t.priceCents,0);
const txid='SIM'+Date.now().toString(36).toUpperCase();
mine.forEach(t=>{t.status='awaiting_pix';t.pixTxid=txid;});
const nomes=mine.map(t=>pad(t.animalNumber)+' '+(animal(t.animalNumber)||{}).name).join(' · ');
return [{json:{...prev,msgs:msgs.join(' '),nomes,total,totalFmt:money(total),payload:pix(txid,total),txid,ganho:money(500*18)}}];

Cola este código no node Marcar pago:

const s=$getWorkflowStaticData('global');
const prev=$input.first().json;
s.tickets.filter(t=>t.email===prev.email&&t.drawId===prev.drawId&&t.status==='awaiting_pix').forEach(t=>{t.status='paid';t.paidAt=new Date().toISOString();});
return [{json:{...prev,pago:true}}];

Cola este código no node Sortear:

const ANIMALS = [{"n":1,"name":"Avestruz"},{"n":2,"name":"Águia"},{"n":3,"name":"Burro"},{"n":4,"name":"Borboleta"},{"n":5,"name":"Cachorro"},{"n":6,"name":"Cabra"},{"n":7,"name":"Carneiro"},{"n":8,"name":"Camelo"},{"n":9,"name":"Cobra"},{"n":10,"name":"Coelho"},{"n":11,"name":"Cavalo"},{"n":12,"name":"Elefante"},{"n":13,"name":"Galo"},{"n":14,"name":"Gato"},{"n":15,"name":"Jacaré"},{"n":16,"name":"Leão"},{"n":17,"name":"Macaco"},{"n":18,"name":"Porco"},{"n":19,"name":"Pavão"},{"n":20,"name":"Peru"},{"n":21,"name":"Touro"},{"n":22,"name":"Tigre"},{"n":23,"name":"Urso"},{"n":24,"name":"Veado"},{"n":25,"name":"Vaca"},{"n":26,"name":"Lobo"},{"n":27,"name":"Raposa"},{"n":28,"name":"Coruja"},{"n":29,"name":"Tubarão"},{"n":30,"name":"Golfinho"},{"n":31,"name":"Falcão"},{"n":32,"name":"Pantera"},{"n":33,"name":"Rato"},{"n":34,"name":"Pato"},{"n":35,"name":"Abelha"},{"n":36,"name":"Peixe"}];
function store(){const s=$getWorkflowStaticData('global');if(!s.users)s.users={};if(!s.tickets)s.tickets=[];if(!s.draws)s.draws=[];if(!s.seq)s.seq=1;return s;}
function pad(n){return String(n).padStart(2,'0');}
function animal(n){return ANIMALS.find(a=>a.n===n);}
function money(cents){return (cents/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
const prev=$input.first().json;
const s=store();
const draw=s.draws.find(d=>d.id===prev.drawId)||s.draws.find(d=>d.status==='open');
if(!draw)throw new Error('Sorteio não encontrado.');
if(draw.status!=='drawn'){draw.status='drawn';draw.winningNumber=Math.floor(Math.random()*36)+1;draw.drawnAt=new Date().toISOString();}
const w=draw.winningNumber;
const winA=animal(w);
const mine=s.tickets.filter(t=>t.email===prev.email&&t.drawId===draw.id&&t.status==='paid');
const hits=mine.filter(t=>t.animalNumber===w);
const won=hits.length>0;
const ganho=hits.reduce((a,t)=>a+t.priceCents*18,0);
const fichas=mine.map(t=>pad(t.animalNumber)+' '+(animal(t.animalNumber)||{}).name).join(', ');
return [{json:{titulo:won?'Você ganhou':'Você perdeu',bicho:pad(w)+' '+(winA?winA.name:''),mensagem:won?('Seu ganho: '+money(ganho)+'. Ficha R$ 5,00 × 18.'):('Boa sorte na próxima. Suas fichas: '+fichas+'. Ganho R$ 0,00.'),won}}];

Cola este código no node Sortear abertos:

const s=$getWorkflowStaticData('global');
if(!s.tickets)s.tickets=[];if(!s.draws)s.draws=[];if(!s.seq)s.seq=1;
const now=Date.now();
for(const d of s.draws.filter(x=>x.status==='open'&&new Date(x.scheduledAt).getTime()<=now)){d.status='drawn';d.winningNumber=Math.floor(Math.random()*36)+1;d.drawnAt=new Date().toISOString();}
if(!s.draws.find(x=>x.status==='open')){
  const sp=new Date(Date.now()-180*60*1000);
  let t=Date.UTC(sp.getUTCFullYear(),sp.getUTCMonth(),sp.getUTCDate(),21,0,0,0);
  if(t<=Date.now())t+=86400000;
  const d={id:++s.seq,scheduledAt:new Date(t).toISOString(),status:'open',winningNumber:null,drawnAt:null};
  s.draws.push(d);
  for(const n of [3,7,11,16,22,28,32,35])s.tickets.push({id:++s.seq,email:'house',drawId:d.id,animalNumber:n,status:'paid',priceCents:500});
}
return [{json:{ok:true}}];

Não apagues nodes. Não testes com dinheiro. Quando terminares, o canvas tem de ter o fluxo inteiro ligado. Eu publico depois e abro a URL do Cadastro.
