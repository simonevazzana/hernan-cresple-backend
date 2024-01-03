const { finalTeamHandler } = require('../../../lib/handlers/final-team-handler')
const { schema } = require('../../schema/final-team')

module.exports = {
  method: 'POST',
  url: '/final-team',
  schema,
  handler: finalTeamHandler
}
