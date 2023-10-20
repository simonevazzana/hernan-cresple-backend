const test = require('ava')
const { build } = require('.')

test('Should return { status: \'OK\' } if the server is up and running', async t => {
  const app = build()

  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  t.deepEqual(response.json(), {
    status: 'OK'
  })
})
