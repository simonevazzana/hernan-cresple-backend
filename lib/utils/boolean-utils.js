const { DIFFICULTY_POSITION } = require('./constants')
const { tierOneLeagues, tierTwoLeagues } = require('./get-league-properties')
const { normalizeLeagueString } = require('./string-utils')

const checkLeague = ({ team, league }) => {
  if (!league) return true

  return normalizeLeagueString(team.league) === normalizeLeagueString(league)
}

const checkSeason = ({ team, season }) => {
  if (!season) return true

  return team.season >= (season - 5) && team.season <= (season + 5)
}

const checkTeamPosition = ({ team, difficulty }) => {
  if (difficulty === 'random') return true

  if (!DIFFICULTY_POSITION[difficulty]) throw new Error(`Difficulty not supported: ${difficulty}`)

  if (difficulty === 'hard') {
    if (tierOneLeagues.includes(team.league)) return team.position >= DIFFICULTY_POSITION[difficulty]
    if (tierTwoLeagues.includes(team.league)) return team.position >= Math.ceil(DIFFICULTY_POSITION[difficulty] / 2)
  }
  if (difficulty === 'medium') {
    if (tierOneLeagues.includes(team.league)) return team.position <= DIFFICULTY_POSITION[difficulty]
    if (tierTwoLeagues.includes(team.league)) return team.position <= Math.ceil(DIFFICULTY_POSITION[difficulty] / 2)
  }
  if (difficulty === 'easy') {
    if (tierOneLeagues.includes(team.league)) return team.position <= DIFFICULTY_POSITION[difficulty]
    if (tierTwoLeagues.includes(team.league)) return team.position <= Math.ceil(DIFFICULTY_POSITION[difficulty] / 2)
  }

  throw new Error(`Found unsupported league: ${team.league}`)
}

module.exports = {
  checkLeague,
  checkSeason,
  checkTeamPosition
}
