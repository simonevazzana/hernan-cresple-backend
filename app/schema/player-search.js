const schema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string'
      }
    }
  }
}

module.exports = {
  schema
}
