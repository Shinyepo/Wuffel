import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "bot.streamleaderboard" })
export class StreamLeaderboard {
  @PrimaryKey()
  id: number;

  @Property()
  guildId: string;

  @Property()
  userId: string;

  @Property()
  timeStreamed: string;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}