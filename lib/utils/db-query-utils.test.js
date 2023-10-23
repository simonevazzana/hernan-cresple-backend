const test = require('ava')
const { getPositionQueryTeam, getSeasonQueryTeam, getPositionQueryPlayer } = require('./db-query-utils')
const { tierOneLeagues, tierTwoLeagues } = require('./get-league-properties')

test('getSeasonQueryTeam() should correctly return an empty object, without any season in input', t => {
  const seasonQuery = getSeasonQueryTeam({})

  t.deepEqual(seasonQuery, {})
})

test('getSeasonQueryTeam() should correctly return a 5-season range, when presented with a season in input', t => {
  const season = 2010

  const seasonQuery = getSeasonQueryTeam({ season })

  t.deepEqual(seasonQuery, {
    season: {
      $gte: 2005,
      $lte: 2015
    }
  })
})

test('getPositionQueryTeam() should throw, with an unknown difficulty in input', t => {
  const difficulty = 'unknown'

  const error = t.throws(() => getPositionQueryTeam({ difficulty }))

  t.is(error.message, 'Difficulty not supported: unknown')
})

test('getPositionQueryTeam() should correctly return an empty object, without any difficulty in input', t => {
  const positionQueryTeam = getPositionQueryTeam({})

  t.deepEqual(positionQueryTeam, {})
})

test('getPositionQueryTeam() should correctly return the query for the position, depending on each difficulty in input', t => {
  let difficulty = 'hard'
  let positionQueryTeam = getPositionQueryTeam({ difficulty })

  t.deepEqual(positionQueryTeam, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $gte: 12 }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $gte: 6 }
      }
    ]
  })

  difficulty = 'medium'
  positionQueryTeam = getPositionQueryTeam({ difficulty })

  t.deepEqual(positionQueryTeam, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $lte: 10 }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $lte: 5 }
      }
    ]
  })

  difficulty = 'easy'
  positionQueryTeam = getPositionQueryTeam({ difficulty })

  t.deepEqual(positionQueryTeam, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $lte: 5 }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $lte: 3 }
      }
    ]
  })
})

test('getPositionQueryPlayer() should throw, with an unknown difficulty in input', t => {
  const difficulty = 'unknown'

  const error = t.throws(() => getPositionQueryPlayer({ difficulty }))

  t.is(error.message, 'Difficulty not supported: unknown')
})

test('getPositionQueryPlayer() should throw, with an unknown league in input', t => {
  const league = 'unknown'

  const error = t.throws(() => getPositionQueryPlayer({ league }))

  t.is(error.message, 'Found unsupported league: unknown')
})

test('getPositionQueryPlayer() should correctly return a basic query on boardTeams, without any league or difficulty in input', t => {
  const playerQuery = getPositionQueryPlayer({})

  t.deepEqual(playerQuery, {
    boardTeams: { $exists: true }
  })
})

test('getPositionQueryPlayer() should correctly return a basic query on a team\'s league, with only a valid league in input', t => {
  const league = 'Bundesliga'

  const playerQuery = getPositionQueryPlayer({ league })

  t.deepEqual(playerQuery, {
    'boardTeams.league': 'bundesliga'
  })
})

test('getPositionQueryPlayer() should correctly return a query based on any league and league position according to a given tier, when presented only with a valid difficulty', t => {
  let difficulty = 'hard'
  let playerQuery = getPositionQueryPlayer({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $gte: 12 }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $gte: 6 }
          }
        }
      }
    ]
  })

  difficulty = 'medium'
  playerQuery = getPositionQueryPlayer({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $lte: 10 }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: 5 }
          }
        }
      }
    ]
  })

  difficulty = 'easy'
  playerQuery = getPositionQueryPlayer({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $lte: 5 }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: 3 }
          }
        }
      }
    ]
  })
})

test('getPositionQueryPlayer() should correctly return a query based on a specific league and league position, when presented with a valid league and difficulty', t => {
  const league = 'Bundesliga'

  let difficulty = 'hard'
  let playerQuery = getPositionQueryPlayer({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $gte: 12 }
      }
    }
  })

  difficulty = 'medium'
  playerQuery = getPositionQueryPlayer({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $lte: 10 }
      }
    }
  })

  difficulty = 'easy'
  playerQuery = getPositionQueryPlayer({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $lte: 5 }
      }
    }
  })
})
