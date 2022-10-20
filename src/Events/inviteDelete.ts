import { AuditLogEvent, Guild, Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "inviteDelete",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, invite: Invite) {
    const guild = invite.guild as Guild;

    const embed = new InfoEmbed(client)
      .setTitle("A invite link was deleted")
      .setColor("Red")
      .addFields(
        { name: "Link", value: invite.toString() },
        { name: "Target channel", value: invite.channel!.toString(), inline: true}
      );

    const audit = await fetchAudit(guild, AuditLogEvent.InviteDelete);
    if (audit?.executor && audit.target) {
      if ((audit?.target as Invite).code === invite.code)
        embed.addFields({
          name: "Deleted by",
          value: audit!.executor!.toString(),
          inline: true
        });
    }

    return await logChannel.send({ embeds: [embed] });
  },
} as EventType;
