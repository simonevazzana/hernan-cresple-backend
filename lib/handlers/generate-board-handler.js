const { shuffleArray, unique } = require('../utils/array-utils')
const { checkSeason, checkTeamPosition, checkLeague } = require('../utils/boolean-utils')
const { generateBoardQuery } = require('../utils/db-query-utils')

const { startDb } = require('../db')

const generateBoardHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')
  const Teams = db.collection('teams')

  let { difficulty, league, season } = request.body

  if (!difficulty) difficulty = 'random'

  while (true) {
    const columnTeam = (await Teams.aggregate([
      { $match: { active: true, ...generateBoardQuery({ difficulty, league, season }) } },
      { $sample: { size: 1 } }
    ]).toArray())[0]
    if (!columnTeam) throw new Error(`No team is compatible with your params (difficulty: '${difficulty}', league: '${league || 'any'}', season: '${season || 'any'}')`)

    const suitablePlayers = []

    const playersEligible = await Players.find({ 'boardTeams.name': columnTeam.name, 'boardTeams.1': { $exists: true } }, { projection: { name: 1, boardTeams: 1 } }).toArray()
    if (playersEligible.length < 5) continue

    let teamIds = []
    shuffleArray(playersEligible)
    for (const player of playersEligible) {
      const suitableTeamsFromPlayer = player.boardTeams
        .filter(t => filterSuitableTeamsOnPlayer({ team: t, columnTeam, suitablePlayers, teamIds, difficulty, season, league }))
        .map(t => {
          return {
            teamName: t.name,
            teamId: t.teamId
          }
        })

      if (suitableTeamsFromPlayer.length) {
        suitablePlayers.push({
          teams: suitableTeamsFromPlayer,
          name: player.name
        })

        teamIds = unique([...teamIds, ...suitableTeamsFromPlayer.map(t => t.teamId)])
      }
    }

    const remainingPlayers = suitablePlayers
      .filter(t => t.teams.length)

    if (remainingPlayers.length < 5) continue

    const column = {
      team: {
        teamName: columnTeam.name,
        teamId: columnTeam.teamId
      },
      players: remainingPlayers
    }

    shuffleArray(column.players)

    const playersAlreadyOnBoard = []
    const rows = []
    for (const player of column.players) {
      const teamForBoard = await getBoardTeamFromPlayer({ teams: player.teams, column, playersAlreadyOnBoard, playerName: player.name })

      if (teamForBoard.active) {
        playersAlreadyOnBoard.push(...teamForBoard.players)

        rows.push({
          team: teamForBoard.team,
          players: teamForBoard.players
        })
      }

      if (rows.length === 5) break
    }

    if (rows.length < 5) continue

    column.players = rows.map(r => r.players[4])

    const board = {
      rows,
      column
    }

    reply.send(board)
    return
  }
}

const filterSuitableTeamsOnPlayer = ({ team, columnTeam, suitablePlayers, teamIds, difficulty, league, season }) => {
  const teamNotAlreadyTakenForAnotherPlayer = suitablePlayers.every(c => !c.teams.map(t => t.teamName).includes(team.name))
  const teamIsNotColumn = team.name !== columnTeam.name
  const onlyNewClubs = teamIds.every(id => team.teamId !== id)

  return teamNotAlreadyTakenForAnotherPlayer && teamIsNotColumn && onlyNewClubs && checkLeague({ team, league }) && checkSeason({ team, season }) && checkTeamPosition({ team, difficulty })
}

const getBoardTeamFromPlayer = async ({ teams, column, playersAlreadyOnBoard, playerName }) => {
  shuffleArray(teams)

  const db = await startDb()
  const Players = db.collection('players')

  for (const team of teams) {
    const playersFromTeam = (await Players.find({
      allTeams: {
        $not: {
          $elemMatch: {
            name: column.team.teamName
          }
        }
      },
      'boardTeams.name': team.teamName,
      name: { $nin: playersAlreadyOnBoard }
    }).toArray())

    if (playersFromTeam.length < 4) continue

    shuffleArray(playersFromTeam)
    const players = playersFromTeam.slice(0, 4).map(p => p.name)
    players.push(playerName)

    return {
      active: true,
      players,
      team
    }
  }

  return {
    active: false
  }
}

module.exports = {
  generateBoardHandler
}
