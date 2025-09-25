"use strict";
const os = require("os");
const execAsync = require("../execAsync");

/**
 * 判断是否 Windows 11（22000+）
 */
function isWindows11() {
  const version = os.release();
  const [major, minor, build] = version.split(".").map(Number);
  return major === 10 && minor === 0 && build >= 22000;
}

const getPrinters = () => {
  const usePowerShellFlag = isWindows11();
  if (!usePowerShellFlag) {
    const stdoutHandler = (stdout) =>
      stdout
        .trim()
        .split(/\s*[\r\n]+/)
        // We remove the first element from the result because
        // <code>wmic printer get name</code> will show a list of printers under "Name" title.
        .slice(1);
    // https://ss64.com/nt/wmic.html#alias_options
    return execAsync("wmic", ["printer", "get", "name"], stdoutHandler);
  } else {
    return execAsync(
      "powershell",
      ["-Command", "Get-Printer | Select-Object -ExpandProperty Name"],
      (stdout) => stdout.trim().split(/\r?\n/).filter(Boolean)
    );
  }
};

module.exports = getPrinters;
