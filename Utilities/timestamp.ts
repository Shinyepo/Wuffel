import moment from "moment";

export const consoleTimestamp = () => {
  return "[" + moment().format("DD/MM - hh:mm:ss") + "]";
};
