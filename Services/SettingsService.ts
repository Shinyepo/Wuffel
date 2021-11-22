import { EntityManager } from "@mikro-orm/knex";
import { Guild } from "discord.js";
import { Settings } from "../Entities/Settings";

export const createSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });

  if (!settings) {
    const newEntry = await context.create(Settings, {
      guildId: guild.id,
      prefix: "+",
      userCount: guild.memberCount,
    });
    await context.persistAndFlush(newEntry);
    return;
  }
  return;
};

export const removeSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });
  if (!settings) return;
  await context.removeAndFlush(settings);
  return;
};
