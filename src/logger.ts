const logs: string[] = [];

export function log(message: string) {
  console.log(message);
  logs.push(message);
}

export function clearLogs() {
  logs.length = 0;
}

export function isLogEmpty() {
  return logs.length === 0;
}

export function getLogs() {
  return [...logs]; // Return a copy instead of freezing the original array
}
