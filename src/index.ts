export interface PKCEChallenge {
  verifier: string
  challenge: string
}

export interface PKCEService <T extends (Promise<string> | string)> {
  getChallenge(verifier: string): T extends Promise<string> ? Promise<string> : string,
  generateChallenge(verifierLength: number): T extends Promise<string> ? Promise<PKCEChallenge> : PKCEChallenge
}

export type VerifierBuilder = (
  verifierLength: number, possibleCharsCount: number, getPossibleChar: (position: number) => string
) => string

const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._`-'
const { length: possibleCharsLength } = POSSIBLE_CHARS
const getPossibleChar: (position: number) => string = String.prototype.charAt.bind(POSSIBLE_CHARS)

export function createPKCEService<T extends (Promise<string> | string)>(
  getChallenge: PKCEService<T>['getChallenge'], buildVerifier: VerifierBuilder): PKCEService<T> {
  return {
    getChallenge,
    generateChallenge(verifierLength: number): T extends Promise<string> ? Promise<PKCEChallenge> : PKCEChallenge {
      const verifier = buildVerifier(verifierLength, possibleCharsLength, getPossibleChar)
      const challengeOrPromise: Promise<string> | string = getChallenge(verifier)
      const result: Promise<PKCEChallenge> | PKCEChallenge = (typeof challengeOrPromise === 'string')
        ? { verifier, challenge: challengeOrPromise }
        : challengeOrPromise.then((challenge) => ({ verifier, challenge }))

      return result as any
    },
  }
}
