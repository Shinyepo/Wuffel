import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildEmoji,
  TextBasedChannel,
} from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiUpdate",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {

    const oldName = oldEmoji.name;

    const embed = new InfoEmbed(client)
      .setTitle("A name of the emoji was changed")
      .setThumbnail(newEmoji.url);

    if (oldEmoji.available !== newEmoji.available) {
      embed
        .setTitle("Emoji is no longer available")
        .addFields({name: "Name",value: newEmoji.name!,inline: true})
        .setColor("Red");
    }

    if (oldEmoji.name !== newEmoji.name) {
      embed
        .addFields({name: "Old name",value: oldName!,inline: true},
        {name: "New name",value: newEmoji.name!,inline: true});
    }
    const author = await oldEmoji.fetchAuthor();

    embed
      .addFields({name: "Uploader",value: author.toString(),inline: true},
      {name: "Is animated?",value: newEmoji.animated! + "",inline: true});
      
    const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(newEmoji.url)
        .setEmoji(newEmoji.toString())
        .setLabel("Open in Browser")
    );

    return await logChannel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
