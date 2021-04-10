const database = require('./databaseUtil')
const discordClient = require('../client')

module.exports.isAllowedChannel = function (guildid, channelid) {
  const guilddatabase = database.getDatabase().guilds[guildid]
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
  for (const memberole in member.roles.cache) {
    if (guilddatabase.djroles.includes(memberole)) {
      return true
    }
  }
  return false
}

module.exports.hasAdmin = async function (user, guildid) {
  const guild = await discordClient.getClient().guilds.fetch(guildid)
  const member = await guild.members.fetch(user.id)
  console.log(member.hasPermission('ADMINISTRATOR'))
  return member.hasPermission('ADMINISTRATOR')
}