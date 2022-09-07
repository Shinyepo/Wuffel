import { Message, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";
import { handled } from "../Utilities/scuffedEH";

export = {
  name: "messageDelete",
  on: true,
  async execute(client: WuffelClient, message: Message) {
    if (message.author?.bot || !message.guild) return null;
    const settings = await getLogSettings(
      client.em,
      message.guild,
      "messageEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const channel = message.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    if (!channel) return null;
    const content =
      message.content ?? "*Could not load message content.*";
    
    const em = new InfoEmbed(client, message)
      .setDescription(
        "A message was deleted in " +
          message.channel.toString() +
          "\n\nContent: \n" +
          content
      )
      .setColor("RED")
      .setTimestamp();

      const deleteAudit = await (
        await message.guild.fetchAuditLogs({ type: "MESSAGE_DELETE", limit: 1 })
      ).entries.first();
  
      if (!deleteAudit) console.log("No audit found");
      else {
        const { executor, target } = deleteAudit!;
        if (target?.id === message.author.id)
          em.addField("Executor", executor!.toString());
      }

    return channel.send({ embeds: [em] });
  },
} as EventType;
