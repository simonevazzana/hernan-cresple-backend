const { dribbleStartHandler } = require('../../../lib/handlers/dribble-start-handler')
const { schema } = require('../../schema/dribble-start')

module.exports = {
  method: 'POST',
  url: '/dribble-start',
  schema,
  handler: dribbleStartHandler
}
