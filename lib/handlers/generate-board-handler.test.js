const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')
const { easyModePlayers, easyModeTeams, playersFromTeamsLeadingNowhere, teamsLeadingNowhere } = require('../test-fixtures/board-generation-fixtures')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  const Teams = db.collection('teams')
  await Players.deleteMany({})
  await Teams.deleteMany({})

  const players = [
    ...easyModePlayers,
    ...playersFromTeamsLeadingNowhere
  ]

  const teams = [
    ...easyModeTeams,
    ...teamsLeadingNowhere
  ]

  await Players.insertMany(players)
  await Teams.insertMany(teams)
})

test('Should throw if no team fits the input parameters', async t => {
  const db = await startDb()

  const Players = db.collection('players')
  const Teams = db.collection('teams')
  await Players.deleteMany({})
  await Teams.deleteMany({})

  const app = build()

  let response = await app.inject({
    method: 'POST',
    url: '/v1/generate-board',
    body: {
    }
  })

  t.is(response.statusCode, 500)

  let responseJson = response.json()
  t.is(responseJson.message, 'No team is compatible with your params (difficulty: \'random\', league: \'any\', season: \'any\')')

  response = await app.inject({
    method: 'POST',
    url: '/v1/generate-board',
    body: {
      difficulty: 'medium',
      league: 'Serie A',
      season: 1994
    }
  })

  t.is(response.statusCode, 500)

  responseJson = response.json()
  t.is(responseJson.message, 'No team is compatible with your params (difficulty: \'medium\', league: \'Serie A\', season: \'1994\')')
})

test('Should return a valid board', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/generate-board',
    body: {}
  })

  t.is(response.statusCode, 200)

  const responseJson = response.json()
  const { column, rows } = responseJson

  column.players.sort()
  t.deepEqual(column, {
    players: [
      'Ederson',
      'Eduardo Salvio',
      'Jonas',
      'Nélson Semedo',
      'Victor Lindelöf'
    ],
    team: {
      teamId: '294',
      teamName: 'SL Benfica 2016/2017'
    }
  })

  rows.sort((a, b) => (a.team.teamName > b.team.teamName) ? 1 : ((b.team.teamName > a.team.teamName) ? -1 : 0))
  rows.forEach(r => {
    r.players = r.players.sort()
  })

  t.deepEqual(rows, [
    {
      players: [
        'Adrián López',
        'Eduardo Salvio',
        'Filipe Luís',
        'Gabi',
        'Radamel Falcao'
      ],
      team: {
        teamId: '13',
        teamName: 'Atlético de Madrid 2011/2012'
      }
    },
    {
      players: [
        'Arturo Vidal',
        'Luis Suárez',
        'Marc-André ter Stegen',
        'Nélson Semedo',
        'Sergi Roberto'
      ],
      team: {
        teamId: '131',
        teamName: 'FC Barcelona 2019/2020'
      }
    },
    {
      players: [
        'Danilo',
        'David Silva',
        'Ederson',
        'Fabian Delph',
        'Kyle Walker'
      ],
      team: {
        teamId: '281',
        teamName: 'Manchester City 2017/2018'
      }
    },
    {
      players: [
        'Ashley Young',
        'Jesse Lingard',
        'Marcus Rashford',
        'Nemanja Matic',
        'Victor Lindelöf'
      ],
      team: {
        teamId: '985',
        teamName: 'Manchester United 2017/2018'
      }
    },
    {
      players: [
        'Aly Cissokho',
        'Andrés Guardado',
        'Diego Alves',
        'Jonas',
        'João Pereira'
      ],
      team: {
        teamId: '1049',
        teamName: 'Valencia CF 2012/2013'
      }
    }
  ])
})
