const globalIntervals: NodeJS.Timeout[] = [];

export function addGlobalInterval(interval: NodeJS.Timeout) {
  globalIntervals.push(interval);
}

export function clearGlobalIntervals() {
  globalIntervals.forEach((interval) => clearInterval(interval));
}
