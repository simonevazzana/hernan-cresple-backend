const test = require('ava')
const { chainpionsLeagueStartQuery, generateBoardQuery } = require('./db-query-utils')
const { tierOneLeagues, tierTwoLeagues } = require('./get-league-properties')

test('chainpionsLeagueStartQuery() should throw, with an unknown difficulty in input', t => {
  const difficulty = 'unknown'

  const error = t.throws(() => chainpionsLeagueStartQuery({ difficulty }))

  t.is(error.message, 'Difficulty not supported: unknown')
})

test('chainpionsLeagueStartQuery() should throw, with an unknown league in input', t => {
  const league = 'unknown'

  const error = t.throws(() => chainpionsLeagueStartQuery({ league }))

  t.is(error.message, 'Found unsupported league: unknown')
})

test('chainpionsLeagueStartQuery() should throw, with an unknown league and a valid difficulty in input', t => {
  const league = 'unknown'
  const difficulty = 'hard'

  const error = t.throws(() => chainpionsLeagueStartQuery({ difficulty, league }))

  t.is(error.message, 'Found unsupported league: unknown')
})

test('chainpionsLeagueStartQuery() should correctly return a basic query on boardTeams, without any league or difficulty in input', t => {
  const playerQuery = chainpionsLeagueStartQuery({})

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        season: { $exists: true }
      }
    }
  })
})

test('chainpionsLeagueStartQuery() should correctly return a basic query on a team\'s league, with only a valid league in input', t => {
  const league = 'Bundesliga'

  const playerQuery = chainpionsLeagueStartQuery({ league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        season: { $exists: true }
      }
    }
  })
})

test('chainpionsLeagueStartQuery() should correctly return a query based on any league and league position according to a given tier, when presented only with a valid difficulty', t => {
  let difficulty = 'hard'
  let playerQuery = chainpionsLeagueStartQuery({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $gte: 12 },
            season: { $exists: true }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $gte: 6 },
            season: { $exists: true }
          }
        }
      }
    ]
  })

  difficulty = 'medium'
  playerQuery = chainpionsLeagueStartQuery({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $lte: 10 },
            season: { $exists: true }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: 5 },
            season: { $exists: true }
          }
        }
      }
    ]
  })

  difficulty = 'easy'
  playerQuery = chainpionsLeagueStartQuery({ difficulty })

  t.deepEqual(playerQuery, {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $lte: 5 },
            season: { $exists: true }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: 3 },
            season: { $exists: true }
          }
        }
      }
    ]
  })
})

test('chainpionsLeagueStartQuery() should correctly return a query based on a specific league and league position, when presented with a valid league and difficulty', t => {
  const league = 'Bundesliga'

  let difficulty = 'hard'
  let playerQuery = chainpionsLeagueStartQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $gte: 12 },
        season: { $exists: true }
      }
    }
  })

  difficulty = 'medium'
  playerQuery = chainpionsLeagueStartQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $lte: 10 },
        season: { $exists: true }
      }
    }
  })

  difficulty = 'easy'
  playerQuery = chainpionsLeagueStartQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $lte: 5 },
        season: { $exists: true }
      }
    }
  })
})

test('chainpionsLeagueStartQuery() should correctly a 5-year range for the season, when presented with it in input', t => {
  const league = 'Bundesliga'
  const difficulty = 'easy'
  const season = 2010
  const playerQuery = chainpionsLeagueStartQuery({ difficulty, league, season })

  t.deepEqual(playerQuery, {
    boardTeams: {
      $elemMatch: {
        league: 'bundesliga',
        position: { $lte: 5 },
        season: { $gte: 2005, $lte: 2015 }
      }
    }
  })
})

test('generateBoardQuery() should throw, with an unknown difficulty in input', t => {
  const difficulty = 'unknown'

  const error = t.throws(() => generateBoardQuery({ difficulty }))

  t.is(error.message, 'Difficulty not supported: unknown')
})

test('generateBoardQuery() should throw, with an unknown league in input', t => {
  const league = 'unknown'

  const error = t.throws(() => generateBoardQuery({ league }))

  t.is(error.message, 'Found unsupported league: unknown')
})

test('generateBoardQuery() should throw, with an unknown league and a valid difficulty in input', t => {
  const league = 'unknown'
  const difficulty = 'hard'

  const error = t.throws(() => generateBoardQuery({ difficulty, league }))

  t.is(error.message, 'Found unsupported league: unknown')
})

test('generateBoardQuery() should correctly return a basic query on the teams collection, without any league or difficulty in input', t => {
  const teamQuery = generateBoardQuery({})

  t.deepEqual(teamQuery, {
    season: { $exists: true }
  })
})

test('generateBoardQuery() should correctly return a basic query on a team\'s league, with only a valid league in input', t => {
  const league = 'Bundesliga'

  const teamQuery = generateBoardQuery({ league })

  t.deepEqual(teamQuery, {
    league: 'bundesliga',
    season: { $exists: true }
  })
})

test('generateBoardQuery() should correctly return a query based on any league and league position according to a given tier, when presented only with a valid difficulty', t => {
  let difficulty = 'hard'
  let teamQuery = generateBoardQuery({ difficulty })

  t.deepEqual(teamQuery, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $gte: 12 },
        season: { $exists: true }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $gte: 6 },
        season: { $exists: true }
      }
    ]
  })

  difficulty = 'medium'
  teamQuery = generateBoardQuery({ difficulty })

  t.deepEqual(teamQuery, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $lte: 10 },
        season: { $exists: true }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $lte: 5 },
        season: { $exists: true }
      }
    ]
  })

  difficulty = 'easy'
  teamQuery = generateBoardQuery({ difficulty })

  t.deepEqual(teamQuery, {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $lte: 5 },
        season: { $exists: true }
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $lte: 3 },
        season: { $exists: true }
      }
    ]
  })
})

test('generateBoardQuery() should correctly return a query based on a specific league and league position, when presented with a valid league and difficulty', t => {
  const league = 'Bundesliga'

  let difficulty = 'hard'
  let playerQuery = generateBoardQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    league: 'bundesliga',
    position: { $gte: 12 },
    season: { $exists: true }
  })

  difficulty = 'medium'
  playerQuery = generateBoardQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    league: 'bundesliga',
    position: { $lte: 10 },
    season: { $exists: true }
  })

  difficulty = 'easy'
  playerQuery = generateBoardQuery({ difficulty, league })

  t.deepEqual(playerQuery, {
    league: 'bundesliga',
    position: { $lte: 5 },
    season: { $exists: true }
  })
})

test('generateBoardQuery() should correctly a 5-year range for the season, when presented with it in input', t => {
  const league = 'Bundesliga'
  const difficulty = 'easy'
  const season = 2010
  const playerQuery = generateBoardQuery({ difficulty, league, season })

  t.deepEqual(playerQuery, {
    league: 'bundesliga',
    position: { $lte: 5 },
    season: { $gte: 2005, $lte: 2015 }
  })
})
