import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "bot.settings" })
export class Settings {
  [key: string]: any;
  @PrimaryKey()
  id: number;

  @Property()
  guildId: string;

  @Property({ onCreate: () => true })
  active: boolean;

  @Property()
  prefix: string;

  @Property()
  userCount: string;

  @Property({ nullable: true })
  guildRole?: string;

  @Property({ nullable: true })
  modRole?: string;

  @Property({ nullable: true })
  adminRole?: string;

  @Property({ nullable: true })
  muteRole?: string;

  @Property({ nullable: true, type: "text" })
  disabledCommands?: string;

  @Property({ nullable: true })
  systemNotice?: Boolean;

  @Property({ nullable: true })
  cleanup?: Boolean;

  @Property({ type: "array" })
  moderators: string[];
}
