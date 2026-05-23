import { SignJWT } from 'jose'

const SSO_SECRET = import.meta.env.VITE_SSO_SECRET || ''
const SSO_ENDPOINT = import.meta.env.VITE_SSO_ENDPOINT || 'https://learn.adroadomain.com/sso/login'

/**
 * Generate a signed SSO token for seamless LearnHouse login.
 * The token is short-lived (60s) and contains the user's email and name.
 */
export async function generateSsoToken(
  email: string,
  firstName: string,
  lastName: string,
): Promise<string> {
  const secret = new TextEncoder().encode(SSO_SECRET)

  const token = await new SignJWT({
    sub: email,
    email,
    first_name: firstName,
    last_name: lastName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('60s')
    .sign(secret)

  return token
}

/**
 * Build a full SSO redirect URL that will log the user into LearnHouse
 * and redirect them to the specified path.
 */
export function buildSsoUrl(token: string, redirectPath: string): string {
  const params = new URLSearchParams({ token, redirect: redirectPath })
  return `${SSO_ENDPOINT}?${params.toString()}`
}

/**
 * Open a LearnHouse page with SSO authentication.
 * Generates a token, builds the SSO URL, and opens it in a new tab.
 */
export async function openWithSso(
  email: string,
  firstName: string,
  lastName: string,
  redirectPath: string,
): Promise<void> {
  if (!SSO_SECRET) {
    // Fallback: open directly without SSO
    window.open(`https://learn.adroadomain.com${redirectPath}`, '_blank')
    return
  }

  const token = await generateSsoToken(email, firstName, lastName)
  const url = buildSsoUrl(token, redirectPath)
  window.open(url, '_blank')
}

/**
 * Check if SSO is configured (secret is available).
 */
export function isSsoEnabled(): boolean {
  return !!SSO_SECRET
}
