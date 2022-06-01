import { EntityManager } from "@mikro-orm/knex";
import { GuildMember } from "discord.js";
import { GuildTraffic } from "../Entities/GuildTraffic";

export const addTraffic = async (
  em: EntityManager,
  { guild, user, nickname }: GuildMember,
  joined: boolean
) => {
  const context = em.fork();
  const newEntry = await context.create(GuildTraffic, {
    guildId: guild.id,
    userId: user.id,
    username: user.username,
    nickname,
    joined,
  });

  await context.persistAndFlush(newEntry);
  return;
};
