<script setup>
import '@vue-flow/core/dist/style.css'
import Entity from './Entity.vue'
import VueFlowSingleNode from '../experiments/VueFlowSingleNode.vue'

const props = defineProps({
  entities: Array,
})

</script>

<template>
  <div class="container">
    <div class="entities">
      <template v-for="ptr in entities" :key="ptr.term.value">
        <Entity :pointer="ptr"/>
      </template>
    </div>
    <div class="flowview">
      <VueFlowSingleNode :entities="entities"/>
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
