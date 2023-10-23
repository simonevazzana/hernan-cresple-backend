const { tierOneLeagues, tierTwoLeagues, getLeagueProperties } = require('./get-league-properties')

const difficultyPosition = {
  easy: 5,
  medium: 10,
  hard: 12
}

const getPositionQueryPlayer = ({ difficulty = 'random', league }) => {
  let leagueProperties
  if (league) {
    league = league.toLowerCase().replace(/[^\p{Ll}\d]/gu, '')
    leagueProperties = getLeagueProperties[league]
    if (!leagueProperties) throw new Error(`Found unsupported league: ${league}`)
  }

  if (difficulty === 'random') {
    if (league) {
      return {
        'boardTeams.league': league
      }
    }
    return { boardTeams: { $exists: true } }
  }

  if (!difficultyPosition[difficulty]) throw new Error(`Difficulty not supported: ${difficulty}`)

  if (league) {
    if (difficulty === 'hard') {
      return {
        boardTeams: {
          $elemMatch: {
            league,
            position: { $gte: difficultyPosition[difficulty] / leagueProperties.leagueTier }
          }
        }
      }
    }

    return {
      boardTeams: {
        $elemMatch: {
          league,
          position: { $lte: Math.ceil(difficultyPosition[difficulty] / leagueProperties.leagueTier) }
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
              position: { $gte: difficultyPosition[difficulty] }
            }
          }
        },
        {
          boardTeams: {
            $elemMatch: {
              league: { $in: tierTwoLeagues },
              position: { $gte: Math.ceil(difficultyPosition[difficulty] / 2) }
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
            position: { $lte: difficultyPosition[difficulty] }
          }
        }
      },
      {
        boardTeams: {
          $elemMatch: {
            league: { $in: tierTwoLeagues },
            position: { $lte: Math.ceil(difficultyPosition[difficulty] / 2) }
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
          position: { $gte: 12 }
        },
        {
          league: { $in: tierTwoLeagues },
          position: { $gte: 6 }
        }
      ]
    }
  }

  if (difficulty === 'medium') {
    return {
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
    }
  }

  if (difficulty === 'easy') {
    return {
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
