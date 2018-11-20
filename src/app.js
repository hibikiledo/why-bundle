function buildDependencyGraph(module, modules) {
  const g = {};
  function buildGraph(module, modules) {
    if (!g[module.name]) {
      g[module.name] = [];
    }
    for (const reason of module.reasons) {
      const m = modules.filter(m => m.id === reason.moduleId)[0];
      if (!m) {
        continue;
      }
      if (g[module.name].includes(m.name)) {
        // circular dependency, skip
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
  // base case, has reach the top module
  if (graph[moduleName].length === 0) {
    console.log(path);
    return;
  }

  // continue to traverse up
  path.push(moduleName);
  for (const parentModuleName of graph[moduleName]) {
    if (!path.includes(parentModuleName)) {
      report(graph, parentModuleName, [...path]);
    }
  }
}

module.exports.run = function({ stats, chunkName, moduleName }) {
  const chunks = stats.chunks.filter(c => c.names.includes(chunkName));
  if (!chunks.length) {
    console.error(`Chunk ${chunkName} not found`);
    return;
  }
  if (chunks.length > 1) {
    console.error("Multiple chunks with the same name is not supported.");
    return;
  }

  const chunk = chunks[0];

  const modules = chunk.modules.filter(m =>
    new RegExp(moduleName).test(m.name)
  );
  if (!modules.length) {
    console.error(`Module ${moduleName} not found`);
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
  const dependencyGraph = buildDependencyGraph(module, chunk.modules)

  report(dependencyGraph, module.name, []);
};
