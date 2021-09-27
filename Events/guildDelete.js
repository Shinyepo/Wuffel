const { Client, Guild, GuildMember } = require('discord.js');
const { changeSetting } = require('../Database/dbUtilities');
const { consoleTimestamp } = require('../Utilities/timestamp');

module.exports = {
        name: 'guildDelete',
        on: true,
        /**
        * @param {Client} client Current Discord client
        * @param {Guild} guild Guild assosiated with the evvent.
        */
        async execute(client, guild) {
                await changeSetting(guild, 'active', false);
                console.log(consoleTimestamp() + ' ' + client.user.username + ' left the guild \'' + guild.name + '\'(' + guild.id + ')');
        },
};