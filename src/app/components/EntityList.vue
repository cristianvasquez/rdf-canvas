<script setup>
import { VueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import Entity from './Entity.vue'
import FlowNode from './FlowNode.vue'
import { ref, watch } from 'vue'
import dagre from 'dagre'

const props = defineProps({
  entities: Array,
})

// Initial empty flow state
const nodes = ref([])
const edges = ref([])

// Basic layout configuration
const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

// Add node types configuration
const nodeTypes = {
  custom: FlowNode
}

// Dagre graph layout configuration
function getLayoutedElements(nodes, edges, direction = 'LR') {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const nodeWidth = 200
  const nodeHeight = 100

  // Configure the layout
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: 'network-simplex',
    nodesep: 80,
    ranksep: 200,
    edgesep: 80,
  })

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Let dagre do its magic
  dagre.layout(dagreGraph)

  // Apply the layout to the nodes
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    }

    // Assign data back to node
    return node
  })

  return { nodes, edges }
}

function convertToFlowData(entities) {
  const newNodes = []
  const newEdges = []
  const processedNodes = new Set()

  function processEntity(entity) {
    if (processedNodes.has(entity.term.value)) {
      return
    }
    processedNodes.add(entity.term.value)

    // Create node for this entity with type 'custom'
    newNodes.push({
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
        newEdges.push({
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

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = 
    getLayoutedElements(newNodes, newEdges)

  return { nodes: layoutedNodes, edges: layoutedEdges }
}

// Watch for changes in entities prop and update flow data
watch(() => props.entities, (newEntities) => {
  if (newEntities) {
    const flowData = convertToFlowData(newEntities)
    nodes.value = flowData.nodes
    edges.value = flowData.edges
  }
}, { immediate: true })
</script>

<template>
  <div class="container">
    <!-- Original list view -->
    <div class="entities">
      <template v-for="ptr in entities" :key="ptr.term.value">
        <Entity :pointer="ptr"/>
      </template>
    </div>

    <!-- New flow view -->
    <div class="flowview">
      <VueFlow
        v-model="nodes"
        v-model:edges="edges"
        :default-viewport="defaultViewport"
        :node-types="nodeTypes"
        fit-view-on-init
      />
    </div>
  </div>
</template>

<style>
body {
  --border: #463838;
  --metadata: #463838;
}

.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.entities {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-right: 1px solid var(--border);
  width: 50%;
  overflow-y: auto;
}

.flowview {
  width: 50%;
  height: 100%;
}
</style>
