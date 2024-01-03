const schema = {
  body: {
    type: 'object',
    required: ['playerId'],
    properties: {
      playerId: {
        type: 'string'
      }
    }
  }
}

module.exports = {
  schema
}
