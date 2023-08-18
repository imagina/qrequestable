<template>
    <master-modal
      v-model="showModal"
      :persistent="true"
      :maximized="$q.screen.lt.md"
      custom-position
      modalWidthSize="98%"
    >
       <advanceChat :room-id="roomId" />
    </master-modal>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import whatappsModalStore from '../stores/whatappsModal'
import advanceChat from '@imagina/qchat/_components/advancedChat.vue'


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
    const roomId = computed(() => whatappsModalStore.roomId)
    return {showModal, roomId};
  },
});
</script>

<style scoped>
</style>