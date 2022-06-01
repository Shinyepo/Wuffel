import { EntityManager } from "@mikro-orm/knex";
import { Guild, Message } from "discord.js";
import { LogSettings } from "../Entities/LogSettings";
import { Settings } from "../Entities/Settings";

export const getSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });
  const logSettings = await context.findOne(LogSettings, { guildId: guild.id });

  if (!logSettings) {
    const newEntry = await context.create(LogSettings, {
      guildId: guild.id,
    });
    await context.persistAndFlush(newEntry);
  }

  if (!settings) {
    const newEntry = await context.create(Settings, {
      guildId: guild.id,
      prefix: "+",
      userCount: guild.memberCount,
    });
    await context.persistAndFlush(newEntry);
    return newEntry;
  }
  return settings;
};

export const removeSettings = async (em: EntityManager, guild: Guild) => {
  const context = em.fork();
  const settings = await context.findOne(Settings, { guildId: guild.id });
  if (!settings) return;
  await context.removeAndFlush(settings);
  return;
};

export const prefixChange = async (
  em: EntityManager,
  { channel, guild }: Message,
  prefix: string
) => {
  if (prefix.length < 0) {
    channel.send("***Insert help message here***");
    return;
  }
  if (prefix.length > 4) {
    channel.send(
      "The prefix you provided is too long. Maximum length of prefix is 4 characters long."
    );
    return;
  }

  try {
    const context = em.fork();
    const settings = await context.findOne(Settings, { guildId: guild?.id });
    if (!settings) {
      channel.send("Something went wrong while changing prefix.");
      return;
    }
    settings.prefix = prefix;
    await context.flush();
    channel.send(`My prefix for this server has been changed to **${prefix}**`);
    return;
  } catch (error) {
    console.log(error);
  }
};
