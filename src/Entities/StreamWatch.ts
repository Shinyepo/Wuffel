import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "bot.streamwatch" })
export class StreamWatch {
  @PrimaryKey()
  id: number;

  @Property()
  guildId: string;

  @Property()
  userId: string;

  @Property({
    type: "date",
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  startingDate?: string;
}
