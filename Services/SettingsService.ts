import { EntityManager } from "@mikro-orm/knex";
import { Guild } from "discord.js";
import { Settings } from "../Entities/Settings";

export const createSettings = async (em: EntityManager, guild: Guild) => {
  const settings = await em.findOne(Settings, { guildId: guild.id });

  if (!settings) {
    const newEntry = await em.create(Settings, {
      guildId: guild.id,
      prefix: "+",
      userCount: guild.memberCount
    });
    await em.persistAndFlush(newEntry);
    return;
  }
  return;
};


export const removeSettings = async (em: EntityManager, guild: Guild) => {
    const settings = await em.findOne(Settings, { guildId: guild.id});
    if (!settings) return;
    await em.removeAndFlush(settings);
    return;
}