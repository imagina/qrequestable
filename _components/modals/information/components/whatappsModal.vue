<template>
    <master-modal
      v-model="showModal"
      :persistent="true"
      :maximized="$q.screen.lt.md"
      custom-position
      modalWidthSize="98%"
      :loading="loading"
    >
       <advanceChat :room-id="roomId" />
    </master-modal>
</template>

<script lang="ts">
import Vue, { defineComponent, computed, onMounted } from "vue";
import whatappsModalStore from '../stores/whatappsModal'
import advanceChat from 'modules/qchat/_components/advancedChat.vue'


export default defineComponent({
  components: {
    advanceChat,
  },
  setup(props) {
    const showModal = computed({
        get: () => whatappsModalStore.showModal,
        set(value) {
            whatappsModalStore.showModal = value
        }
    });
    const loading = computed(() => whatappsModalStore.loading);
    const roomId = computed(() => whatappsModalStore.roomId);
    return {showModal, roomId, loading};
  },
});
</script>

<style scoped>
</style>