var command;

command = function() {
  var defaultArgs;
  defaultArgs = ["node", "tower", "generate"];
  return (new Tower.CommandGenerate(defaultArgs.concat(_.args(arguments)))).program;
};

describe("Tower.CommandGenerate", function() {

  describe("tower generate scaffold", function() {});
});
