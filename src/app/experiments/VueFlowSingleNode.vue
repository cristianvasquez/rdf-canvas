<script setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import FlowNode from './FlowNode.vue'
import { markRaw, nextTick, ref, watch } from 'vue'
import { useLayout } from '../layout/dagrelayout.js'

const props = defineProps({
  entities: Array,
})

const { layout } = useLayout()
const { fitView } = useVueFlow()

// Initial empty flow state
const nodes = ref([])
const edges = ref([])

// Basic layout configuration
const defaultViewport = { x: 0, y: 0, zoom: 1.5 }

// Add node types configuration
const nodeTypes = {
  custom: markRaw(FlowNode),
}

async function layoutGraph (direction) {
  nodes.value = layout(nodes.value, edges.value, direction)

  await nextTick(() => {
    fitView()
  })
}

function convertToFlowData (entities) {
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
  <VueFlow :nodes="nodes" :edges="edges"
           :default-viewport="defaultViewport"
           :node-types="nodeTypes"
           @nodes-initialized="layoutGraph('LR')"/>
</template>
