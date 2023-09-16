const { MongoClient } = require('mongodb')
const { getSettings } = require('./settings')

const settings = getSettings()

const url = settings.mongoUrl
const client = new MongoClient(url)

const dbName = settings.mongoDbName

const startDb = async () => {
  await client.connect()

  const db = client.db(dbName)

  return db
}

module.exports = {
  startDb
}
