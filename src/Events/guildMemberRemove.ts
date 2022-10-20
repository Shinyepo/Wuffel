import { GuildMember, TextBasedChannel } from "discord.js";
import { addTraffic } from "../Services/TrafficService";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildMemberRemove",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, member: GuildMember) {
    await addTraffic(client.em, member, false);
    console.log("Added new traffic");
    // const data = await fetchAudit(member.guild, AuditLogEvent.MemberKick);
    // if (!data) {
      const avatar = member.avatarURL() ?? member.displayAvatarURL();
      const em = new InfoEmbed(client)
        .setColor("Red")
        .setTitle("A user left the server")
        .setThumbnail(avatar)
        .addFields({ name: "User", value: member.toString() });

      return await logChannel.send({ embeds: [em] });
    // }

    // if (data.target?.toString() === member.toString()) {
    //   const em = new InfoEmbed(client)
    //     .setColor("Red")
    //     .setTitle("A user has been kicked")
    //     .addFields({
    //       name: "Target",
    //       value: member.toString(),
    //       inline: true,
    //     });

    //   if (data.executor) {
    //     const mod = member.guild.members.cache.find(
    //       (x) => x.id === data.executor?.id
    //     );
    //     if (mod) {
    //       em.addFields({
    //         name: "Kicked by",
    //         value: mod?.toString(),
    //         inline: true,
    //       });
    //     }
    //   }
    //   return await logChannel.send({ embeds: [em] });
    // }
    // return;
  },
} as EventType;
