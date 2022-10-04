import { EntityManager } from "@mikro-orm/knex";
import { Message, VoiceState } from "discord.js";
import { StreamLeaderboard } from "../Entities/StreamLeaderboard";
import { StreamWatch } from "../Entities/StreamWatch";

export const getStreamerRanking = async (
  em: EntityManager,
  { guild }: Message
) => {
  const result = await em.find(StreamLeaderboard, { guildId: guild!.id });
  const response = result.sort((a, b) => {
    if (a.timeStreamed < b.timeStreamed) return 1;
    if (a.timeStreamed > b.timeStreamed) return -1;
    return 0;
  });
  return response;
};

export const insertStartedStream = async (
  em: EntityManager,
  { guild, member: user }: VoiceState
) => {
  const context = em.fork();
  const data = await context.findOne(StreamWatch, {
    guildId: guild!.id,
    userId: user!.id,
  });

  if (!data) {
    const newEntry = await context.create(StreamWatch, {
      guildId: guild!.id,
      userId: user!.id,
    });
    await context.persistAndFlush(newEntry);
    return;
  }

  data.startingDate = Date.now().toString();
  await context.flush();
  return;
};

export const addStreamerRanking = async (
  em: EntityManager,
  { guild, member: user }: Message | VoiceState
) => {
  const context = em.fork();
  const startedStream = await context.findOne(StreamWatch, {
    guildId: guild!.id,
    userId: user!.id,
  });
  if (!startedStream) return;
  const startingDate = Date.parse(startedStream.startingDate!);

  const curr = new Date().getTime();
  const time = curr - startingDate;

  const userRanking = await context.findOne(StreamLeaderboard, {
    guildId: guild!.id,
    userId: user!.id
  });
  if (!userRanking) {
    const newEntry = await context.create(StreamLeaderboard, {
      guildId: guild!.id,
      userId: user!.id,
      timeStreamed: time.toString(),
      username: user!.displayName,
      nickname: user!.nickname ?? undefined
    });

    await context.persistAndFlush(newEntry);
    return;
  }
  const totalTime = parseInt(userRanking!.timeStreamed) + time;

  userRanking!.timeStreamed = totalTime.toString();
  await context.remove(startedStream);
  await context.flush();

  return;
};
