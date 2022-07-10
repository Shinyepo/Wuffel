import { ComponentBuilder } from "@discordjs/builders";
import {
  GuildEmoji,
  MessageActionRow,
  MessageButton,
  TextBasedChannel,
} from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiCreate",
  on: true,
  async execute(client: WuffelClient, emoji: GuildEmoji) {
    const settings = await getLogSettings(
      client.em,
      emoji.guild,
      "emojiEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const channel = emoji.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    if (!channel) return null;

    const author = await emoji.fetchAuthor();
    const embed = new InfoEmbed(client)
      .setTitle("A new emoji has been added")
      .setThumbnail(emoji.url)
      .addField("Name", emoji.name!, true)
      .addField("Uploader", author.toString(), true)
      .addField("Is animated?", emoji.animated! + "", true)

    const comp = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setURL(emoji.url)
        .setEmoji(emoji)
        .setLabel("Open in Browser")
    );

    return await channel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
