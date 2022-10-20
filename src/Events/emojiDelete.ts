import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildEmoji, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, emoji: GuildEmoji) {
    const embed = new InfoEmbed(client)
      .setTitle("Emoji has been deleted")
      .setThumbnail(emoji.url)
      .addFields({name: "Name",value: emoji.name!,inline: true},
      {name: "Was it animated?",value: emoji.animated! + "",inline: true})
      .setColor("Red")

    const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(emoji.url)
        .setLabel("Open in Browser")
    );

    return await logChannel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
