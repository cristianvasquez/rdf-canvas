<script setup>
import { Handle, Position } from '@vue-flow/core'
import Term from './Term.vue'
import ToolIcon from './ToolIcon.vue'
import { toRaw } from 'vue'

const props = defineProps({
  data: Object,
  id: String,
})

// Convert term string back to a NamedNode for Term component
const term = {
  termType: 'NamedNode',
  value: props.id,
}
</script>

<template>
  <div class="flow-node">
    <!-- Source handle on right -->
    <Handle type="source" :position="Position.Right" />
    
    <div class="entity">
      <div class="entity-header">
        <Term :term="term">
          <ToolIcon :term="toRaw(term)" />
        </Term>
      </div>
      
      <div class="types" v-if="data.types && data.types.length">
        <div v-for="type in data.types" :key="type.value">
          <Term :term="type" />
        </div>
      </div>
    </div>

    <!-- Target handle on left -->
    <Handle type="target" :position="Position.Left" />
  </div>
</template>

<style>
.flow-node {
  background: white;
  border-radius: 4px;
  border: 1px solid var(--border);
  padding: 2px;
  min-width: 150px;
}

.flow-node .entity {
  display: flex;
  flex-direction: column;
}

.flow-node .entity-header {
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
}

.flow-node .types {
  font-size: 0.8em;
  color: var(--metadata);
  padding: 4px 8px;
  border-top: 1px solid var(--border);
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