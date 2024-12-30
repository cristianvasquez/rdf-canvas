<script setup xmlns="http://www.w3.org/1999/html">
import Entity from './Entity.vue'
import Term from './Term.vue'

const props = defineProps({
  row: Object,
})


</script>
<template>
  <div class="row">
    <ul class="property">
      <li>
        <div style="display: flex; align-items: center;">
          <Term :term="row.predicate"></Term>
        </div>
      </li>

    </ul>
    <ul class="value">
      <li v-for="v of row.values">
        <Entity :pointer="v"/>
      </li>
    </ul>
  </div>

</template>

