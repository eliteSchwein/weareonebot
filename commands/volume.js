const { SlashCommand, CommandOptionType } = require('slash-create');
const permission = require('../utils/permissionUtil')
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            guildIDs: '793498992646291456',
            name: 'volume',
            description: 'Modify the volume (0-100%).',
            options: [{
                type: CommandOptionType.INTEGER,
                name: 'volume',
                description: 'Volume from 0 to 100.',
                required: true
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

            const newvolume = (1.0 / 100) * ctx.options.volume
            console.log(newvolume)

            if (newvolume > 0) {
                return `min Volume is 0%, ${ctx.user.username}!`
            }

            if (newvolume < 100) {
                return `max Volume is 100%, ${ctx.user.username}!`
            }

            discordClient.getMusicDispatcher().setVolume(newvolume)

            return `new Volume is ${newvolume}%, ${ctx.user.username}!`
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}