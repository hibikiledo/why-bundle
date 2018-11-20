// Usage
// why-bundle --stats stats.json --chunk main --module 'cooking/selectors.js'

function graph(module, modules) {
  const g = {};
  function buildGraph(module, modules) {
    if (!g[module.name]) {
      g[module.name] = [];
    }
    for (const reason of module.reasons) {
      const m = modules.filter(m => m.id === reason.moduleId)[0];

      // TODO: figure out what causes module to be missing
      if (!m) {
        continue;
      }

      // Skip because of circular dependency
      if (g[module.name].includes(m.name)) {
        continue;
      }

      g[module.name].push(m.name);

      buildGraph(m, modules);
    }
  }

  buildGraph(module, modules);
  return g;
}

function report(graph, moduleName, path) {
  // base case, when reach top level print path
  if (graph[moduleName].length === 0) {
    console.log(path);
    return;
  }

  // continue to traverse traverse 
  path.push(moduleName);
  for (const parentModuleName of graph[moduleName]) {
    if (!path.includes(parentModuleName)) {
      report(graph, parentModuleName, [...path]);
    }
  }
}

function cli({ stats, chunkName, moduleName }) {
  const chunks = stats.chunks.filter(c => c.names.includes(chunkName));
  if (!chunks.length) {
    console.error("Chunk not found");
    return;
  }
  if (chunks.length > 1) {
    console.error("We don't support multiple chunks with same name.");
    return;
  }

  const chunk = chunks[0];

  const modules = chunk.modules.filter(m =>
    new RegExp(moduleName).test(m.name)
  );
  if (!modules.length) {
    console.error("Module not found");
    return;
  }
  if (modules.length > 1) {
    console.error(`Found ${modules.length} modules.`);
    modules.forEach(m => {
      console.error(`- ${m.name}`);
    });
    console.error("Please refine your moduleName");
    return;
  }

  const module = modules[0];

  console.log(report(graph(module, chunk.modules), module.name, []));
}

cli({
  stats: require("./stats"),
  chunkName: "main",
  moduleName: "cooking/selectors.js"
});
