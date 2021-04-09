const database = require('./databaseUtil')
const discordClient = require('../client')

module.exports.isAllowedChannel = function (guildid, channelid) {
    const guild = discordClient.getClient().guilds.cache.get(guildid)
  const guilddatabase = database.getGuildDatabase(guild)
  console.log(guilddatabase)
    if (guilddatabase.commandchannels.length === 0) {
        return true
    }
    if (guilddatabase.commandchannels.includes(channelid)) {
        return true
    }
    return false
}

module.exports.hasDJ = function (user, guildid) {
  if (this.hasAdmin(user, guildid)) {
    return true
  }
  const guild = discordClient.getClient().guilds.cache.get(guildid)
  const guilddatabase = database.getGuildDatabase(guild)
  if (guilddatabase.djusers.includes(user.id)) {
    return true
  }
  const member = guild.members.cache.get(user.id)
  for (const memberole in member.roles.cache) {
    if (guilddatabase.djroles.includes(memberole)) {
      return true
    }
  }
  return false
}

module.exports.hasAdmin = function (user, guildid) {
  const guild = discordClient.getClient().guilds.cache.get(guildid)
  const member = guild.members.cache.get(user.id)
  return member.hasPermission('ADMINISTRATOR')
}