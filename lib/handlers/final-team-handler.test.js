const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')
const { easyModePlayers } = require('../test-fixtures/board-generation-fixtures')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  await Players.deleteMany({})

  const players = [
    ...easyModePlayers
  ]

  await Players.insertMany(players)
})

test('Should throw if no playerId is specified', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/final-team',
    body: {
    }
  })

  t.is(response.statusCode, 400)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: 'body must have required property \'playerId\'',
    statusCode: 400
  })
})

test('Should throw if the startId is not linked to any player on the database', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/final-team',
    body: {
      playerId: '10000'
    }
  })

  t.is(response.statusCode, 500)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    error: 'Internal Server Error',
    message: 'No player exists linked to playerId 10000',
    statusCode: 500
  })
})

test('Should throw if the player hasn\'t played for any team', async t => {
  const newPlayer = {
    active: true,
    allTeams: [],
    boardTeams: [],
    name: 'Test Player',
    playerId: '10000',
    teamMates: []
  }

  const db = await startDb()

  const Players = db.collection('players')
  await Players.insertOne(newPlayer)

  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/final-team',
    body: {
      playerId: '10000'
    }
  })

  t.is(response.statusCode, 500)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    error: 'Internal Server Error',
    message: 'The player doesn\'t seem to have played for any teams',
    statusCode: 500
  })
})

test('Should return the final team that a player has played for', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/final-team',
    body: {
      playerId: '84535'
    }
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    league: 'ligaportugal',
    name: 'SL Benfica 2016/2017',
    position: 1,
    relevancy: 50,
    season: 2016,
    teamId: '294'
  })
})
