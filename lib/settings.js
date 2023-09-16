const settings = {
  test: {
    mongoDbName: 'hernan-cresple-test',
    mongoUrl: 'mongodb://localhost:27017'
  },
  development: {
    mongoDbName: 'hernan-cresple',
    mongoUrl: 'mongodb://localhost:27017'
  },
  staging: {
    mongoDbName: 'hernan-cresple',
    mongoUrl: 'TBD'
  },
  production: {
    mongoDbName: 'hernan-cresple',
    mongoUrl: 'TBD'
  }
}

const getSettings = () => {
  const env = process.env.ENV || process.env.NODE_ENV

  if (settings[env]) return settings[env]

  return settings.development
}

module.exports = {
  getSettings
}
