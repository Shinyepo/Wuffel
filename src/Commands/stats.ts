import format from "format-duration";
import { CommandType } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator"

export = {
    data: {
        name: 'stats',
        description: 'Display statistics for current shard',
    },
    permissionLevel: "all",
    async execute(client, message, _) {
        const formatedTime = format(client.uptime!);

        const em = new InfoEmbed(client, message)
            .setTitle('Statistics of the shard this guild is on.')
            .addField('Shard Id', client.shard!.ids[0].toString(), true)
            .addField('# of guilds', client.guilds.cache.size.toString(), true)
            .addField('# of users', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString(), true)
            .addField('# of shards', client.shard!.count.toString(), true)
            .addField('API Ping', client.ws.ping.toString(), true)
            .addField('Uptime', formatedTime, true);

        message.channel.send({ embeds: [em] });
    },
} as CommandType;

