const { SlashCommand } = require('slash-create');
const Discord = require('discord.js')
const path = require('path')
const fs = require('fs')

const database = require('../utils/databaseUtil')

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        super(creator, {
            guildIDs: '793498992646291456',
            name: 'metric',
            description: 'Show how the Server listen.'
        });
        this.filePath = __filename;
    }

    async run(ctx) {
        try {
            if (typeof (ctx.guildID) === 'undefined') {
                return `This Command is only aviable on a Guild, ${ctx.user.username}!`
            }

            ctx.defer(false)
        
            const logopath = path.resolve(__dirname, '../images/logo.png')

            const logobuffer = fs.readFileSync(logopath)

            const infoEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Metric')
                .setThumbnail('attachment://logo.png')
                
            const guilddatabase = database.getDatabase()[ctx.guildID]

            console.log(guilddatabase)

            for (let station in guilddatabase.metric) {
                infoEmbed.addField(station, guilddatabase.metric[station], true)
            }

            await ctx.send({
                file: {
                    name: 'logo.png',
                    file: logobuffer
                },
                embeds: [infoEmbed.toJSON()]
            });
        }
        catch (err) {
            console.log((err).error)
            return "An Error occured!";
        }
    }
}