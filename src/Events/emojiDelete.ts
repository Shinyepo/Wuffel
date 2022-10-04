import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildEmoji, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiDelete",
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

    return await channel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
