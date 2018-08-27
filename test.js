const test = require('ava')
const cookie = require('cookie')
const nock = require('nock')
const jarGot = require('.')
const stream = require('stream')

test.before(t => {
  nock('http://test.com')
    .persist()
    .get('/')
    .reply(200, 'ok', {
      'Set-Cookie': Object.entries({a: 'hello', b: 'world'}).map(([k, v]) => cookie.serialize(k, v))
    })
})

const parseCookies = got => got.jar.getCookiesSync('http://test.com').map(cookie => cookie.cookieString())

test('basic response set-cookie', async t => {
  const got = jarGot()

  await got('http://test.com/')

  t.deepEqual(parseCookies(got), ['a=hello', 'b=world'])
})

test.cb('stream resposne set-cookie', t => {
  const got = jarGot()

  got.stream('http://test.com/')
    .pipe(stream.PassThrough())
    .on('finish', _ => {
      t.deepEqual(parseCookies(got), ['a=hello', 'b=world'])
      t.end()
    })
})

test('request with jar cookie', async t => {
  const got = jarGot()

  const res1 = await got('http://test.com/')
  t.falsy(res1.req.getHeader('cookie'))

  const res2 = await got('http://test.com/')
  t.is(res2.req.getHeader('cookie'), 'a=hello; b=world')
})

test('save, restore cookies', async t => {
  const got = jarGot()

  await got('http://test.com/')

  const restoredGot = jarGot.restore(got.save())
  t.deepEqual(parseCookies(restoredGot), ['a=hello', 'b=world'])
})
