<template>
    <master-modal
      id="modalCrud"
      v-model="showModal"
      :persistent="true"
      :maximized="$q.screen.lt.md"
      custom-position
      modalWidthSize="98%"
    >
      <crud
        v-if="showModal && dataCrud.path"
        :crudData="dataCrud.path"
        :custom-data="dataCrud.customData"
        :title="dataCrud.title"
      />
    </master-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import modalCrudStore from '../stores/modalCrud.store'

export default defineComponent({
  setup(props) {
    const showModal = computed({
        get: () => modalCrudStore.showModal,
        set(value) {
            modalCrudStore.showModal = value
        }
    });
    const dataCrud = computed(() => modalCrudStore.dataCrud);
    return {dataCrud, showModal};
  },
});
</script>

<style scoped>
</style>