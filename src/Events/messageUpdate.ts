import { Message, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";
import { handled } from "../Utilities/scuffedEH";

export = {
  name: "messageUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    logChannel: TextBasedChannel,
    oldMessage: Message,
    newMessage: Message
  ) {
    if (oldMessage.author?.bot || !oldMessage.guild) return null;
    if (oldMessage.content === newMessage.content) return null;
    const content = oldMessage.content ?? "*Could not load message content.*";

    const em = new InfoEmbed(client, oldMessage).setDescription(
      "A message was edited in " +
        oldMessage.channel.toString() +
        "\n\nOld content: \n" +
        (content.length > 200 ? content.substring(0, 199) + "..." : content) +
        "\n\nNew content: \n" +
        (newMessage.content.length > 200
          ? newMessage.content.substring(0, 199) + "..."
          : newMessage.content)
    );

    return logChannel.send({ embeds: [em] }).catch((err) => handled(client, err));
  },
} as EventType;
