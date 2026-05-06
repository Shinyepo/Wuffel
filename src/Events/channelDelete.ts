import { ChannelType, GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "channelDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, channel: GuildChannel) {
    const chType =
      channel.type === ChannelType.GuildStageVoice
        ? "🏟️"
        : channel.type === ChannelType.GuildCategory
        ? "🔖"
        : channel.type === ChannelType.GuildVoice
        ? "🔊"
        : "🗒️";

    const embed = new InfoEmbed(client)
      .setTitle("A Channel was deleted.")
      .addFields(
        { name: "Type", value: chType },
        { name: "Channel", value: channel.name },
        { name: "Category", value: channel.parent?.name ?? "-" }
      )
      .setColor("Red");

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
