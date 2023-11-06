const test = require('ava')
const { checkSeason, checkTeamPosition } = require('./boolean-utils')

test('checkSeason() should correctly return true, if there\'s no season in input', t => {
  const team = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }

  const res = checkSeason({ team })
  t.is(res, true)
})

test('checkSeason() should correctly check that a team\'s season is within the needed 10-year span', t => {
  const team1 = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }

  const season = 2018

  const res1 = checkSeason({ team: team1, season })
  t.is(res1, true)

  const team2 = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2004/2005',
    position: 1,
    season: 2004,
    teamId: '27'
  }

  const res2 = checkSeason({ team: team2, season })
  t.is(res2, false)
})

test('checkTeamPosition() should throw for an unsupported difficulty', t => {
  const team = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }
  const difficulty = 'unknown'

  const error = t.throws(() => checkTeamPosition({ team, difficulty }))

  t.is(error.message, 'Difficulty not supported: unknown')
})

test('checkTeamPosition() should throw for an unsupported league', t => {
  const team = {
    active: true,
    league: 'unknown',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }
  let difficulty = 'easy'

  let error = t.throws(() => checkTeamPosition({ team, difficulty }))
  t.is(error.message, 'Found unsupported league: unknown')

  difficulty = 'medium'

  error = t.throws(() => checkTeamPosition({ team, difficulty }))
  t.is(error.message, 'Found unsupported league: unknown')

  difficulty = 'hard'

  error = t.throws(() => checkTeamPosition({ team, difficulty }))
  t.is(error.message, 'Found unsupported league: unknown')
})

test('checkTeamPosition() should correctly return true, if the difficulty is set to random', t => {
  const team = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }
  const difficulty = 'random'

  const res = checkTeamPosition({ team, difficulty })
  t.is(res, true)
})

test('checkTeamPosition() should correctly check that a team has reached a proper position in the league table, given a difficulty', t => {
  const team = {
    active: true,
    league: 'bundesliga',
    name: 'Bayern Munich 2022/2023',
    position: 1,
    season: 2022,
    teamId: '27'
  }
  let difficulty = 'easy'

  let res = checkTeamPosition({ team, difficulty })
  t.is(res, true)

  difficulty = 'medium'

  res = checkTeamPosition({ team, difficulty })
  t.is(res, true)

  difficulty = 'hard'

  res = checkTeamPosition({ team, difficulty })
  t.is(res, false)
})

test('checkTeamPosition() should correctly work for a second-tier league', t => {
  const team = {
    active: true,
    league: 'ligaportugal',
    name: 'FC Arouca 2022/2023',
    position: 5,
    season: 2022,
    teamId: '8024'
  }
  let difficulty = 'easy'

  let res = checkTeamPosition({ team, difficulty })
  t.is(res, false)

  difficulty = 'medium'

  res = checkTeamPosition({ team, difficulty })
  t.is(res, true)

  difficulty = 'hard'

  res = checkTeamPosition({ team, difficulty })
  t.is(res, false)
})
