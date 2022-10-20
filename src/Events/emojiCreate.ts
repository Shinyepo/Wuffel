import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildEmoji,
  TextBasedChannel,
} from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiCreate",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, emoji: GuildEmoji) {

    const author = await emoji.fetchAuthor();
    const embed = new InfoEmbed(client)
      .setTitle("A new emoji has been added")
      .setThumbnail(emoji.url)
      .addFields({name: "Name",value: emoji.name!,inline: true},
      {name: "Uploader",value: author.toString(),inline: true},
      {name: "Is animated?",value: emoji.animated! + "",inline: true})

    const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(emoji.url)
        .setEmoji(emoji.toString())
        .setLabel("Open in Browser")
    );

    return await logChannel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
