const databasepath = '../database.json'
const fs = require('fs')
const path = require('path')
const logSymbols = require('log-symbols');

module.exports = {}

module.exports.getGuildDatabase = function (guild) {
  const database = require(databasepath)
  if (typeof database.guilds[guild.id] === 'undefined') {
    console.log(logSymbols.info, `No Database for ${guild.name} found!\nGenerate base config!`.database)
    database.guilds[guild.id] = {
      commandchannels: [],
      adminusers: [],
      adminroles: []
    }
    this.updateDatabase(database.guild[guild.id], guild)
  }
  return database.guilds[guild.id]
}
module.exports.getDatabase = function () {
  return require(databasepath)
}
module.exports.updateDatabase = function (data, guild) {
  const database = require(databasepath)
  database.guilds[guild.id] = data
  fs.writeFile(path.resolve(__dirname, databasepath), JSON.stringify(database), (err) => {
    if (err) { throw err }
    console.log(logSymbols.info, 'The Database has been saved!'.database)
  })
}