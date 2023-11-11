const { playerSearchHandler } = require('../../../lib/handlers/player-search-handler')
const { schema } = require('../../schema/player-search')

module.exports = {
  method: 'POST',
  url: '/player-search',
  schema,
  handler: playerSearchHandler
}
