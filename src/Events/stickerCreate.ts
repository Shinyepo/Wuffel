import {
  ActionRowBuilder,
  AuditLogEvent,
    ButtonBuilder,
    ButtonStyle,
    Sticker,
    TextBasedChannel,
  } from "discord.js";
  import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
  import { InfoEmbed } from "../Utilities/embedCreator";
  
  export = {
    name: "stickerCreate",
    on: true,
    async execute(client: WuffelClient, logChannel: TextBasedChannel, sticker: Sticker) {
      const desc = sticker.description === "" || sticker.description === null ? "*not set*" : sticker.description;

      const embed = new InfoEmbed(client)
        .setTitle("A new sticker was added")
        .setThumbnail(sticker.url)
        .addFields({name: "Name",value: sticker.name!},
        {name: "Description",value: desc})

    if (sticker.tags) {
        embed.addFields({name: "Related emoji",value: ":"+sticker.tags[0] +":"});
    }

    const audit = await fetchAudit(sticker.guild!, AuditLogEvent.StickerCreate);
      if (audit?.executor && audit.target) {
        if ((audit?.target as Sticker).id === sticker.id)
          embed.addFields({name: "Created by",value:  audit!.executor!.toString()});
      }
        
  
      const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setURL(sticker.url)
          .setLabel("Open in Browser")
      );
  
      return await logChannel.send({ embeds: [embed], components: [comp] });
    },
  } as EventType;
  