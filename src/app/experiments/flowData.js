function singleNode (entities) {
  const nodes = []
  const edges = []
  const processedNodes = new Set()

  function processEntity (entity) {
    if (processedNodes.has(entity.term.value)) {
      return
    }
    processedNodes.add(entity.term.value)

    // Create node for this entity with type 'custom'
    nodes.push({
      id: entity.term.value,
      type: 'custom',
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: {
        types: entity.types,
      },
    })

    // Process each row (predicate and its values)
    entity.rows.forEach((row) => {
      row.values.forEach((value) => {
        // Create node for the value if it hasn't been processed
        if (!processedNodes.has(value.term.value)) {
          processEntity(value)
        }

        // Create edge from entity to value
        edges.push({
          id: `${entity.term.value}-${row.predicate.value}-${value.term.value}`,
          source: entity.term.value,
          target: value.term.value,
          label: row.predicate.value.split('#').pop(),
        })
      })
    })
  }

  // Start processing from root entities
  entities.forEach((entity) => {
    processEntity(entity)
  })

  return { nodes, edges }
}

function multipleNode (entities) {
  const nodes = []
  const edges = []

  // Only create nodes for the root entities
  entities.forEach((entity) => {
    // Create node for this root entity
    nodes.push({
      id: entity.term.value,
      type: 'custom',
      position: { x: 0, y: 0 }, // Position will be set by dagre
      data: {
        types: entity.types,
        rows: entity.rows,
      },
    })

    // Create edges only between root entities
    entity.rows.forEach((row) => {
      row.values.forEach((value) => {
        // Only create edge if the target is also a root entity
        if (entities.some(e => e.term.value === value.term.value)) {
          edges.push({
            id: `${entity.term.value}-${row.predicate.value}-${value.term.value}`,
            source: entity.term.value,
            target: value.term.value,
            label: row.predicate.value.split('#').pop(),
          })
        }
      })
    })
  })

  return { nodes, edges }
}

export { singleNode, multipleNode }
