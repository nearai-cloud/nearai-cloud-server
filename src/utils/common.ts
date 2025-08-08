export function toKeyAlias(userId: string, keyAliasDisplay: string): string {
  return `${userId}:${keyAliasDisplay}`;
}

export function toKeyAliasDisplay(userId: string, keyAlias: string): string {
  if (keyAlias.startsWith(`${userId}:`)) {
    return keyAlias.slice(userId.length + 1);
  } else {
    return keyAlias;
  }
}
