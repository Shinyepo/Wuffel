import { Collection, Message, Snowflake, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";
import { handled } from "../Utilities/scuffedEH";

export = {
  name: "messageDeleteBulk",
  on: true,
  async execute(
    client: WuffelClient,
    logChannel: TextBasedChannel,
    messages: Collection<Snowflake, Message>
  ) {
    const embed = new InfoEmbed(client)
      .setTitle("Deleted a total of " + messages.size + " messages\n")
      .setDescription(messages.first()!.channel.toString())
      .setColor("Red")
      .setTimestamp();
    let i = 1;
    for (const [_, message] of messages) {
      let content =
        message.content.length < 1
          ? "*Could not load message content.*"
          : message.author.toString() + ": " + message.content;

      if (message.embeds.length > 0)
        content =
          message.author.toString() +
          ": " +
          (message.embeds[0].title ??
            message.embeds[0].description?.substring(0, 30));

      if (i % 10 === 0) {
        await logChannel
          .send({ embeds: [embed] })
          .catch((err) => handled(client, err));
        embed.setDescription(
          message.channel.toString() + "\n\n#" + i + " " + content
        );
        i++;
        continue;
      }
      embed.data.description += "\n\n#" + i + " " + content;
      i++;
    }

    return logChannel
      .send({ embeds: [embed] })
      .catch((err) => handled(client, err));
  },
} as EventType;
