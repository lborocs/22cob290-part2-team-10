import Hashids from 'hashids';

const PEPPER = 'Team-10-Group-Project-Part-2';

/**
 * `Hashids` with the same salt for each instance, so that the masked IDs are unique, but
 * consistent.
 */
const hashids = new Hashids(PEPPER, 6);
export default hashids;

// hashids with strings: https://stackoverflow.com/a/27137224
export function encodeString(str: string): string {
  const hex = Buffer.from(str, 'utf8').toString('hex');

  const encoded = hashids.encodeHex(hex);

  return encoded;
}

export function decodeString(encoded: string): string {
  const decodedHex = hashids.decodeHex(encoded);

  const decoded = Buffer.from(decodedHex, 'hex').toString('utf8');

  return decoded;
}
