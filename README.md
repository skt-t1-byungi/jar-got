# jar-got
convenience wrapper for got to persisting cookie

## Install
```js
yarn add jar-got
```

## Usage
### Basic
```js
const jarGot = require('jar-got')
const got = jarGot()

got('http://google.co.kr')
```

### Using existing cookie jar.
```js
const tough = require('tough-cookie')
const cookieJar = new tough.CookieJar();
const got = jarGot(cookieJar) // got.jar === cookieJar
```

## License
MIT