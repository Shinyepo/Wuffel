const { Client, Guild, GuildMember } = require('discord.js');
const { createDefaultSettings } = require('../Database/dbUtilities');
const { consoleTimestamp } = require('../Utilities/timestamp');

module.exports = {
        name: 'guildCreate',
        on: true,
        /**
        * @param {Client} client Current Discord client
        * @param {Guild} guild Guild assosiated with the evvent.
        */
        async execute(client, guild) {
                await createDefaultSettings(guild);
                console.log(consoleTimestamp() + ' ' + client.user.username + ' joined new guild \'' + guild.name + '\'(' + guild.id + ')');
        },
};