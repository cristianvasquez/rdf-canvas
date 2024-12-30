<script setup>
import '@vue-flow/core/dist/style.css'
import FlowNode from './FlowNode.vue'
import { markRaw, nextTick, ref, watch } from 'vue'
import { useLayout } from './layout/dagrelayout.js'
import Icon from './Icon.vue'
import { Background } from '@vue-flow/background'
import { Panel, VueFlow, useVueFlow } from '@vue-flow/core'

const { layout } = useLayout()
const { fitView } = useVueFlow()

const props = defineProps({
  entities: Array,
})

// Initial empty flow state
const nodes = ref([])
const edges = ref([])

// Basic layout configuration
const defaultViewport = { x: 0, y: 0, zoom: 1.0 }

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
    <!-- New flow view -->
    <div class="flowview">
      <VueFlow :nodes="nodes" :edges="edges"
               :default-viewport="defaultViewport"
               :node-types="nodeTypes"
               @nodes-initialized="layoutGraph('LR')">
        <Background/>

        <Panel class="process-panel" position="top-right">
          <div class="layout-panel">
            <button title="set horizontal layout" @click="layoutGraph('LR')">
              <Icon name="horizontal"/>
            </button>

            <button title="set vertical layout" @click="layoutGraph('TB')">
              <Icon name="vertical"/>
            </button>
          </div>
        </Panel>
      </VueFlow>
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
  width: 30%;
  overflow-y: auto;
}

.flowview {
  width: 100%;
  height: 100%;
}
</style>
