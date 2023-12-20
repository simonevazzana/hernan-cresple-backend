const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  await Players.deleteMany({})

  const players = [
    {
      active: true,
      allTeams: [
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2022/2023',
          position: 1,
          relevancy: 100,
          season: 2022,
          teamId: '27'
        },
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2021/2022',
          position: 1,
          relevancy: 100,
          season: 2021,
          teamId: '27'
        }
      ],
      boardTeams: [
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2022/2023',
          position: 1,
          relevancy: 100,
          season: 2022,
          teamId: '27'
        },
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2021/2022',
          position: 1,
          relevancy: 100,
          season: 2021,
          teamId: '27'
        }
      ],
      name: 'Joshua Kimmich',
      playerId: '161056',
      teamMates: [
        {
          name: 'Matthijs de Ligt',
          playerId: '326031'
        },
        {
          name: 'Niklas Süle',
          playerId: '166601'
        }
      ]
    },
    {
      active: true,
      allTeams: [
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2022/2023',
          position: 1,
          relevancy: 100,
          season: 2022,
          teamId: '27'
        }
      ],
      boardTeams: [
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2022/2023',
          position: 1,
          relevancy: 100,
          season: 2022,
          teamId: '27'
        }
      ],
      name: 'Matthijs de Ligt',
      playerId: '326031',
      teamMates: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056'
        }
      ]
    },
    {
      active: true,
      allTeams: [
        {
          league: 'bundesliga',
          name: 'Borussia Dortmund 2022/2023',
          position: 2,
          relevancy: 96,
          season: 2022,
          teamId: '16'
        },
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2021/2022',
          position: 1,
          relevancy: 100,
          season: 2021,
          teamId: '27'
        }
      ],
      boardTeams: [
        {
          league: 'bundesliga',
          name: 'Borussia Dortmund 2022/2023',
          position: 2,
          relevancy: 96,
          season: 2022,
          teamId: '16'
        },
        {
          league: 'bundesliga',
          name: 'Bayern Munich 2021/2022',
          position: 1,
          relevancy: 100,
          season: 2021,
          teamId: '27'
        }
      ],
      name: 'Niklas Süle',
      playerId: '166601',
      teamMates: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056'
        }
      ]
    }
  ]

  await Players.insertMany(players)
})

test('Should throw if no startId or endId is specified', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/valid-link',
    body: {
    }
  })

  t.is(response.statusCode, 400)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    code: 'FST_ERR_VALIDATION',
    error: 'Bad Request',
    message: 'body must have required property \'startId\'',
    statusCode: 400
  })
})

test('Should throw if the startId is not linked to any player on the database', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/valid-link',
    body: {
      startId: '10000',
      endId: '20000'
    }
  })

  t.is(response.statusCode, 500)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    error: 'Internal Server Error',
    message: 'No player exists linked to startId 10000',
    statusCode: 500
  })
})

test('Should return true if two players have been team mates', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/valid-link',
    body: {
      startId: '161056',
      endId: '326031'
    }
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    valid: true
  })
})

test('Should return false if two players have never been team mates', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/valid-link',
    body: {
      startId: '166601',
      endId: '326031'
    }
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()

  t.deepEqual(responseJson, {
    valid: false
  })
})
