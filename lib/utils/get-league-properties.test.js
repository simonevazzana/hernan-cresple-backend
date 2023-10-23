const test = require('ava')
const { getLeagueProperties, tierOneLeagues, tierTwoLeagues } = require('./get-league-properties')

test('All league properties should have the same data model', t => {
  Object.keys(getLeagueProperties).forEach(league => {
    t.deepEqual(Object.keys(getLeagueProperties[league]), [
      'finalSeasonBoard',
      'finalSeason',
      'leagueTier',
      'leagueToUrl',
      'normalized',
      'posLimit'
    ])
  })
})

test('Tier one leagues should be returned properly', t => {
  t.deepEqual(tierOneLeagues, [
    'bundesliga',
    'laliga',
    'ligue1',
    'premierleague',
    'seriea'
  ])
})

test('Tier two leagues should be returned properly', t => {
  t.deepEqual(tierTwoLeagues, [
    'eredivisie',
    'ligaportugal'
  ])
})
