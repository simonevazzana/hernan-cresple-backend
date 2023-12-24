const schema = {
  body: {
    type: 'object',
    properties: {
      difficulty: {
        type: 'string'
      },
      league: {
        type: 'string'
      },
      season: {
        type: 'integer'
      }
    }
  }
}

module.exports = {
  schema
}
