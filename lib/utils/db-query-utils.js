const { DIFFICULTY_POSITION } = require('./constants')
const { tierOneLeagues, tierTwoLeagues, getLeagueProperties } = require('./get-league-properties')

const getPositionQueryPlayer = ({ difficulty = 'random', league }) => {
  if (difficulty === 'random') {
    if (league) {
      league = league.toLowerCase().replace(/[^\p{Ll}\d]/gu, '')
      const leagueProperties = getLeagueProperties[league]
      if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

      return {
        'boardTeams.league': league
      }
    }
    return { boardTeams: { $exists: true } }
  }

  if (!DIFFICULTY_POSITION[difficulty]) throw new Error(`Difficulty not supported: ${difficulty}`)

  if (league) {
    league = league.toLowerCase().replace(/[^\p{Ll}\d]/gu, '')
    const leagueProperties = getLeagueProperties[league]
    if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)

    if (difficulty === 'hard') {
      return {
        boardTeams: {
          $elemMatch: {
            league,
            position: { $gte: DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier }
          }
        }
      }
    }

    return {
      boardTeams: {
        $elemMatch: {
          league,
          position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / leagueProperties.leagueTier) }
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
              position: { $gte: DIFFICULTY_POSITION[difficulty] }
            }
          }
        },
        {
          boardTeams: {
            $elemMatch: {
              league: { $in: tierTwoLeagues },
              position: { $gte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) }
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
            position: { $lte: DIFFICULTY_POSITION[difficulty] }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) }
          }
        }
      }
    ]
  }
}

const getPositionQueryTeam = ({ difficulty = 'random' }) => {
  if (difficulty === 'random') {
    return {}
  }

  if (difficulty === 'hard') {
    return {
      $or: [
        {
          league: { $in: tierOneLeagues },
          position: { $gte: DIFFICULTY_POSITION[difficulty] }
        },
        {
          league: { $in: tierTwoLeagues },
          position: { $gte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) }
        }
      ]
    }
  }

  if (difficulty === 'medium') {
    return {
      $or: [
        {
          league: { $in: tierOneLeagues },
          position: { $lte: DIFFICULTY_POSITION[difficulty] }
        },
        {
          league: { $in: tierTwoLeagues },
          position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) }
        }
      ]
    }
  }

  if (difficulty === 'easy') {
    return {
      $or: [
        {
          league: { $in: tierOneLeagues },
          position: { $lte: DIFFICULTY_POSITION[difficulty] }
        },
        {
          league: { $in: tierTwoLeagues },
          position: { $lte: Math.ceil(DIFFICULTY_POSITION[difficulty] / 2) }
        }
      ]
    }
  }

  throw new Error(`Difficulty not supported: ${difficulty}`)
}

const getSeasonQueryTeam = ({ season }) => {
  if (!season) {
    return {}
  }
  return {
    season: { $gte: season - 5, $lte: season + 5 }
  }
}

module.exports = {
  getPositionQueryPlayer,
  getPositionQueryTeam,
  getSeasonQueryTeam
}
