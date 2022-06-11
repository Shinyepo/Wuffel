import { EventType, WuffelClient } from "../../types";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "ready",
  once: true,
  execute(client: WuffelClient) {
    console.log(consoleTimestamp() + " Logged in as " + client.user!.tag);
  },
} as EventType;
