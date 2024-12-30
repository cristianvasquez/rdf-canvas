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

  // Calculate dimensions for layout purposes only
  function getNodeDimensions(node) {
    const baseHeight = 40  // Header height
    const rowHeight = 40   // Height per row
    const width = 300      // Standard width
    
    // Calculate total height based on content
    const totalHeight = baseHeight + (node.data.rows.length * rowHeight)
    
    return { width, height: totalHeight }
  }

  // Configure the layout
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: 'network-simplex',
    nodesep: 80,
    ranksep: 200,
    edgesep: 80,
  })

  // Add nodes to dagre with their calculated dimensions
  nodes.forEach((node) => {
    const dimensions = getNodeDimensions(node)
    dagreGraph.setNode(node.id, dimensions)
  })

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  // Let dagre do its magic
  dagre.layout(dagreGraph)

  // Apply only the positions to the nodes
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const dimensions = getNodeDimensions(node)
    node.position = {
      x: nodeWithPosition.x - dimensions.width / 2,
      y: nodeWithPosition.y - dimensions.height / 2,
    }
  })

  return { nodes, edges }
}

function convertToFlowData(entities) {
  const newNodes = []
  const newEdges = []

  // Only create nodes for the root entities
  entities.forEach((entity) => {
    // Create node for this root entity
    newNodes.push({
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
          newEdges.push({
            id: `${entity.term.value}-${row.predicate.value}-${value.term.value}`,
            source: entity.term.value,
            target: value.term.value,
            label: row.predicate.value.split('#').pop(),
          })
        }
      })
    })
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
