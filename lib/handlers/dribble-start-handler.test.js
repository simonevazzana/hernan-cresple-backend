const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  const Teams = db.collection('teams')
  await Players.deleteMany({})
  await Teams.deleteMany({})

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

  const teams = [
    {
      active: true,
      allPlayers: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056',
          appearances: 47
        },
        {
          name: 'Matthijs de Ligt',
          playerId: '326031',
          appearances: 43
        }
      ],
      boardPlayers: [
        {
          name: 'Joshua Kimmich',
          appearances: 47,
          goals: 7,
          assists: 11,
          goalContributions: 18,
          playerId: '161056',
          minutesPlayed: 4051
        },
        {
          name: 'Matthijs de Ligt',
          appearances: 43,
          goals: 3,
          assists: 1,
          goalContributions: 4,
          playerId: '326031',
          minutesPlayed: 3390
        }
      ],
      league: 'bundesliga',
      name: 'Bayern Munich 2022/2023',
      position: 1,
      relevancy: 100,
      season: 2022,
      teamId: '27'
    },
    {
      active: true,
      allPlayers: [
        {
          name: 'Niklas Süle',
          playerId: '166601',
          appearances: 41
        }
      ],
      boardPlayers: [
        {
          name: 'Niklas Süle',
          appearances: 41,
          goals: 2,
          assists: 4,
          goalContributions: 6,
          playerId: '166601',
          minutesPlayed: 3105
        }
      ],
      league: 'bundesliga',
      name: 'Borussia Dortmund 2022/2023',
      position: 2,
      relevancy: 96,
      season: 2022,
      teamId: '16'
    },
    {
      active: true,
      allPlayers: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056',
          appearances: 39
        },
        {
          name: 'Niklas Süle',
          playerId: '166601',
          appearances: 38
        }
      ],
      boardPlayers: [
        {
          name: 'Joshua Kimmich',
          appearances: 39,
          goals: 3,
          assists: 12,
          goalContributions: 15,
          playerId: '161056',
          minutesPlayed: 3406
        },
        {
          name: 'Niklas Süle',
          appearances: 38,
          goals: 1,
          assists: 2,
          goalContributions: 3,
          playerId: '166601',
          minutesPlayed: 2516
        }
      ],
      league: 'bundesliga',
      name: 'Bayern Munich 2021/2022',
      position: 1,
      relevancy: 100,
      season: 2021,
      teamId: '27'
    },
    {
      active: true,
      allPlayers: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891',
          appearances: 36
        },
        {
          name: 'Valter Birsa',
          playerId: '26105',
          appearances: 37
        }
      ],
      boardPlayers: [
        {
          name: 'Stefano Sorrentino',
          appearances: 36,
          goals: 0,
          assists: 0,
          goalContributions: 0,
          playerId: '21891',
          minutesPlayed: 3240
        },
        {
          name: 'Valter Birsa',
          appearances: 37,
          goals: 7,
          assists: 9,
          goalContributions: 16,
          playerId: '26105',
          minutesPlayed: 2881
        }
      ],
      league: 'seriea',
      name: 'Chievo Verona 2016/2017',
      position: 14,
      relevancy: 48,
      season: 2016,
      teamId: '862'
    },
    {
      active: true,
      allPlayers: [
        {
          name: 'Franco Vázquez',
          playerId: '76163',
          appearances: 38
        },
        {
          name: 'Stefano Sorrentino',
          playerId: '21891',
          appearances: 36
        }
      ],
      boardPlayers: [
        {
          name: 'Franco Vázquez',
          appearances: 38,
          goals: 8,
          assists: 5,
          goalContributions: 13,
          playerId: '76163',
          minutesPlayed: 3297
        },
        {
          name: 'Stefano Sorrentino',
          appearances: 36,
          goals: 0,
          assists: 0,
          goalContributions: 0,
          playerId: '21891',
          minutesPlayed: 3186
        }
      ],
      league: 'seriea',
      name: 'US Palermo 2015/2016',
      position: 16,
      relevancy: 40,
      season: 2015,
      teamId: '458'
    }
  ]

  await Players.insertMany(players)
  await Teams.insertMany(teams)
})

test('Should return two players who are linkable through a mutual team mate', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
    }
  })

  const responseJson = response.json()
  const { name: startName } = responseJson.startPlayer

  if (startName === 'Matthijs de Ligt') {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Matthijs de Ligt',
        playerId: '326031'
      },
      firstLevelLinks: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056'
        }
      ],
      endPlayer: {
        name: 'Niklas Süle',
        playerId: '166601'
      }
    })
  } else if (startName === 'Niklas Süle') {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Niklas Süle',
        playerId: '166601'

      },
      firstLevelLinks: [
        {
          name: 'Joshua Kimmich',
          playerId: '161056'
        }
      ],
      endPlayer: {
        name: 'Matthijs de Ligt',
        playerId: '326031'
      }
    })
  } else if (startName === 'Valter Birsa') {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Valter Birsa',
        playerId: '26105'

      },
      firstLevelLinks: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      endPlayer: {
        name: 'Franco Vázquez',
        playerId: '76163'
      }
    })
  } else {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Franco Vázquez',
        playerId: '76163'

      },
      firstLevelLinks: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      endPlayer: {
        name: 'Valter Birsa',
        playerId: '26105'
      }
    })
  }
})

test('Should correctly return results according to the league and difficulty parameters in input', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
      difficulty: 'hard',
      league: 'seriea'
    }
  })

  const responseJson = response.json()
  const { name: startName } = responseJson.startPlayer

  if (startName === 'Valter Birsa') {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Valter Birsa',
        playerId: '26105'

      },
      firstLevelLinks: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      endPlayer: {
        name: 'Franco Vázquez',
        playerId: '76163'
      }
    })
  } else {
    t.deepEqual(responseJson, {
      startPlayer: {
        name: 'Franco Vázquez',
        playerId: '76163'

      },
      firstLevelLinks: [
        {
          name: 'Stefano Sorrentino',
          playerId: '21891'
        }
      ],
      endPlayer: {
        name: 'Valter Birsa',
        playerId: '26105'
      }
    })
  }
})
