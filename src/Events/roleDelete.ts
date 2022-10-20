import { AuditLogEvent, Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "roleDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, role: Role) {
    const embed = new InfoEmbed(client)
      .setTitle("A Role was deleted.")
      .setColor("Red")
      .addFields(
        { name: "Name", value: role.name },
        { name: "Members", value: role.members.size.toString() }
      );

    const audit = await fetchAudit(role.guild, AuditLogEvent.RoleDelete);
    if (audit?.executor && audit.target) {
      if ((audit?.target as Role).id === role.id)
        embed.addFields({
          name: "Deleted by",
          value: audit!.executor!.toString(),
        });
    }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
