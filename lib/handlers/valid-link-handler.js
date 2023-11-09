const { startDb } = require('../db')

const validLinkHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')

  const { startId, endId } = request.body

  const player = await Players.findOne({ playerId: startId })
  if (!player) throw new Error(`No player exists linked to startId ${startId}`)

  const valid = player.teamMates.findIndex(teamMate => teamMate.playerId === endId) !== -1

  reply.send({
    valid
  })
}

module.exports = {
  validLinkHandler
}
