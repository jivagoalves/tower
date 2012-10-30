var command;

command = function() {
  var defaultArgs;
  defaultArgs = ["node", "tower", "console"];
  return (new Tower.CommandConsole(defaultArgs.concat(_.args(arguments)))).program;
};

describe("Tower.CommandConsole", function() {

  describe("tower console", function() {});
});
