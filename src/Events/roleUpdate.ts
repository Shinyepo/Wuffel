import { Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleUpdate",
  on: true,
  async execute(client: WuffelClient, oldRole: Role, newRole: Role) {
    const settings = await getLogSettings(
      client.em,
      newRole.guild,
      "guildEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;
    const logChannel = newRole.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

    console.log({oldRole, newRole});

    const embed = new InfoEmbed(client)
      .setTitle("A Role was updated.")
      .setColor(newRole.color)
      .addField("Members", newRole.members.size.toString(),true);

    let changeCount = 0;



    if (oldRole.name !== newRole.name) {
        embed.addField("Old name", oldRole.name, true)
        .addField("New name", newRole.name, true);
        changeCount++;
    }
    if (oldRole.color !== newRole.color) {
        embed.addField("Old color", oldRole.hexColor.toString(), true);
        changeCount++;
    }
    if (oldRole.icon !== newRole.icon) {
        embed.addField("Old icon", oldRole.icon ?? "*not set*", true)
        .addField("Old icon", oldRole.icon ?? "*not set*", true);
        changeCount++;
    }
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
        embed.addField("Permission change", "Some permissions were changed.")
        changeCount++;
    }
    if (changeCount < 1) return;

    const auditRole = (
      await newRole.guild.fetchAuditLogs({ limit: 1, type: "ROLE_CREATE" })
    ).entries.first();

    if (auditRole) {
      const { executor } = auditRole;
      embed.addField("Who?", executor!.toString(), true);
    }

    
    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
