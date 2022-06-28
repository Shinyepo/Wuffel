import format from "format-duration";
import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommandType } from "../../types";
import { MessageEmbed } from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Check some statistics of the bot."),
  async execute(client, interaction) {
    const formatedTime = format(client.uptime!);

    const em = new MessageEmbed()
      .setTitle("Statistics of the shard this guild is on.")
      .addField("Shard Id", client.shard!.ids[0].toString(), true)
      .addField("# of guilds", client.guilds.cache.size.toString(), true)
      .addField(
        "# of users",
        client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toString(),
        true
      )
      .addField("# of shards", client.shard!.count.toString(), true)
      .addField("API Ping", client.ws.ping.toString(), true)
      .addField("Uptime", formatedTime, true);

    return await interaction.channel!.send({ embeds: [em] });
  },
} as SlashCommandType;
