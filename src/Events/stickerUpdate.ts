import {
  ActionRowBuilder,
  AuditLogEvent,
    ButtonBuilder,
    ButtonStyle,
    Sticker,
    TextBasedChannel,
  } from "discord.js";
  import { EventType, WuffelClient } from "Wuffel/types";
import { fetchAudit } from "../Utilities/auditFetcher";
  import { InfoEmbed } from "../Utilities/embedCreator";
  
  export = {
    name: "stickerUpdate",
    on: true,
    async execute(client: WuffelClient, logChannel: TextBasedChannel, oldSticker: Sticker, newSticker: Sticker) {
      let changeCount = 0;
  
      const embed = new InfoEmbed(client)
        .setTitle("A name of the sticker was changed")
        .setThumbnail(newSticker.url);
  
      if (oldSticker.available !== newSticker.available) {
        embed
          .setTitle("Sticker is no longer available")
          .addFields({name: "Name",value: newSticker.name!})
          .setColor("Red");
          changeCount++;
      }
  
      if (oldSticker.name !== newSticker.name) {
        embed
          .addFields({name: "Old name", value: oldSticker.name!},
          {name:"New name",value: newSticker.name!});
          changeCount++;
      }
      if (oldSticker.description !== newSticker.description) {
        const oldDesc = oldSticker.description === "" || oldSticker.description === null ? "*not set*" : oldSticker.description;
        const newDesc = newSticker.description === "" || newSticker.description === null ? "*not set*" : newSticker.description;
        embed
            .addFields({name: "Old description",value: oldDesc},
            {name: "New descritpion",value: newDesc});
            changeCount++;
      }
      if (oldSticker.tags !== newSticker.tags) {
        embed
            .addFields({name: "Old emoji",value: ":" + oldSticker.tags + ":"},
            {name: "New emoji",value: ":" + newSticker.tags + ":"});
        changeCount++;
      }

      if (changeCount < 1) return;

      const audit = await fetchAudit(newSticker.guild!, AuditLogEvent.StickerUpdate);
      if (audit?.executor && audit.target) {
        if ((audit?.target as Sticker).id === newSticker.id)
          embed.addFields({name: "Updated by",value: audit!.executor!.toString()});
      }
        
      const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(newSticker.url)
          .setLabel("Open in Browser")
      );
  
      return await logChannel.send({ embeds: [embed], components: [comp] });
    },
  } as EventType;
  