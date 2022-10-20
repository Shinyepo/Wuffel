import { AuditLogEvent, Message, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "messageDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, message: Message) {
    if (message.author?.bot || !message.guild) return null;
    const content =
      message.content ?? "*Could not load message content.*";
    
    const em = new InfoEmbed(client, message)
      .setDescription(
        "A message was deleted in " +
          message.channel.toString() +
          "\n\nContent: \n" +
          content
      )
      .setColor("Red")
      .setTimestamp();

      const audit = await fetchAudit(message.guild, AuditLogEvent.MessageDelete);
      if (audit?.executor && audit.target) {
        if ((audit?.target as User).id === message.author.id)
          em.addFields({name: "Deleted by",value: audit!.executor!.toString()});
      }

    return logChannel.send({ embeds: [em] });
  },
} as EventType;
