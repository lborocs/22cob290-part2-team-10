import jwt from 'jsonwebtoken';

// use JWT to generate an invite token that contains the inviter's email as payload
// and expires a week from when it is generated

/**
 * Returns a JWT token that is to be used as as invite token.
 *  - can only be used once
 *  - expires in a week from the date it was generated
 *
 * @note server-side only
 * @param email Inviter email
 * @returns JWT invite token
 */
export function getInviteToken(email: string): string {
  const secret = process.env.INVITETOKEN_SECRET as string;

  return jwt.sign({
    email,
  }, secret, {
    expiresIn: '20s',
  });
}

/**
 * Decodes the provided token.
 *
 * @note server-side only
 * @param token
 * @returns The email contained in the token payload
 */
export function getEmailFromToken(token: string): string | null {
  const secret = process.env.INVITETOKEN_SECRET as string;

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return decoded.email;
  } catch (err) {
    // could be one of: expired, incorrect secret, etc.
    console.error(err);
    return null;
  }
}
