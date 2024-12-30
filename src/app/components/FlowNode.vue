<script setup>
import { Handle, Position } from '@vue-flow/core'
import Term from './Term.vue'
import Row from './Row.vue'
import { toRaw } from 'vue'

const props = defineProps({
  data: Object,
  id: String,
})

const entityData = {
  term: {
    termType: 'NamedNode',
    value: props.id
  },
  types: props.data.types,
  rows: props.data.rows || []
}
</script>

<template>
  <div class="flow-node">
    <Handle type="source" :position="Position.Right" />

    <div class="entity">
      <div class="entity-header">
        <Term :term="entityData.term" />
      </div>

      <div class="rows">
        <template v-for="row in entityData.rows" :key="row.predicate.value">
          <Row :row="row" />
        </template>
      </div>
    </div>

    <Handle type="target" :position="Position.Left" />
  </div>
</template>

<style>
.flow-node {
  min-width: 300px;
  border-right: 1px solid var(--border);
}

.flow-node .entity {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);


  background: white;
}

.flow-node .entity-header {
  background: rgba(0, 0, 0, 0.05);
}

.flow-node .entity-header > div {
  margin: 5px;
}

.flow-node .rows {
  display: flex;
  flex-direction: column;
}

.flow-node .rows > :nth-child(1n) {
  border-top: 1px solid var(--border);
}

.flow-node .rows > :nth-child(2n) {
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.01);
}

/* Handle styling */
.vue-flow__handle {
  width: 8px;
  height: 8px;
  background: var(--border);
}

.vue-flow__handle-right {
  right: -4px;
}

.vue-flow__handle-left {
  left: -4px;
}

.vue-flow__handle:hover {
  background: #666;
}
</style>
