const orgGot = require('got')
const {CookieJar} = require('tough-cookie')

const jarGot = module.exports = (jar = new CookieJar()) => {
  const got = (url, opts = {}) => {
    opts.headers = Object.assign({ cookie: jar.getCookieStringSync(url) }, opts.headers)

    const cookieHandler = res => {
      if (!res.headers['set-cookie']) return res

      for (const cookieStr of res.headers['set-cookie']) {
        jar.setCookieSync(cookieStr, url)
      }

      return res
    }

    if (opts.stream) {
      return orgGot.stream(url, opts).on('response', cookieHandler)
    }

    return orgGot(url, opts).then(cookieHandler)
  }

  got.jar = jar
  got.save = () => jar.serializeSync()

  const helpers = [
    'get',
    'post',
    'put',
    'patch',
    'head',
    'delete'
  ]

  got.stream = (url, opts) => got(url, Object.assign({}, opts, {
    json: false,
    stream: true
  }))

  for (const x of helpers) {
    const method = x.toUpperCase()
    got[x] = (url, opts) => got(url, Object.assign({}, opts, {method}))
    got.stream[x] = (url, opts) => got.stream(url, Object.assign({}, opts, {method}))
  }

  return got
}

jarGot.restore = (saved) => jarGot(CookieJar.deserializeSync(saved))
