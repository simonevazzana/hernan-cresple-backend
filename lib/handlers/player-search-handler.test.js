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
    },
    {
      name: 'Franco Vázquez',
      playerId: '76163',
      active: true,
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
      teamMates: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      boardTeams: [
        {
          league: 'seriea',
          name: 'US Palermo 2015/2016',
          position: 16,
          relevancy: 40,
          season: 2015,
          teamId: '458'
        }
      ]
    },
    {
      playerId: '21891',
      name: 'Stefano Sorrentino',
      active: true,
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
      boardTeams: [
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
      teamMates: [
        {
          name: 'Valter Birsa',
          playerId: '26105'
        },
        {
          name: 'Franco Vázquez',
          playerId: '76163'
        }
      ]
    },
    {
      playerId: '26105',
      name: 'Valter Birsa',
      active: true,
      allTeams: [
        {
          league: 'seriea',
          name: 'Chievo Verona 2016/2017',
          position: 14,
          relevancy: 48,
          season: 2016,
          teamId: '862'
        }
      ],
      teamMates: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      boardTeams: [
        {
          league: 'seriea',
          name: 'Chievo Verona 2016/2017',
          position: 14,
          relevancy: 48,
          season: 2016,
          teamId: '862'
        }
      ]
    }
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
