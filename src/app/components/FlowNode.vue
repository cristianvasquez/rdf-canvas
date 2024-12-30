<script setup>
import { Handle, Position } from '@vue-flow/core'
import Entity from './Entity.vue'

const props = defineProps({
  data: Object,
  id: String,
})

const entityData = {
  term: {
    termType: 'NamedNode',
    value: props.id,
  },
  types: props.data.types,
  rows: props.data.rows || [],
}
</script>

<template>
  <div class="flow-node" :data-id="props.id">
    <Handle type="source" :position="Position.Right"/>

    <Entity :pointer="entityData"/>
    <Handle type="target" :position="Position.Left"/>
  </div>
</template>

<style>

.flow-node {
  min-width: 600px;
  border-right: 1px solid var(--border);
}

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
