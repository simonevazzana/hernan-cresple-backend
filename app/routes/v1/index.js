const chainpionsLeagueStart = require('./chain-start')
const finalTeam = require('./final-team')
const generateBoard = require('./generate-board')
const playerSearch = require('./player-search')
const validLink = require('./valid-link')

async function routes (fastify) {
  fastify.route(chainpionsLeagueStart)
  fastify.route(finalTeam)
  fastify.route(generateBoard)
  fastify.route(playerSearch)
  fastify.route(validLink)
}

module.exports = routes
