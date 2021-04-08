"use strict";

const execAsync = require("../execAsync");
const os = require("os");

const getPrinters = () => {
  const parseResult = (output) => {
    return output
      .trim()
      .split("\n")
      .map((e) => (e.indexOf(" ") > 0 ? e.substr(0, e.indexOf(" ")) : e));
  };
  console.log(parseResult);
  return execAsync(
    "lpstat",
    os.platform() === "darwin" ? ["-e"] : ["-a"],
    parseResult
  );
};

module.exports = getPrinters;
