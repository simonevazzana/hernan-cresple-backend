const dribbleStart = require('./dribble-start')
const validLink = require('./valid-link')

async function routes (fastify) {
  fastify.route(dribbleStart)
  fastify.route(validLink)
}

module.exports = routes
