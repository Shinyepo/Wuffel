import { AuditLogEvent, Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleUpdate",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, oldRole: Role, newRole: Role) {

    const embed = new InfoEmbed(client)
      .setTitle("A Role was updated.")
      .setColor(newRole.color)
      .addFields({ name: "Members", value: newRole.members.size.toString() });

    let changeCount = 0;

    if (oldRole.name !== newRole.name) {
      embed.addFields(
        { name: "Old name", value: oldRole.name, inline: true },
        { name: "New name", value: newRole.name, inline: true }
      );
      changeCount++;
    }
    if (oldRole.color !== newRole.color) {
      embed.addFields({
        name: "Old color",
        value: oldRole.hexColor.toString(),
      },
      {name: "New color", value: newRole.color.toString(), inline: true});
      changeCount++;
    }
    if (oldRole.icon !== newRole.icon) {
      embed.addFields(
        { name: "Old icon", value: oldRole.icon ?? "*not set*" },
        { name: "Old icon", value: oldRole.icon ?? "*not set*" }
      );
      changeCount++;
    }
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      embed.addFields({
        name: "Permission change",
        value: "Some permissions were changed.",
      });
      changeCount++;
    }
    if (changeCount < 1) return;

    const audit = await fetchAudit(newRole.guild, AuditLogEvent.RoleUpdate);
    if (audit?.executor && audit.target) {
      if ((audit?.target as Role).id === newRole.id)
        embed.addFields({
          name: "Updated by",
          value: audit!.executor!.toString(),
        });
    }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
