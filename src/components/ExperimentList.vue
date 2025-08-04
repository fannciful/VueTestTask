<template>
  <div class="flex flex-wrap gap-3 max-h-96 overflow-auto">
    <div
      v-for="exp in experiments"
      :key="exp"
      class="flex align-items-center gap-2"
    >
      <Checkbox
        :inputId="exp"
        :value="exp"
        v-model="selected"
      />
      <label :for="exp" class="font-medium">{{ exp }}</label>
    </div>
  </div>
<div v-if="selected.length" class="mt-3">
  <Tag severity="info">Selected: {{ selected.length }}</Tag>
</div>

</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  experiments: Array,
});
const emit = defineEmits(['selected']);

const selected = ref([]);

watch(selected, () => {
  emit('selected', selected.value);
});
</script>
