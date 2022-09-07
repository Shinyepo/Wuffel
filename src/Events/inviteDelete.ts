import { Guild, Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
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
      .setColor("RED")
      .addField("Link", invite.toString(), true)
      .addField("Target channel", invite.channel.toString(), true);

    const auditInvite = await (await guild.fetchAuditLogs({limit: 1, type: "INVITE_DELETE"})).entries.first();

    if (auditInvite) {
        const { executor } = auditInvite;
        embed.addField("Deleted by", executor!.toString());
    }

    await logChannel.send({ embeds: [embed] });
  },
} as EventType;
