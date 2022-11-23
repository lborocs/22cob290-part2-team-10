let count = 0;

// TODO: implement JWT
export function getInviteToken(email: string): string {
  console.log('count =', count);
  count++;
  return `token-${count}-{${email.substring(0, email.indexOf('@'))}}`;
}
