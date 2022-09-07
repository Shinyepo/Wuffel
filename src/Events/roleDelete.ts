import { Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleDelete",
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
      .setTitle("A Role was deleted.")
      .setColor("RED")
      .addField("Name", role.name, true)
      .addField("Members", role.members.size.toString(), true);

    const auditRole = (await role.guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE"})).entries.first();

    if (auditRole) {
        const { executor } = auditRole;
        embed.addField("Who?", executor!.toString(), true);
    }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
