const { startDb } = require('../db')
const { shuffleArray } = require('../utils/array-utils')
const { checkTeamPosition, checkSeason, checkLeague } = require('../utils/boolean-utils')
const { chainpionsLeagueStartQuery } = require('../utils/db-query-utils')

const chainpionsLeagueStartHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')
  const Teams = db.collection('teams')

  let { difficulty, league, season } = request.body
  if (!difficulty) difficulty = 'random'

  let endPlayer, startPlayer

  while (!endPlayer) {
    startPlayer = (await Players.aggregate([
      { $match: { active: true, ...chainpionsLeagueStartQuery({ difficulty, league, season }) } },
      { $sample: { size: 1 } }
    ]).toArray())[0]
    if (!startPlayer) throw new Error(`No team is compatible with your params (difficulty: '${difficulty}', league: '${league || 'any'}', season: '${season || 'any'}')`)

    const { boardTeams } = startPlayer

    const teamsForDifficulty = boardTeams.filter(team => checkTeamPosition({ team, difficulty }) && checkSeason({ team, season }) && checkLeague({ team, league }))
    shuffleArray(teamsForDifficulty)

    const teamBase = teamsForDifficulty[0]

    const team = await Teams.findOne({ season: teamBase.season, teamId: teamBase.teamId })
    const teamMatesFromFirstTeam = team.boardPlayers.map(p => p.playerId)

    endPlayer = (await Players.aggregate([
      {
        $match:
            {
              playerId: { $ne: startPlayer.playerId },
              active: true,
              ...chainpionsLeagueStartQuery({ difficulty, league, season }),
              $and: [
                {
                  'teamMates.playerId': { $ne: startPlayer.playerId }
                },
                {
                  'teamMates.playerId': { $in: teamMatesFromFirstTeam }
                }
              ]
            }
      },
      { $sample: { size: 1 } }
    ]).toArray())[0]
  }

  const firstLevelLinks = startPlayer.teamMates.filter(p => endPlayer.teamMates.map(p => p.playerId).includes(p.playerId))

  reply.send({
    startPlayer: {
      name: startPlayer.name,
      playerId: startPlayer.playerId
    },
    endPlayer: {
      name: endPlayer.name,
      playerId: endPlayer.playerId
    },
    firstLevelLinks
  })
}

module.exports = {
  chainpionsLeagueStartHandler
}
