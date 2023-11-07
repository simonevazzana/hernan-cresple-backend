const schema = {
  body: {
    type: 'object',
    properties: {
      difficulty: {
        type: 'string'
      },
      league: {
        type: 'string'
      }
    }
  }
}

module.exports = {
  schema
}
