const { validLinkHandler } = require('../../../lib/handlers/valid-link-handler')
const { schema } = require('../../schema/valid-link')

module.exports = {
  method: 'POST',
  url: '/valid-link',
  schema,
  handler: validLinkHandler
}
