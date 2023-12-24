const test = require('ava')
const { normalizeLeagueString } = require('./string-utils')

test('normalizeLeagueString() should remove all spaces and turn all chars to lowerCase', t => {
  const str = 'SeRi E A te st coO l 22'

  const normalizedStr = normalizeLeagueString(str)

  t.is(normalizedStr, 'serieatestcool22')
})
