const { DIFFICULTY_POSITION } = require('./constants')
const { tierOneLeagues, tierTwoLeagues, getLeagueProperties } = require('./get-league-properties')
const { normalizeLeagueString } = require('./string-utils')

const dribbleStartQuery = ({ difficulty = 'random', league, season }) => {
  season = season ? { $gte: season - 5, $lte: season + 5 } : { $exists: true }

  if (difficulty === 'random') {
    if (league) {
      league = normalizeLeagueString(league)
      const leagueProperties = getLeagueProperties[league]
      if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

      return {
        boardTeams: {
          $elemMatch: {
            league,
            season
          }
        }
      }
    }
    return {
      boardTeams: {
        $elemMatch: {
          season
        }
      }
    }
  }

  if (!DIFFICULTY_POSITION[difficulty]) throw new Error(`Difficulty not supported: ${difficulty}`)

  if (league) {
    league = normalizeLeagueString(league)
    const leagueProperties = getLeagueProperties[league]
    if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

    if (difficulty === 'hard') {
      return {
        boardTeams: {
          $elemMatch: {
            league,
            position: { $gte: DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier },
            season
          }
        }
      }
    }

    return {
      boardTeams: {
        $elemMatch: {
          league,
          position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier) },
          season
        }
      }
    }
  }

  if (difficulty === 'hard') {
    return {
      $or: [
        {
          boardTeams: {
            $elemMatch: {
              league: { $in: tierOneLeagues },
              position: { $gte: DIFFICULTY_POSITION[difficulty] },
              season
            }
          }
        },
        {
          boardTeams: {
            $elemMatch: {
              league: { $in: tierTwoLeagues },
              position: { $gte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) },
              season
            }
          }
        }
      ]
    }
  }

  return {
    $or: [
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierOneLeagues },
            position: { $lte: DIFFICULTY_POSITION[difficulty] },
            season
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) },
            season
          }
        }
      }
    ]
  }
}

const generateBoardQuery = ({ difficulty = 'random', league, season }) => {
  season = season ? { $gte: season - 5, $lte: season + 5 } : { $exists: true }

  if (difficulty === 'random') {
    if (league) {
      league = normalizeLeagueString(league)
      const leagueProperties = getLeagueProperties[league]
      if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

      return {
        league,
        season
      }
    }
    return {
      season
    }
  }

  if (!DIFFICULTY_POSITION[difficulty]) throw new Error(`Difficulty not supported: ${difficulty}`)

  if (league) {
    league = normalizeLeagueString(league)
    const leagueProperties = getLeagueProperties[league]
    if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

    if (difficulty === 'hard') {
      return {
        league,
        position: { $gte: DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier },
        season
      }
    }

    return {
      league,
      position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier) },
      season
    }
  }

  if (difficulty === 'hard') {
    return {
      $or: [
        {
          league: { $in: tierOneLeagues },
          position: { $gte: DIFFICULTY_POSITION[difficulty] },
          season
        },
        {
          league: { $in: tierTwoLeagues },
          position: { $gte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) },
          season
        }
      ]
    }
  }

  return {
    $or: [
      {
        league: { $in: tierOneLeagues },
        position: { $lte: DIFFICULTY_POSITION[difficulty] },
        season
      },
      {
        league: { $in: tierTwoLeagues },
        position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) },
        season
      }
    ]
  }
}

module.exports = {
  dribbleStartQuery,
  generateBoardQuery
}
