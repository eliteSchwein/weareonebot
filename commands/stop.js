const { SlashCommand } = require('slash-create');
const permission = require('../utils/permissionUtil')
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'stop',
            description: `Stop the good Music`
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            if (typeof (ctx.guildID) === 'undefined') {
                return `This Command is only aviable on a Guild, ${ctx.user.username}!`
            }

            if (!await permission.hasDJ(ctx.user, ctx.guildID)) {
                return `You dont have the Permissions, ${ctx.user.username}!`
            }
            if (!permission.isAllowedChannel(ctx.guildID, ctx.channelID)) {
                ctx.defer(true)
                return `You cant execute this Command in this Channel, ${ctx.user.username}!`
            }
            if (typeof (discordClient.getMusicDispatcher(ctx.guildID)) !== 'undefined') {
                if (typeof (discordClient.getMusicDispatcher(ctx.guildID)) !== 'undefined') {
                    discordClient.getMusicDispatcher(ctx.guildID).destroy()
                    discordClient.setMusicDispatcher(undefined, ctx.guildID)
                }
                discordClient.getVoiceConnection(ctx.guildID).disconnect()
                return `You stopped the good Music, ${ctx.user.username}!`
            }
            return `I play currently nothing, ${ctx.user.username}!`
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!"
        }
    }
}