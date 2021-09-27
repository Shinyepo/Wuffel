const { Client, Message } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const { getStreamerRanking } = require('../Database/dbUtilities');
const { LeaderboardEmbed } = require('../Utilities/embedCreator');

const emotes = ['🥇', '🥈', '🥉', '<:medal4:831979903049007114>', '<:medal5:831979917230735381>'];

module.exports = {
    data: {
        name: 'sr',
        aliases: ['streamers', 'sranking', 'srank', 'streameranking'],
        description: 'Display top5 streamers discord streamers',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     */
    async execute(client, message, args) {
        const leaderboard = await getStreamerRanking(message.guild);

        let data = '';
        for (let i = 0; i < leaderboard.length && i < 5; i++) {
            const user = leaderboard[i];
            const member = message.guild.members.cache.get(user.userId);
            const formatedTime = prettyMilliseconds(user.timeStreamed, { compact: true, verbose: true });
            const name = member.nickname ?? member.user.username;
            data += emotes[i] + ' **' + name + '** ' + formatedTime + '\n';
        }

        const embed = new LeaderboardEmbed(message);
        embed.setTitle('Top 5 discord streamers');
        embed.setDescription(data);
        await message.channel.send({ embeds: [embed] });
    },
};