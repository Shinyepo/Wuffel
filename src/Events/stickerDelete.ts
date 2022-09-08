import {
    Sticker,
    TextBasedChannel,
  } from "discord.js";
  import { EventType, WuffelClient } from "../../types";
  import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
  import { InfoEmbed } from "../Utilities/embedCreator";
  
  export = {
    name: "stickerDelete",
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

      const desc = sticker.description === "" || sticker.description === null ? "*not set*" : sticker.description;
      
      const embed = new InfoEmbed(client)
        .setTitle("A sticker was deleted")
        .setColor("RED")
        .addField("Name", sticker.name!, true)
        .addField("Description", desc, true)

    if (sticker.tags) {
        embed.addField("Related emoji", ":"+sticker.tags[0] +":",true);
    }
    
    const audit = await fetchAudit(sticker.guild!, "STICKER_DELETE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as Sticker).id === sticker.id)
          embed.addField("Deleted by", audit!.executor!.toString());
      }
  
      return await channel.send({ embeds: [embed]});
    },
  } as EventType;
  