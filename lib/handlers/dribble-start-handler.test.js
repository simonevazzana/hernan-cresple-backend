const test = require('ava')
const { build } = require('../../app')
const { startDb } = require('../db')
const { easyModePlayers, hardModePlayers, easyModeTeams, hardModeTeams } = require('../test-fixtures/dribble-start-fixtures')

test.beforeEach(async () => {
  const db = await startDb()

  const Players = db.collection('players')
  const Teams = db.collection('teams')
  await Players.deleteMany({})
  await Teams.deleteMany({})

  await Players.insertMany([...easyModePlayers, ...hardModePlayers])
  await Teams.insertMany([...easyModeTeams, ...hardModeTeams])
})

test('Should throw if no player fits the input parameters', async t => {
  const db = await startDb()

  const Players = db.collection('players')
  const Teams = db.collection('teams')
  await Players.deleteMany({})
  await Teams.deleteMany({})

  const app = build()

  let response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
    }
  })

  t.is(response.statusCode, 500)

  let responseJson = response.json()
  t.is(responseJson.message, 'No team is compatible with your params (difficulty: \'random\', league: \'any\', season: \'any\')')

  response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
      difficulty: 'medium',
      league: 'Serie A',
      season: 2016
    }
  })

  t.is(response.statusCode, 500)

  responseJson = response.json()
  t.is(responseJson.message, 'No team is compatible with your params (difficulty: \'medium\', league: \'Serie A\', season: \'2016\')')
})

test('Should return two players who are linkable through a mutual team mate', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
    }
  })

  t.is(response.statusCode, 200)

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

  t.is(response.statusCode, 200)

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

test('Should correctly return results according to the season parameter in input', async t => {
  const app = build()

  const response = await app.inject({
    method: 'POST',
    url: '/v1/dribble-start',
    body: {
      season: 2023
    }
  })

  t.is(response.statusCode, 200)

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
  } else {
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
  }
})
