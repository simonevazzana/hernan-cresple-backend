const test = require('ava')
const { getSettings } = require('./settings')

test('Should return the settings for the test environment', t => {
  const settings = getSettings()

  t.deepEqual(settings, {
    mongoDbName: 'hernan-cresple-test',
    mongoUrl: 'mongodb://localhost:27017'
  })
})

test('Should return the settings for the development environment as default', t => {
  delete process.env.ENV
  delete process.env.NODE_ENV

  const settings = getSettings()

  t.deepEqual(settings, {
    mongoDbName: 'hernan-cresple',
    mongoUrl: 'mongodb://localhost:27017'
  })

  process.env.ENV = 'test'
  process.env.NODE_ENV = 'test'
})
