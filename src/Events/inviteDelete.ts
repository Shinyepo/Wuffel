import { AuditLogEvent, Guild, Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "inviteDelete",
  on: true,
  async execute(client: WuffelClient, invite: Invite) {
    const guild = invite.guild as Guild;
    const settings = await getLogSettings(client.em, guild, "guildEvents");

    if (!settings || !settings.on || !settings.channel) return null;

    const logChannel = guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

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
