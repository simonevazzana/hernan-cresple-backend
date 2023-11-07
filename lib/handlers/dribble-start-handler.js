const { startDb } = require('../db')
const { shuffleArray } = require('../utils/array-utils')
const { checkTeamPosition } = require('../utils/boolean-utils')
const { getPositionQueryPlayer } = require('../utils/db-query-utils')

const dribbleStartHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')
  const Teams = db.collection('teams')

  let { difficulty, league } = request.body
  if (!difficulty) difficulty = 'random'

  let endPlayer, startPlayer

  while (!endPlayer) {
    startPlayer = (await Players.aggregate([
      { $match: { active: true, ...getPositionQueryPlayer({ difficulty, league }) } },
      { $sample: { size: 1 } }
    ]).toArray())[0]

    const { boardTeams } = startPlayer

    const teamsForDifficulty = boardTeams.filter(team => checkTeamPosition({ team, difficulty }))
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
              ...getPositionQueryPlayer({ difficulty, league }),
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
  dribbleStartHandler
}
