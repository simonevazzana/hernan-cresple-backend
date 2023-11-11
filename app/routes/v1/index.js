const dribbleStart = require('./dribble-start')
const playerSearch = require('./player-search')
const validLink = require('./valid-link')

async function routes (fastify) {
  fastify.route(dribbleStart)
  fastify.route(playerSearch)
  fastify.route(validLink)
}

module.exports = routes
