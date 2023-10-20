const build = () => {
  const app = require('fastify')()

  app.register(require('./routes/v1'), { prefix: '/v1' })

  app.register(require('@fastify/cors'), {
    origin: [/localhost/]
  })

  app.get('/', (request, reply) => {
    reply.send({ status: 'OK' })
  })

  return app
}

module.exports = {
  build
}
