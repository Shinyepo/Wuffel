import { Message, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

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

      const audit = await fetchAudit(message.guild, "MESSAGE_DELETE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as User).id === message.author.id)
          em.addField("Deleted by", audit!.executor!.toString());
      }

    return channel.send({ embeds: [em] });
  },
} as EventType;
