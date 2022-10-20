import { GuildMember, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { queueChange } from "../Services/RoleChangeService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildMemberUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    logChannel: TextBasedChannel,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    let n = 0;

    const em = new InfoEmbed(client)
      .setTitle("A member has changed his profile")
      .setColor("Blue")
      .addFields({ name: "User", value: newMember.toString(), inline: false });

    if (oldMember.nickname !== newMember.nickname) {
      em.addFields(
        {
          name: "Old nickname",
          value: oldMember.nickname ?? "*not set*",
          inline: true,
        },
        {
          name: "New nickname",
          value: newMember.nickname ?? "*not set*",
          inline: true,
        }
      );
      n++;
    }
    if (oldMember.avatarURL() !== newMember.avatarURL()) {
      em.setThumbnail(newMember.avatarURL() ?? newMember.displayAvatarURL());
      n++;
    }
    oldMember.roles.cache.forEach(async (role) => {
      if (!newMember.roles.cache.find((x) => x.id === role.id)) {
        await queueChange(
          client,
          logChannel,
          newMember.guild,
          newMember.id,
          role.id,
          false
        );
      }
    });
    newMember.roles.cache.forEach(async (role) => {
      if (!oldMember.roles.cache.find((x) => x.id === role.id)) {
        await queueChange(client, logChannel, newMember.guild, newMember.id, role.id, true);
      }
    });
    if (oldMember.user.bannerURL() !== newMember.user.bannerURL()) {
      em.addFields(
        {
          name: "Old banner",
          value: oldMember.user.bannerURL() ?? "*not set*",
          inline: true,
        },
        {
          name: "New banner",
          value: newMember.user.bannerURL() ?? "*not set*",
          inline: true,
        }
      );
    }

    if (n < 1) {
      return;
    }
    return await logChannel.send({ embeds: [em] });
  },
} as EventType;
