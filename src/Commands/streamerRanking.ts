import { StreamLeaderboard } from "../Entities/StreamLeaderboard";
import { CommandType } from "../../types";
import prettyMilliseconds from "pretty-ms";
import { LeaderboardEmbed } from "../Utilities/embedCreator";

const emotes = ['🥇', '🥈', '🥉', '<:medal4:831979903049007114>', '<:medal5:831979917230735381>'];

export = {
    data: {
        name: 'sr',
        aliases: ['streamers', 'sranking', 'srank', 'streameranking'],
        description: 'Display top5 streamers discord streamers',
    },
    
    async execute({ em }, message, __) {
        const leaderboard = await em.find(StreamLeaderboard, { guildId: message.guildId });
        if (leaderboard.length < 1) {
            const embed = new LeaderboardEmbed(message);
            embed.setTitle("Top 0 discord streamers");
            embed.setDescription("There is no data yet. Start streaming now to claim 1st place!")
            return await message.channel.send({embeds: [embed]});
        }

        let data = '';
        let i = 0;
        while (i < 5 && i < leaderboard.length){
            const userData = leaderboard[i];
            const member = message.guild!.members.cache.get(userData.userId);
            if (!member) continue;
            const formatedTime = prettyMilliseconds(parseInt(userData.timeStreamed), { compact: true, verbose: true });
            const name = member?.nickname ?? member?.user.username;
            data += emotes[i] + ' **' + name + '** ' + formatedTime + '\n';
            i++;
        }

        const embed = new LeaderboardEmbed(message);
        embed.setTitle(`Top ${i} discord streamers`);
        embed.setDescription(data);
        return await message.channel.send({ embeds: [embed] });
    },
} as CommandType;