<script setup>
import { VueFlow, useVueFlow } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import { singleNode } from './flowData.js'
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
  custom: FlowNode,
}

async function layoutGraph (direction) {
  nodes.value = layout(nodes.value, edges.value, direction)

  await nextTick(() => {
    fitView()
  })
}

// Watch for changes in entities prop and update flow data
watch(() => props.entities, (newEntities) => {
  if (newEntities) {
    const flowData = singleNode(newEntities)
    nodes.value = flowData.nodes
    edges.value = flowData.edges
    layoutGraph('LR')
  }
}, { immediate: true })
</script>

<template>
  <VueFlow :nodes="nodes" :edges="edges"
           :default-viewport="defaultViewport"
           :node-types="nodeTypes"
           @nodes-initialized="layoutGraph('LR')"/>
</template>
