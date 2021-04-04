const { SlashCommand, CommandOptionType } = require('slash-create');
const database = require('../utils/databaseUtil')
const permission = require('../utils/permissionUtil')
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'editchannel',
            description: 'Add or Remove command channel.',
            options: [{
                type: CommandOptionType.CHANNEL,
                name: 'channel',
                description: 'Select a Channel to add/remove it as command channel.',
                required: false
            }]
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

            let channel
            let channelresult

            if (typeof (ctx.options.channel) === 'undefined') {
                channelresult = await editChannel(ctx.channelID, ctx.guildID)
                channel = 'This Channel'
            } else {
                channelresult = await editChannel(ctx.options.channel, ctx.guildID)
                channel = `<#${ctx.options.channel}>`
            }

            if (typeof (channelresult) === 'undefined') {
                return `${channel} is not a Text Channel, ${ctx.user.username}!`
            }

            if (channelresult) {
                return `${channel} is now a Command Channel, ${ctx.user.username}!`
            } else {
                return `${channel} is not longer a Command Channel, ${ctx.user.username}!`
            }
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}
async function editChannel(channelid, guildid) {
    const guild = await discordClient.getClient().guilds.fetch(guildid)
    const channel = await discordClient.getClient().channels.fetch(channelid)
    const guilddatabase = database.getGuildDatabase(guild)

    if (channel.type !== 'text') {
        return undefined
    }
    if (guilddatabase.commandchannels.includes(channelid)) {
        const index = guilddatabase.commandchannels.indexOf(channelid)
        if (index > -1) {
            guilddatabase.commandchannels.splice(index, 1)
        }
        database.updateDatabase(guilddatabase, guild)
        return false
    }

    guilddatabase.commandchannels.push(channelid)
    database.updateDatabase(guilddatabase, guild)

    return true
}