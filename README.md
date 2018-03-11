# jar-got
> convenience wrapper for got to persisting cookie

[![npm](https://img.shields.io/npm/v/jar-got.svg?style=flat-square)](https://www.npmjs.com/package/jar-got)
[![npm](https://img.shields.io/npm/dt/jar-got.svg?style=flat-square)](https://www.npmjs.com/package/jar-got)

## Install
```js
yarn add jar-got
```

## Usage
### Basic
```js
const jarGot = require('jar-got')
const got = jarGot()

(async _ => {
  await got('http://google.co.kr')
  // stores the response "set-cookie" header.

  await got('http://google.co.kr')
  // request "cookie" header is the stored cookies.
})()
```

### Using existing cookie jar.
```js
const got1 = jarGot()

const got2 = jarGot(got1.got) // got1.jar === got2.jar
```

### Serialize, deserialize
```js
// serialize
const serialized = got1.jar.serializeSync();

// deserialize
const {CookieJar} = require('tough-cookie');
const got2 = jarGot(CookieJar.deserializeSync(serialized))
```

## License
MIT