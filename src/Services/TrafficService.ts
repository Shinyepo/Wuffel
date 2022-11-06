import { EntityManager } from "@mikro-orm/knex";
import { GuildMember } from "discord.js";
import { GuildTraffic } from "../Entities/GuildTraffic";
import { Settings } from "../Entities/Settings";

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
    nickname: nickname ?? undefined,
    joined,
  });
  await context.persistAndFlush(newEntry);
  const settings = await context
    .fork()
    .findOne(Settings, { guildId: guild.id });
  if (!settings) return;
  settings.userCount = guild.memberCount.toString();
  await context.persistAndFlush(settings);

  return;
};
