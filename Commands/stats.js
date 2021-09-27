const { Client, Message } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const { InfoEmbed } = require('../Utilities/embedCreator');

module.exports = {
    data: {
        name: 'stats',
        description: 'Display statistics for current shard',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     */
    async execute(client, message, args) {
        const formatedTime = prettyMilliseconds(client.uptime, { compact: true });

        const em = new InfoEmbed(message)
            .setTitle('Statistics of the shard this guild is on.')
            .addField('Shard Id', client.shard.ids[0].toString(), true)
            .addField('# of guilds', client.guilds.cache.size.toString(), true)
            .addField('# of users', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString(), true)
            .addField('# of shards', client.shard.count.toString(), true)
            .addField('API Ping', client.ws.ping.toString(), true)
            .addField('Uptime', formatedTime, true);

        message.channel.send({ embeds: [em] });


    },
};

