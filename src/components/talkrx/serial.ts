export function generateSerialNumber(existingSerials: string[]): string {
  let candidate: string;
  do {
    candidate = String(Math.floor(10_000_000 + Math.random() * 90_000_000));
  } while (existingSerials.includes(candidate));
  return candidate;
}

export function isValidSerial(serial: string): boolean {
  return /^\d{8}$/.test(serial.trim());
}

export function formatSerial(serial: string): string {
  return serial.replace(/(\d{4})(\d{4})/, "$1 $2");
}
