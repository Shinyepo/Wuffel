import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { LogObject } from "../../types";

@Entity({ tableName: "bot.logsettings" })
export class LogSettings {
  @PrimaryKey()
  id: number;

  @Property()
  guildId: string;

  @Property({ type: "json", nullable: true})
  settings?: LogObject[];

  @Property({ type: "date", onCreate: () => new Date() })
  createdAt: string;

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
