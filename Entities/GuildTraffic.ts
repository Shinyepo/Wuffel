import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "bot.guildtraffic" })
export class GuildTraffic {
  @PrimaryKey()
  id: number;

  @Property()
  guildId: string;

  @Property()
  userId: string;

  @Property()
  joined: boolean;

  @Property({ type: "date", onCreate: () => new Date() })
  createdAt: string;
}
