import { Collection, Message, Snowflake, TextChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";
import { handled } from "../Utilities/scuffedEH";

export = {
  name: "messageDeleteBulk",
  on: true,
  async execute(
    client: WuffelClient,
    messages: Collection<Snowflake, Message>
  ) {
    const settings = await getLogSettings(
      client.em,
      messages.first()!.guild!,
      "messageEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;
    const guild = messages.first()?.guild;
    const channel = guild?.channels.cache.find(
      (x) => x.id === "985163154092855308"
    ) as TextChannel;
    if (!channel) return;

    const embed = new InfoEmbed(client)
      .setTitle("Deleted a total of " + messages.size + " messages\n")
      .setDescription(messages.first()!.channel.toString())
      .setColor("RED")
      .setTimestamp();
    let i = 1;
    for (const [_, message] of messages) {
      let content =
        message.content.length < 1
          ? "*Could not load message content.*"
          : message.author.toString() + ": " + message.content;

      if (message.embeds.length > 0)
        content =
        message.author.toString() + ": " + (message.embeds[0].title ?? message.embeds[0].description?.substring(0, 30) );

      if (i % 10 === 0) {
        await channel.send({ embeds: [embed] }).catch((err) => handled(client, err));
        embed.setDescription(message.channel.toString() + "\n\n#"+ i + " " + content);
        i++;
        continue;
      }
      embed.description += "\n\n#"+ i + " " + content;
      i++;
    }

    return channel.send({ embeds: [embed] }).catch((err) => handled(client, err));
  },
} as EventType;
