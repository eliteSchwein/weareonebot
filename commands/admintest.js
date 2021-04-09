const { SlashCommand } = require('slash-create');
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            guildIDs: '793498992646291456',
            name: 'admintest',
            description: 'Send a Description about me.'
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            const guild = discordClient.getClient().guilds.cache.get(ctx.guildID)
            const member = guild.members.cache.get(ctx.user.id)
            console.log(member.hasPermission('ADMINISTRATOR'))
            return member.hasPermission('ADMINISTRATOR')
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}