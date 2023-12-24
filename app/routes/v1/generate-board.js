const { generateBoardHandler } = require('../../../lib/handlers/generate-board-handler')
const { schema } = require('../../schema/generate-board')

module.exports = {
  method: 'POST',
  url: '/generate-board',
  schema,
  handler: generateBoardHandler
}
