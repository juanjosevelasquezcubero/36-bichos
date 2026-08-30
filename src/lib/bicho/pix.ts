function emv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildSimulatedPix(txid: string, amountCents: number): string {
  const amount = (amountCents / 100).toFixed(2);
  const gui = emv("00", "BR.GOV.BCB.PIX") + emv("01", "simulacao-educacional@local");
  const additional = emv("05", txid.slice(0, 25));
  const base =
    emv("00", "01") +
    emv("01", "12") +
    emv("26", gui) +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amount) +
    emv("58", "BR") +
    emv("59", "36 BICHOS SIM") +
    emv("60", "PORTO ALEGRE") +
    emv("62", additional) +
    "6304";
  return base + crc16(base);
}
