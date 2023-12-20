import {reactive, computed} from 'vue';

const state = reactive({
    showModal: false,
    formId: 0,
});

const store = computed(() => ({
    get showModal(): boolean {
        return state.showModal;
    },
    set showModal(value: boolean) {
        state.showModal = value;
    },
    get formId(): number {
        return state.formId;
    },
    set formId(value: number) {
        state.formId = value;
    },
})).value;

export default store;