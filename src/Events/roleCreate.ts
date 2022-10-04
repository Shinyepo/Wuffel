import { AuditLogEvent, Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleCreate",
  on: true,
  async execute(client: WuffelClient, role: Role) {
    const settings = await getLogSettings(client.em, role.guild, "guildEvents");

    if (!settings || !settings.on || !settings.channel) return null;
    const logChannel = role.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

    const embed = new InfoEmbed(client)
      .setTitle("A new Role was created.")
      .setColor(role.color)
      .addFields({ name: "Name", value: role.name });

    const audit = await fetchAudit(role.guild, AuditLogEvent.RoleCreate);
    if (audit?.executor && audit.target) {
      if ((audit?.target as Role).id === role.id)
        embed.addFields({
          name: "Created by",
          value: audit!.executor!.toString(),
        });
    }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
