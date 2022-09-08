import {
    MessageActionRow,
    MessageButton,
    Sticker,
    TextBasedChannel,
  } from "discord.js";
  import { EventType } from "Wuffel/types";
  import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
  import { InfoEmbed } from "../Utilities/embedCreator";
  
  export = {
    name: "stickerUpdate",
    on: true,
    async execute(client, oldSticker: Sticker, newSticker: Sticker) {
      const settings = await getLogSettings(
        client.em,
        newSticker.guild!,
        "emojiEvents"
      );
  
      if (!settings || !settings.on || !settings.channel) return null;
  
      const channel = newSticker.guild!.channels.cache.find(
        (x) => x.id === settings.channel
      ) as TextBasedChannel;
  
      if (!channel) return null;
      let changeCount = 0;
  
      const embed = new InfoEmbed(client)
        .setTitle("A name of the sticker was changed")
        .setThumbnail(newSticker.url);
  
      if (oldSticker.available !== newSticker.available) {
        embed
          .setTitle("Sticker is no longer available")
          .addField("Name", newSticker.name!, true)
          .setColor("RED");
          changeCount++;
      }
  
      if (oldSticker.name !== newSticker.name) {
        embed
          .addField("Old name", oldSticker.name!, true)
          .addField("New name", newSticker.name!, true);
          changeCount++;
      }
      if (oldSticker.description !== newSticker.description) {
        const oldDesc = oldSticker.description === "" || oldSticker.description === null ? "*not set*" : oldSticker.description;
        const newDesc = newSticker.description === "" || newSticker.description === null ? "*not set*" : newSticker.description;
        embed
            .addField("Old description", oldDesc, true)
            .addField("New descritpion", newDesc,true);
            changeCount++;
      }
      if (oldSticker.tags !== newSticker.tags) {
        embed
            .addField("Old emoji",":" + oldSticker.tags + ":",true)
            .addField("New emoji",":" + newSticker.tags + ":",true);
        changeCount++;
      }

      if (changeCount < 1) return;

      const audit = await fetchAudit(newSticker.guild!, "STICKER_UPDATE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as Sticker).id === newSticker.id)
          embed.addField("Updated by", audit!.executor!.toString());
      }
        
      const comp = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle("LINK")
          .setURL(newSticker.url)
          .setLabel("Open in Browser")
      );
  
      return await channel.send({ embeds: [embed], components: [comp] });
    },
  } as EventType;
  