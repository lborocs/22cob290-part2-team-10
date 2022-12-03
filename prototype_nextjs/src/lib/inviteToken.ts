// TODO: implement JWT
// or maybe a different method that gives a shorter URL
// (compression algorithm?)

let count = 0;

/**
 * Returns a JWT token that is to be used as as invite token
 *
 * @param email Inviter email
 * @returns JWT invite token
 */
export function getInviteToken(email: string): string {
  count++;
  return `token-${count}-{${email.substring(0, email.indexOf('@'))}}`;
}
