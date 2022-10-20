import { ChannelType, GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "channelCreate",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, channel: GuildChannel) {

    const chType = channel.type === ChannelType.GuildStageVoice ? "🏟️" : channel.type === ChannelType.GuildCategory ? "🔖" : channel.type === ChannelType.GuildVoice ? "🔊" : "🗒️"

    const embed = new InfoEmbed(client)
      .setTitle("A new Channel was created.")
      .addFields({name: "Type",value: chType,inline: true},
      {name: "Channel",value: channel.toString(),inline: true},
      {name: "Category",value: channel.parent?.name ?? "-",inline: true});


    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
