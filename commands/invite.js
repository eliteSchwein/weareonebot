const { SlashCommand } = require('slash-create');
const discordClient = require('../client')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'invite',
            description: 'Get my Invite Link.'
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            return `https://discord.com/oauth2/authorize?client_id=${discordClient.getClient().user.id}&scope=applications.commands%20bot&permissions=2620451952`
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}