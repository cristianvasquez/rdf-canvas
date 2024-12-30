import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ns } from '../namespaces.js'
import { getEntities } from '../traversers/entities.js'

const tools = {
  typeOf: (type) => {
    return {
      ignoreNamedGraphs: true,
      maxDepth: 10,
      matchers: [
        { // Priority for entities of type
          predicate: ns.rdf.type,
          object: type,
        },
        {}, // Everything else
      ],
    }
  },

}

export const useStore = defineStore('state', () => {

  const entities = ref([])
  const currentDataset = ref()
  const currentFocus = ref()

  // This code smells, TODO refactor
  function setDataset (dataset) {
    currentDataset.value = dataset
    reset()
  }

  function reset () {
    currentFocus.value = undefined
    const options = tools.typeOf(ns.epo.Notice)
    entities.value = getEntities(currentDataset.value, options)
  }

  return {
    entities,
    setDataset,
    reset,
  }
})
