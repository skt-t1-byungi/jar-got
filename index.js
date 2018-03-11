const got = require('got')
const tough = require('tough-cookie')

module.exports = (
  jar = new tough.CookieJar()
) => {
  const jarGot = (url, opts = {}) => {
    opts.headers = Object.assign({ cookie: jar.getCookieStringSync(url) }, opts.headers)

    const setCookieHandler = res => {
      if (!res.headers['set-cookie']) return

      for (const cookieStr of res.headers['set-cookie']) {
        jar.setCookieSync(cookieStr, url)
      }
    }

    if (opts.stream) {
      return got.stream(url, opts).on('response', setCookieHandler)
    }

    const request = got(url, opts)
    request.then(setCookieHandler)

    return request
  }

  jarGot.jar = jar

  const helpers = [
    'get',
    'post',
    'put',
    'patch',
    'head',
    'delete'
  ]

  jarGot.stream = (url, opts) => jarGot(url, Object.assign({}, opts, {
    json: false,
    stream: true
  }))

  for (const x of helpers) {
    const method = x.toUpperCase()
    jarGot[x] = (url, opts) => jarGot(url, Object.assign({}, opts, {method}))
    jarGot.stream[x] = (url, opts) => jarGot.stream(url, Object.assign({}, opts, {method}))
  }

  return jarGot
}
