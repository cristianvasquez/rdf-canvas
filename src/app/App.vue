<script setup>
import { lightTheme, NButton, NCard, NConfigProvider, NSpace, NCheckbox } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { getRabbit } from '../test-rdf-data.js'
import EntityList from './components/EntityList.vue'
import { useStore } from './state.js'

const store = useStore()
const { entities, currentFocus } = storeToRefs(store)

onMounted(() => {

  const dataset = getRabbit()
  store.setDataset(dataset)

})

const name = ref()
</script>

<template>
  <n-config-provider :theme="lightTheme">
    <div class="entity-container">
      <EntityList :entities="entities"/>
    </div>
  </n-config-provider>
</template>
<style>

.entity-container {
  background-color: white;
}
</style>
