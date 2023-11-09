const schema = {
  body: {
    type: 'object',
    required: ['startId', 'endId'],
    properties: {
      startId: {
        type: 'string'
      },
      endId: {
        type: 'string'
      }
    }
  }
}

module.exports = {
  schema
}
