const { startDb } = require('../db')

const finalTeamHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')

  const { playerId } = request.body

  const player = await Players.findOne({ playerId })
  if (!player) throw new Error(`No player exists linked to playerId ${playerId}`)

  const { allTeams } = player

  reply.send({ team: allTeams.slice(-1)[0] })
}

module.exports = {
  finalTeamHandler
}
