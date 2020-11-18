# abstract-pkce
Abstract PKCE service factory with ability to extend it with any challenge getter and random values api

## About
This is the base abstract package, not expected to be used directly in final application. 

Created as base abstract PKCE challenge & verifier generation implementation to be extended by next three packages with end implementations:

 * [simple-pkce](https://www.npmjs.com/package/simple-pkce) - simple PKCE implementation for node. Native `crypto` module used, KISS and DRY, ready for usage.
 * [simple-pkce-browser](https://www.npmjs.com/package/simple-pkce-browser) - for all browsers, including legacy ones, with leightweight polyfills for SHA256 and  generator of random bytes
 * [simple-pkce-web-crypto](https://www.npmjs.com/package/simple-pkce-web-crypto) - for modern browsers, using [`Web Crypto API`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) for both random bytes generating and SHA256 hashing
