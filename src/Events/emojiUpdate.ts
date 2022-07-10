import {
  GuildEmoji,
  MessageActionRow,
  MessageButton,
  TextBasedChannel,
} from "discord.js";
import { EventType } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "emojiUpdate",
  on: true,
  async execute(client, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
    const settings = await getLogSettings(
      client.em,
      oldEmoji.guild,
      "emojiEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const channel = oldEmoji.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    if (!channel) return null;

    const oldName = oldEmoji.name;

    const embed = new InfoEmbed(client)
      .setTitle("A name of the emoji was changed")
      .setThumbnail(newEmoji.url);

    if (oldEmoji.available !== newEmoji.available) {
      embed
        .setTitle("Emoji is no longer available")
        .addField("Name", newEmoji.name!, true)
        .setColor("RED");
    }

    if (oldEmoji.name !== newEmoji.name) {
      embed
        .addField("Old name", oldName!, true)
        .addField("New name", newEmoji.name!, true);
    }
    const author = await oldEmoji.fetchAuthor();

    embed
      .addField("Uploader", author.toString(), true)
      .addField("Is animated?", newEmoji.animated! + "", true);
      
    const comp = new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle("LINK")
        .setURL(newEmoji.url)
        .setEmoji(newEmoji)
        .setLabel("Open in Browser")
    );

    return await channel.send({ embeds: [embed], components: [comp] });
  },
} as EventType;
