import { ChannelType, GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "channelCreate",
  on: true,
  async execute(client: WuffelClient, channel: GuildChannel) {
    const settings = await getLogSettings(
      client.em,
      channel.guild,
      "channelEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;
    const logChannel = channel.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

    const chType = channel.type === ChannelType.GuildStageVoice ? "🏟️" : channel.type === ChannelType.GuildCategory ? "🔖" : channel.type === ChannelType.GuildVoice ? "🔊" : "🗒️"

    const embed = new InfoEmbed(client)
      .setTitle("A new Channel was created.")
      .addFields({name: "Type",value: chType,inline: true},
      {name: "Channel",value: channel.toString(),inline: true},
      {name: "Category",value: channel.parent?.name ?? "-",inline: true});


    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
