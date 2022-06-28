import {
  addStreamerRanking,
  insertStartedStream,
} from "../Services/StreamerService";
import { EventType, WuffelClient } from "../../types";
import { VoiceState } from "discord.js";

export = {
  name: "voiceStateUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    oldState: VoiceState,
    newState: VoiceState
  ) {
    if (oldState.streaming !== newState.streaming) {
      if (newState.streaming === true) {
        await insertStartedStream(client.em, newState);
      } else {
        await addStreamerRanking(client.em, newState);
      }
    }
  },
} as EventType;
