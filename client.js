const Discord = require('discord.js')
const path = require('path')
const { GatewayServer, SlashCreator } = require('slash-create')
const { waitUntil } = require('async-wait-until')

const config = require('./config.json')

let musicdispatcher = {}
let voiceconnection = {}

const discordClient = new Discord.Client()

let connected = false

function enableEvents() {
    console.log('  Enable Discord Events'.statusmessage)
    
}

function loginBot() {
  console.log('  Connect Discord Bot'.statusmessage)

  discordClient.login(config.bottoken)

  discordClient.on('ready', () => {
    connected = true
    console.log(`  ${'Discordbot Connected'.success}
    ${'Name:'.successname} ${(discordClient.user.tag).successvalue}
    ${'Invite:'.successname} ${`https://discord.com/oauth2/authorize?client_id=${discordClient.user.id}&scope=applications.commands%20bot&permissions=2620451952`.successvalue}`)
    discordClient.user.setActivity('WeAreOne.fm', { type: 'LISTENING' })
  })
}

function enableCommands() {
  console.log('  Sync Slash Commands'.statusmessage)

  const creator = new SlashCreator({
    applicationID: config.botapplicationid,
    publicKey: config.botapplicationkey,
    token: config.bottoken,
  });

  creator
    .registerCommandsIn(path.join(__dirname, './commands'))
    .syncCommands();
  
  creator
    .withServer(
      new GatewayServer(
        (handler) => discordClient.ws.on('INTERACTION_CREATE', handler)
      )
    );
}

module.exports = {}
module.exports.init = async () => {
  console.log(`\n
  ${
  ` ___  _                   _
  |   \\(_)___ __ ___ _ _ __| |
  | |) | (_-</ _/ _ \\ '_/ _\` |
  |___/|_/__/\\__\\___/_| \\__,_|`.statustitle}
                              `)
  loginBot()
  await waitUntil(() => connected === true)
  enableCommands()
  enableEvents()
  
}
module.exports.isConnected = function() { return connected }
module.exports.getClient = function () { return discordClient }
module.exports.getMusicDispatcher = function (guildid) { return musicdispatcher[guildid] }
module.exports.setMusicDispatcher = function (dispatcher, guildid) { musicdispatcher[guildid] = dispatcher }
module.exports.getVoiceConnection = function (guildid) { return voiceconnection[guildid] }
module.exports.setVoiceConnection = function(connection, guildid) { voiceconnection[guildid] = connection}