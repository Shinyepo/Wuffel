import { AuditLogEvent, Sticker, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "stickerDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, sticker: Sticker) {

    const desc =
      sticker.description === "" || sticker.description === null
        ? "*not set*"
        : sticker.description;

    const embed = new InfoEmbed(client)
      .setTitle("A sticker was deleted")
      .setColor("Red")
      .addFields(
        { name: "Name", value: sticker.name! },
        { name: "Description", value: desc }
      );

    if (sticker.tags) {
      embed.addFields({
        name: "Related emoji",
        value: ":" + sticker.tags[0] + ":",
      });
    }

    const audit = await fetchAudit(sticker.guild!, AuditLogEvent.StickerDelete);
    if (audit?.executor && audit.target) {
      if ((audit?.target as Sticker).id === sticker.id)
        embed.addFields({
          name: "Deleted by",
          value: audit!.executor!.toString(),
        });
    }

    return await logChannel.send({ embeds: [embed] });
  },
} as EventType;
