const { SlashCommand } = require('slash-create');
const permission = require('../utils/permissionUtil')
const discordClient = require('../client')

const url = 'http://listen.housetime.fm/tunein-aac-hd'
const name = 'housetime'

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: name,
            description: `Listen to ${name}`
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            if (!await permission.hasAdmin(ctx.user, ctx.guildID)) {
                return `You dont have the Permissions, ${ctx.user.username}!`
            }
            if (!await permission.isAllowedChannel(ctx.guildID, ctx.channelID)) {
                ctx.defer(true)
                return `You cant execute this Command in this Channel, ${ctx.user.username}!`
            }
            const member = (await discordClient.getClient().guilds.fetch(ctx.guildID)).members.fetch(ctx.user.id)
            if ((await member).voice.channel) {
                const connection = await (await member).voice.channel.join();
                if (typeof (discordClient.getMusicDispatcher(ctx.guildID)) !== 'undefined') {
                    discordClient.getMusicDispatcher(ctx.guildID).destroy()
                }
                discordClient.setMusicDispatcher(connection.play(url), ctx.guildID)
                discordClient.setVoiceConnection(connection, ctx.guildID)
                discordClient.getMusicDispatcher(ctx.guildID).setVolume(0.5)
                return `Time for ${name}, ${ctx.user.username}!`
            } else {
                return `You are not in a Voice Channel, ${ctx.user.username}!`
            }
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!"
        }
    }
}