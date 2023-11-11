const { startDb } = require('../db')

const playerSearchHandler = async (request, reply) => {
  const db = await startDb()
  const Players = db.collection('players')

  const { name } = request.body

  const nameRegex = new RegExp(name, 'i')
  const players = await Players.find({ name: nameRegex, active: true }, { projection: { _id: 0, name: 1, playerId: 1, allTeams: 1 } }).toArray()

  reply.send(players)
}

module.exports = {
  playerSearchHandler
}
