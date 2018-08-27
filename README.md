# jar-got
Wrapper for got to persisting cookies

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
const got = jarGot();

(async _ => {
  await got('http://google.co.kr') // First, stores the response set-cookie.
  await got('http://google.co.kr') // Second, request with the stored cookies.
})()
```

### Save and restore
```js
// serialize
const saved = got.save();

// deserialize
const restoredGot = jarGot.restore(saved)
```

### Using existing cookie jar.
```js
const got1 = jarGot()

const got2 = jarGot(got1.jar) // got1.jar === got2.jar
```

## License
MIT