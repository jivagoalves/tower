var command;

command = function() {
  var defaultArgs;
  defaultArgs = ["node", "tower", "server"];
  return (new Tower.CommandServer(defaultArgs.concat(_.args(arguments)))).program;
};

describe("Tower.CommandServer", function() {

  describe("tower server", function() {});
});
