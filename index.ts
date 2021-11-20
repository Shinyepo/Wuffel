import { ShardingManager } from "discord.js";
import { consoleTimestamp } from "./Utilities/timestamp";
import { token } from "./config.json";

const main = async () => {
  const manager = new ShardingManager(__dirname + "/bot.js", {
    token,
    respawn: true,
    totalShards: 1,
  });  

  manager.on("shardCreate", (shard) =>
    console.log(
      consoleTimestamp() +
        ` Launching shard ${shard.id} of ${(manager.totalShards as number) - 1}`
    )
  );

  const shards = await manager.spawn();
  console.log("\n" + consoleTimestamp() + " Finished launching all shards.")

};

main();
