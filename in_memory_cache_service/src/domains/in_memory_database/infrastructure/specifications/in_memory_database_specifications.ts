export function isHashOnDatabase(hash: { [x: string]: string }) {
  return Object.keys(hash).length !== 0;
}
