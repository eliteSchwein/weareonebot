const database = require('./databaseUtil')
const discordClient = require('../client')

module.exports.isAllowedChannel = async function (guildid, channelid) {
  const guild = await discordClient.getClient().guilds.fetch(guildid)
  const guilddatabase = database.getDatabase(guild)
  if (typeof (guilddatabase.commandchannels) === 'undefined') {
    return true
  }
  if (guilddatabase.commandchannels.length === 0) {
      return true
  }
  if (guilddatabase.commandchannels.includes(channelid)) {
      return true
  }
  return false
}

module.exports.hasDJ = async function (user, guildid) {
  if (await this.hasAdmin(user, guildid)) {
    return true
  }
  const guild = await discordClient.getClient().guilds.fetch(guildid)
  const guilddatabase = database.getGuildDatabase(guild)
  if (guilddatabase.djusers.includes(user.id)) {
    return true
  }
  const member = await guild.members.fetch(user.id)
  if (guilddatabase.djroles.some(role => member.roles.cache.has(role))) {
    return true
  }
  return false
}

module.exports.hasAdmin = async function (user, guildid) {
  const guild = await discordClient.getClient().guilds.fetch(guildid)
  const member = await guild.members.fetch(user.id)
  return member.hasPermission('ADMINISTRATOR')
}