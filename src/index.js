#!/usr/bin/env node

const program = require("commander");

program
  .version('1.0.0')
  .option("-s, --stats <path_to_stats_file>", "Specify stats file to read from")
  .option(
    "-c, --chunk <chunk_name>",
    "Name of the chunk"
  )
  .option(
    "-m, --module <module_name>",
    "Name of module to see why it is bundled (Support regular expression)"
  )
  .parse(process.argv);

require("./app").run({
  stats: require(program.stats),
  chunkName: program.chunk,
  moduleName: program.module
});
