<script setup>
import { ArrowUp } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { onMounted, ref, toRaw } from 'vue'
import ToolIcon from './ToolIcon.vue'
import Row from './Row.vue'
import Term from './Term.vue'

const props = defineProps({
  pointer: Object,
})
const inDataset = ref()

onMounted(() => {
  inDataset.value = !!document.getElementById(`${props.pointer.term.value}`)
})


</script>

<template>

  <template v-if="pointer.rows.length">
    <div class="entity" :id="pointer.term.value">
      <div class="entity-header">
        <Term :term="pointer.term">
          <ToolIcon :term="toRaw(pointer.term)"/>
        </Term>
        <slot></slot>
      </div>
      <div class="rows">
        <template v-for="row of pointer.rows">
          <Row :row="row">
            <ToolIcon :term="toRaw(row.predicate)"/>
          </Row>
        </template>
      </div>
    </div>
  </template>
  <template v-else>
    <template v-if="pointer.isInternalLink && inDataset">
      <a :href="`#${pointer.term.value}`">
        {{ pointer.term.value }}
        <NIcon>
          <ArrowUp/>
        </NIcon>
      </a>
    </template>
    <template v-else>
      <Term :term="pointer.term">
        <ToolIcon :term="toRaw(pointer.term)"/>
      </Term>
    </template>

  </template>
</template>


<style>

.entity {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);

  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.entity-header {
  background: rgba(0, 0, 0, 0.05);
}

.entity-header > div {
  margin: 5px;
}

.rows {
  display: flex;
  flex-direction: column;
}

.rows > :nth-child(1n) {
  border-top: 1px solid var(--border);
}

.rows > :nth-child(2n) {
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.01);
}

.rows > .row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.row > .property {
  align-self: flex-start;
  min-width: 200px;
  word-wrap: break-word;
  margin: 0.5rem 0.5rem 0.5rem 1%;
}

.row > .value {
  flex: 2;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
}

/* A Hack to select text */
.rdf-container .row > .value > li > div:not([class]) {
  /*border: 2px blue solid;*/
  word-wrap: break-word;
}

ul {
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 5px;
  justify-content: center;
  padding-left: 5px;
}

ol {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  padding-left: 5px;
}

div .bring-down {
  color: var(--metadata);
}

.vocab {
  color: var(--metadata);
  font-size: 0.8rem;
}

.vocab::after {
  content: ':';
}

.language {
  color: var(--metadata);
  font-size: 0.7rem;
  margin-left: 4px;
}

.datatype {
  color: var(--metadata);
  font-size: 0.7rem;
  margin-left: 4px;
}

</style>

