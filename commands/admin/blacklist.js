const Command = require("../../structures/Command.js"),
    Discord = require("discord.js");

module.exports = class extends Command {
    constructor (client) {
        super(client, {
            name: "blacklist",
            enabled: true,
            aliases: [],
            clientPermissions: [ "EMBED_LINKS" ],
            permLevel: 2
        });
    }

    async run (message, args, data) {
        const embed = new Discord.MessageEmbed()
            .setColor(data.color)
            .setFooter(data.footer);
        const action = args[0];
        switch(action){
        case "add": {
            const user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(() => {});
            if(!user) return message.error("admin/blacklist:MISSING_MEMBER_ADD");
            if(data.guild.blacklistedUsers.includes(user.id)) return message.error("admin/blacklist:ALREADY_BLACKLISTED", {
                username: user.tag
            });
            await data.guild.addUserBlacklist(user.id);
            message.success("admin/blacklist:SUCCESS_MEMBER_ADD", {
                username: user.tag
            });
            break;
        }
        case "remove": {
            const user = message.mentions.users.first() || await this.client.users.fetch(args[1]).catch(() => {});
            if(!user) return message.error("admin/blacklist:MISSING_MEMBER_REMOVE");
            if(!data.guild.blacklistedUsers.includes(user.id)) return message.error("admin/blacklist:NOT_BLACKLISTED", {
                username: user.tag
            });
            await data.guild.removeUserBlacklist(user.id);
            message.success("admin/blacklist:SUCCESS_MEMBER_REMOVE", {
                username: user.tag
            });
            break;
        }
        case "list": {
            if(data.guild.blacklistedUsers.length < 1){
                embed.setDescription(message.translate("admin/blacklist:EMPTY"));
            } else {
                const users = [];
                await this.client.functions.asyncForEach(data.guild.blacklistedUsers, async (userID) => {
                    const user = await this.client.users.fetch(userID);
                    users.push(`${user.tag} (${user.toString()})`);
                });
                embed.setDescription(users.join("\n"));
            }
            message.channel.send(embed);
            break;
        }
        default: {
            message.error("admin/blacklist:MISSING_TYPE");
        }
        }
    }

};
