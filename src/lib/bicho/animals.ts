export type Animal = {
  number: number;
  name: string;
  hook: string;
};

export const ANIMALS: Animal[] = [
  { number: 1, name: "Avestruz", hook: "Quem sai na frente, leva." },
  { number: 2, name: "Águia", hook: "Visão de cima. Decisão rápida." },
  { number: 3, name: "Burro", hook: "Teimoso. E teimoso ganha." },
  { number: 4, name: "Borboleta", hook: "Leve agora. Pesado no bolso depois." },
  { number: 5, name: "Cachorro", hook: "Fiel ao instinto." },
  { number: 6, name: "Cabra", hook: "Sobe onde os outros param." },
  { number: 7, name: "Carneiro", hook: "O sete puxa olho. Use isso." },
  { number: 8, name: "Camelo", hook: "Reserva energia. Explode na hora." },
  { number: 9, name: "Cobra", hook: "Silêncio. Depois o bote." },
  { number: 10, name: "Coelho", hook: "Rápido. Quase ninguém espera." },
  { number: 11, name: "Cavalo", hook: "Força bruta com direção." },
  { number: 12, name: "Elefante", hook: "Peso. Presença. Memória." },
  { number: 13, name: "Galo", hook: "Acorda o terreiro inteiro." },
  { number: 14, name: "Gato", hook: "Sete vidas. Uma ficha." },
  { number: 15, name: "Jacaré", hook: "Parado. Mortal." },
  { number: 16, name: "Leão", hook: "O rei não pede vez." },
  { number: 17, name: "Macaco", hook: "Joga com o imprevisível." },
  { number: 18, name: "Porco", hook: "Sorte gorda. Literalmente." },
  { number: 19, name: "Pavão", hook: "Quem brilha, é visto." },
  { number: 20, name: "Peru", hook: "Peito aberto. Coragem." },
  { number: 21, name: "Touro", hook: "Avança e o mercado respeita." },
  { number: 22, name: "Tigre", hook: "Listrado pra não passar batido." },
  { number: 23, name: "Urso", hook: "Devagar. Decide o jogo." },
  { number: 24, name: "Veado", hook: "Salta fora da trilha óbvia." },
  { number: 25, name: "Vaca", hook: "Clássico que ainda paga." },
  { number: 26, name: "Lobo", hook: "Caça em silêncio." },
  { number: 27, name: "Raposa", hook: "Esperta demais pra ser óbvia." },
  { number: 28, name: "Coruja", hook: "Vê o que o dia esconde." },
  { number: 29, name: "Tubarão", hook: "Cheiro de movimento." },
  { number: 30, name: "Golfinho", hook: "Inteligência com fluxo." },
  { number: 31, name: "Falcão", hook: "Mergulho certeiro." },
  { number: 32, name: "Pantera", hook: "Preto no preto. Elite." },
  { number: 33, name: "Rato", hook: "Subestimado. Perigoso." },
  { number: 34, name: "Pato", hook: "Calmo na superfície." },
  { number: 35, name: "Abelha", hook: "Trabalho. Mel. Resultado." },
  { number: 36, name: "Peixe", hook: "Água parada não é o seu jogo." },
];

export function getAnimal(n: number) {
  return ANIMALS.find((a) => a.number === n);
}
export function labelOf(n: number) {
  return String(n).padStart(2, "0");
}
export function recommendAvailable(taken: number[], preferred?: number) {
  const free = ANIMALS.filter((a) => !taken.includes(a.number));
  if (free.length === 0) return null;
  if (preferred) {
    return (
      free
        .slice()
        .sort((a, b) => Math.abs(a.number - preferred) - Math.abs(b.number - preferred))[0] ?? null
    );
  }
  return free[0] ?? null;
}
export const TICKET_PRICE_CENTS = 500;
export const PAYOUT_MULTIPLIER = 18;
export const DRAW_HOUR = 18;
export const HOUSE_USER_ID = "house";
