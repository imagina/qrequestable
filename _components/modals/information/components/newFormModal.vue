<template>
    <master-modal
      v-model="showModal"
      :persistent="true"
      :maximized="$q.screen.lt.md"
      custom-position
      modalWidthSize="98%"
    >
       <fields :formId="formId" />
    </master-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import newFormModalStore from '../stores/newFormModal'
import fields from '@imagina/qform/_pages/admin/fields/index.vue'


export default defineComponent({
  components: {
    fields,
  },
  setup(props) {
    const showModal = computed({
        get: () => newFormModalStore.showModal,
        set(value) {
            newFormModalStore.showModal = value
        }
    });
    const formId = computed(() => newFormModalStore.formId)
    return {showModal, formId};
  },
});
</script>

<style scoped>
</style>