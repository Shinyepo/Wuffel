import { Collection, PermissionOverwrites } from "discord.js";

export const permDiff = (array1: Collection<string, PermissionOverwrites>, array2: Collection<string, PermissionOverwrites>) => {
  return array1.filter((object1) => {
    return !array2.some((object2) => {
      return object1.id === object2.id && object1.deny.equals(object2.deny) && object1.allow.equals(object2.allow);
    });
  });
};
