import { ChannelType } from "discord-api-types/v9";
import { GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "channelUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    oldChannel: GuildChannel,
    newChannel: GuildChannel
  ) {
    if (!oldChannel.guild) return null;
    const settings = await getLogSettings(
      client.em,
      oldChannel.guild,
      "channelEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const chType =
      oldChannel.type === "GUILD_STAGE_VOICE"
        ? "🏟️"
        : oldChannel.type === "GUILD_CATEGORY"
        ? "🔖"
        : oldChannel.type === "GUILD_VOICE"
        ? "🔊"
        : "🗒️";
    console.log("!");

    for (const [key, value] of Object.entries(oldChannel)) {
      const newValue = (newChannel as any)[key];

      if (value !== newValue) console.log(key + ": "+value + ":" + newValue);
    }

    const embed = new InfoEmbed(client)
      .setTitle("A Channel was deleted.")
      .addField("Channel", oldChannel.toString(), true)
      .addField("Type", chType, true)
      .addField("Category", oldChannel.parent?.name ?? "-", true)
      .setColor("RED");

    const logChannel = oldChannel.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
