const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')
const { easyModePlayers, hardModePlayers } = require('../test-fixtures/chain-start-fixtures')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  await Players.deleteMany({})

  const players = [
    ...easyModePlayers,
    ...hardModePlayers
  ]

  await Players.insertMany(players)
})

test('Should throw if no name is specified', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/player-search',
    body: {
    }
  })

  t.is(response.statusCode, 400)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: 'body must have required property \'name\'',
    statusCode: 400
  })
})

test('Should return all players that match the name in input, only display certain attributes', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/player-search',
    body: {
      name: 'an'
    }
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()

  t.deepEqual(responseJson, [
    {
      allTeams: [
        {
          league: 'seriea',
          name: 'US Palermo 2015/2016',
          position: 16,
          relevancy: 40,
          season: 2015,
          teamId: '458'
        }
      ],
      name: 'Franco Vázquez',
      playerId: '76163'
    },
    {
      allTeams: [
        {
          league: 'seriea',
          name: 'Chievo Verona 2016/2017',
          position: 14,
          relevancy: 48,
          season: 2016,
          teamId: '862'
        },
        {
          league: 'seriea',
          name: 'US Palermo 2015/2016',
          position: 16,
          relevancy: 40,
          season: 2015,
          teamId: '458'
        }
      ],
      name: 'Stefano Sorrentino',
      playerId: '21891'
    }
  ])
})

test('Should return an empty array with an empty string as a name in input', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/player-search',
    body: {
      name: ''
    }
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()

  t.deepEqual(responseJson, [])
})
