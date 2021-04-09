const { SlashCommand, CommandOptionType } = require('slash-create')
const database = require('../utils/databaseUtil')
const permission = require('../utils/permissionUtil')
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'dj',
            description: 'Manage DJ Role or User.',
            options: [{
                type: CommandOptionType.SUB_COMMAND,
                name: 'role',
                description: 'Modify Role',
                options: [{
                    type: CommandOptionType.ROLE,
                    name: 'role',
                    description: 'Select a Role.',
                    required: true
                }]
            },{
                type: CommandOptionType.SUB_COMMAND,
                name: 'user',
                description: 'Modify User',
                options: [{
                    type: CommandOptionType.USER,
                    name: 'user',
                    description: 'Select a User.',
                    required: true
                }]
            }]
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            if (typeof (ctx.guildID) === 'undefined') {
                return `This Command is only aviable on a Guild, ${ctx.user.username}!`
            }

            if (!permission.isMaster(ctx.user, ctx.guildID, discordClient)) {
                return `You dont have the Permissions, ${ctx.user.username}!`
            }
            if (!await permission.isAllowedChannel(ctx.guildID, ctx.channelID)) {
                ctx.defer(true)
                return `You cant execute this Command in this Channel, ${ctx.user.username}!`
            }

            let isRole
            let adminid

            if (ctx.subcommands[0] === 'role') {
                isRole = true
                adminid = ctx.options.role.role
            }

            if (ctx.subcommands[0] === 'user') {
                isRole = false
                adminid = ctx.options.user.user
            }

            const result = await editDJ(isRole, adminid, ctx.guildID)

            let answermention = `<@${adminid}>`

            if (isRole) {
                answermention = answermention.replace(/<@/g,'<@&')
            }

            if (result) {
                return `${answermention} is now a DJ, ${ctx.user.username}!`
            } else {
                return `${answermention} is not longer a DJ, ${ctx.user.username}!`
            }
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}

async function editDJ(isRole, djid, guildid) {
    const guild = await discordClient.getClient().guilds.fetch(guildid)
    const guilddatabase = database.getGuildDatabase(guild)
    let djarray = 'djusers'

    if (isRole) {
        djarray = 'djroles'
    }

    if (guilddatabase[djarray].includes(djid)) {
        const index = guilddatabase[djarray].indexOf(djid)
        if (index > -1) {
            guilddatabase[djarray].splice(index, 1)
        }
        database.updateDatabase(guilddatabase, guild)
        return false
    }

    guilddatabase[djarray].push(djid)
    database.updateDatabase(guilddatabase, guild)

    return true
}