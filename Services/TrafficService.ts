import { EntityManager } from "@mikro-orm/knex";
import { GuildMember } from "discord.js";
import { GuildTraffic } from "../Entities/GuildTraffic";

export const addTraffic = async (
  em: EntityManager,
  { guild, user }: GuildMember,
  joined: boolean
) => {
  const newEntry = await em.create(GuildTraffic, {
    guildId: guild.id,
    userId: user.id,
    joined,
  });

  await em.persistAndFlush(newEntry);
  return;
};
