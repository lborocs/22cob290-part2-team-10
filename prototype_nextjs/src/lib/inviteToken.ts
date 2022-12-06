import jwt from 'jsonwebtoken';

// use JWT to generate an invite token that contains the inviter's email as payload
// and expires a week from when it is generated

const getSecret = () => process.env.INVITETOKEN_SECRET as string;

/**
 * Returns a JWT token that is to be used as as invite token.
 *  - payload contains inviter email
 *  - can only be used once (is stored in database)
 *  - expires in a week from the date it was generated
 *
 * Don't set expiry date because if we do:
 *  - when trying to decode token in database, it'll likely be expired so decoding will fail
 *  - so we have to manually check it's been a week
 *
 * @note server-side only
 * @param email Inviter email
 * @returns JWT invite token
 */
export function getInviteToken(email: string): string {
  return jwt.sign({
    email,
  }, getSecret(), {
    expiresIn: '7d',
  });
}

/**
 * Retrieves the inviter's email from the provided `token`'s payload without verifying the token.
 *
 * Returns `null` if the token cannot be decoded.
 *
 * @param token
 * @returns The email contained in the token payload
 */
export function getEmailFromToken(token: string | null): string | null {
  const decoded = jwt.decode(token as string) as jwt.JwtPayload | null;
  return decoded?.email ?? null;
}

/**
 * Verifies the provided `token` and retrieves the inviter's email from the token's
 *  payload.
 *
 * Returns `null` if the token failed verification.
 *
 * @note server-side only
 * @param token
 * @returns
 */
export function getEmailFromTokenIfValid(token: string): string | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as jwt.JwtPayload;
    return decoded.email;
  } catch (err) {
    const e = err as jwt.JsonWebTokenError;
    // https://github.com/auth0/node-jsonwebtoken#errors--codes
    console.error(`${e.name}: ${e.message}`);
    return null;
  }
}
