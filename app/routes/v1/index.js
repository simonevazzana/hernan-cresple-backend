const dribbleStart = require('./dribble-start')

async function routes (fastify) {
  fastify.route(dribbleStart)
}

module.exports = routes
