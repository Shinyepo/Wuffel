import { Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleCreate",
  on: true,
  async execute(client: WuffelClient, role: Role) {
    const settings = await getLogSettings(
      client.em,
      role.guild,
      "guildEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;
    const logChannel = role.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;
        
    const embed = new InfoEmbed(client)
      .setTitle("A new Role was created.")
      .setColor(role.color)
      .addField("Name", role.name, true);

    const auditRole = (await role.guild.fetchAuditLogs({limit: 1, type: "ROLE_CREATE"})).entries.first();

    if (auditRole) {
        const { executor } = auditRole;
        embed.addField("Creator", executor!.toString(), true);
    }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
