<template>
  <div class="flex flex-column w-full gap-2">
    <!-- Рядок з текстом і кнопкою -->
    <div class="flex align-items-center gap-3">
      <span class="text-lg font-medium text-800">Upload CSV file</span>
      <FileUpload
        ref="fileUpload"
        name="file"
        accept=".csv"
        mode="basic"
        :auto="true"
        :customUpload="true"
        choose-label="Choose File"
        @select="handleSelect"
      />
    </div>

    <!-- Виведення назви файлу + кнопка видалення -->
    <div
      v-if="fileName"
      class="flex align-items-center justify-content-between w-full mt-2 px-3 py-2 border-1 border-round surface-100 border-gray-300"
    >
      <span class="text-sm text-700 truncate">{{ fileName }}</span>
      <Button
        icon="pi pi-times"
        rounded
        text
        severity="secondary"
        class="ml-3"
        @click="clearFile"
      />
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import Papa from 'papaparse';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';

const emit = defineEmits(['parsed']);
const fileUpload = ref(null);
const fileName = ref('');

function handleSelect(event) {
  const file = event.files?.[0];
  if (!file) return;

  fileName.value = file.name;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete(results) {
      emit('parsed', results.data);
    },
  });
}

function clearFile() {
  fileName.value = '';
  fileUpload.value?.clear();
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
