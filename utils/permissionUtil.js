const config = require('../config.json')
const database = require('./databaseUtil')
const discordClient = require('../client')

module.exports.isAllowedChannel = async function (guildid, channelid) {
    const guild = await discordClient.getClient().guilds.fetch(guildid)
    const guilddatabase = database.getGuildDatabase(guild)
    if (guilddatabase.commandchannels.length === 0) {
        return true
    }
    if (guilddatabase.commandchannels.includes(channelid)) {
        return true
    }
    return false
}

module.exports.hasDJ = async function (user, guildid, altdiscordClient) {
  if (this.hasAdmin(user, guildid, altdiscordClient)) {
    return true
  }
  let client
  if (typeof (altdiscordClient) !== 'undefined') {
    client = altdiscordClient
  } else {
    client = discordClient.getClient()
  }
  const guild = client.guilds.cache.get(guildid)
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

module.exports.hasAdmin = function (user, guildid, altdiscordClient) {
  let client
  if (typeof (altdiscordClient) !== 'undefined') {
    client = altdiscordClient
  } else {
    client = discordClient.getClient()
  }
  const guild = client.guilds.cache.get(guildid)
  const member = guild.members.cache.get(user.id)
  return member.hasPermission('ADMINISTRATOR')
}