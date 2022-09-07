import { Role, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
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

      const audit = await fetchAudit(role.guild, "ROLE_DELETE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as Role).id === role.id)
          embed.addField("Deleted by", audit!.executor!.toString());
      }

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
