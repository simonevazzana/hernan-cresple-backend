const { chainpionsLeagueStartHandler } = require('../../../lib/handlers/chain-start-handler')
const { schema } = require('../../schema/chain-start')

module.exports = {
  method: 'POST',
  url: '/chain-start',
  schema,
  handler: chainpionsLeagueStartHandler
}
