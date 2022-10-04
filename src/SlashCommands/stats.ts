import format from "format-duration";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandType } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Check some statistics of the bot.")
    .setDMPermission(false),
  async execute(client, interaction) {
    const formatedTime = format(client.uptime!);

    const em = new InfoEmbed(client)
      .setTitle("Statistics of the shard this guild is on.")
      .addFields(
        {
          name: "Shard Id",
          value: client.shard!.ids[0].toString(),
          inline: true,
        },
        {
          name: "# of guilds",
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
        {
          name: "# of users",
          value: client.guilds.cache
            .reduce((a, g) => a + g.memberCount, 0)
            .toString(),
          inline: true,
        },
        {
          name: "# of shards",
          value: client.shard!.count.toString(),
          inline: true,
        },
        {
          name: "API Ping",
          value: client.ws.ping.toString(),
          inline: true,
        },
        {
          name: "Uptime",
          value: formatedTime,
          inline: true,
        }
      );

    return await interaction.reply({ embeds: [em] });
  },
} as SlashCommandType;
