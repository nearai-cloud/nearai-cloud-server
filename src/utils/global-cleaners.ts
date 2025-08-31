export type Cleaner = () => void;

const globalCleaners: Cleaner[] = [];

export function addGlobalCleaners(cleaner: Cleaner) {
  globalCleaners.push(cleaner);
}

export function runGlobalCleaners() {
  globalCleaners.forEach((cleaner) => cleaner());
}
