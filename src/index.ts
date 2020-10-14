export interface PKCEChallenge {
  verifier: string
  challenge: string
}

export interface PKCEHelper <T extends (Promise<string> | string)> {
  getChallenge(verifier: string): T extends Promise<string> ? Promise<string> : string,
  generateChallenge(verifierLength: number): T extends Promise<string> ? Promise<PKCEChallenge> : PKCEChallenge
}

export interface PKCEImplementation<T extends (Promise<string> | string)> {
  getChallenge: PKCEHelper<T>['getChallenge'],
  buildVerifier: (
    verifierLength: number, possibleCharsCount: number, getPossibleChar: (position: number) => string
  ) => string
}

const POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._`-'
const { length: possibleCharsLength } = POSSIBLE_CHARS
const getPossibleChar: (position: number) => string = String.prototype.charAt.bind(POSSIBLE_CHARS)

export function createPKCEHelper<T extends (Promise<string> | string)>(
  { getChallenge, buildVerifier }: PKCEImplementation<T>): PKCEHelper<T> {
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
