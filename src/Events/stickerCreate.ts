import {
    MessageActionRow,
    MessageButton,
    Sticker,
    TextBasedChannel,
  } from "discord.js";
  import { EventType, WuffelClient } from "../../types";
  import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
  import { InfoEmbed } from "../Utilities/embedCreator";
  
  export = {
    name: "stickerCreate",
    on: true,
    async execute(client: WuffelClient, sticker: Sticker) {
      const settings = await getLogSettings(
        client.em,
        sticker.guild!,
        "emojiEvents"
      );
  
      if (!settings || !settings.on || !settings.channel) return null;
  
      const channel = sticker.guild!.channels.cache.find(
        (x) => x.id === settings.channel
      ) as TextBasedChannel;
  
      if (!channel) return null;
      
      const embed = new InfoEmbed(client)
        .setTitle("A new sticker was added")
        .setThumbnail(sticker.url)
        .addField("Name", sticker.name!, true)
        .addField("Description", sticker.description!, true)

    if (sticker.tags) {
        embed.addField("Related emoji", ":"+sticker.tags[0] +":",true);
    }

    const audit = await fetchAudit(sticker.guild!, "STICKER_CREATE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as Sticker).id === sticker.id)
          embed.addField("Created by", audit!.executor!.toString());
      }
        
  
      const comp = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setURL(sticker.url)
          .setLabel("Open in Browser")
      );
  
      return await channel.send({ embeds: [embed], components: [comp] });
    },
  } as EventType;
  