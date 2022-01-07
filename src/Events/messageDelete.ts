import { Message, TextBasedChannels } from "discord.js";
import { InfoEmbed } from "../Utilities/embedCreator";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";

export = {
  name: "messageDelete",
  on: true,
  async execute(client: WuffelClient, message: Message) {
    if (message.author.bot || !message.guild) return null;
    const settings = await getLogSettings(client.em, message.guild, "messageEvents");
    if (!settings || !settings.on || !settings.channel) return null;
    
    const em = new InfoEmbed(message).setTitle(
      "A message was deleted in " + message.channel
    )
    .setDescription("Content: \n" + message.content)
    .setTimestamp();

    const channel = message.guild.channels.cache.find(x=>x.id === settings.channel) as TextBasedChannels;
    if (!channel) return null;


    return await channel.send({embeds: [em]});
  },
} as EventType;
