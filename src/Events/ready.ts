import { Client } from "discord.js";
import { EventType } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
    name: 'ready',
    once : true,
    execute(client: Client) {
        console.log(consoleTimestamp() + ' Logged in as ' + client.user!.tag);
    },
} as EventType;