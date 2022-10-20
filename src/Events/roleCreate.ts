import { AuditLogEvent, Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleCreate",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, role: Role) {

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
