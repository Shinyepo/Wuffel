import { GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "channelDelete",
  on: true,
  async execute(client: WuffelClient, channel: GuildChannel) {
    const settings = await getLogSettings(
      client.em,
      channel.guild,
      "channelEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const chType = channel.type === "GUILD_STAGE_VOICE" ? "🏟️" : channel.type === "GUILD_CATEGORY" ? "🔖" : channel.type === "GUILD_VOICE" ? "🔊" : "🗒️"

    const embed = new InfoEmbed(client)
      .setTitle("A Channel was deleted.")
      .addField("Type", chType, true)
      .addField("Channel", channel.name, true)
      .addField("Category", channel.parent?.name ?? "-", true)
      .setColor("RED")

    const logChannel = channel.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
