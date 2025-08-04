<template>
  <div class="p-5 max-w-screen-xl mx-auto space-y-6">
    <Card class="w-full">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-database"></i>
          <span>Experiment Tracker</span>
        </div>
      </template>
      <template #content>
  <div class="w-full">
    <FileUploader @parsed="onParsed" />
  </div>
</template>

    </Card>

    <Divider />

    <div v-if="experimentIds.length" class="flex flex-column gap-6">
      <Panel header="Available Experiments" toggleable collapsed class="w-full">
        <ExperimentList
          :experiments="experimentIds"
          @selected="selectedExperiments = $event"
        />
        <p class="mt-2 text-sm text-gray-600">
          Selected experiments: {{ selectedExperiments.join(', ') || 'None' }}
        </p>
      </Panel>

      <Panel header="Metrics Visualization" toggleable class="w-full">
        <ScrollPanel style="height: 600px;">
          <MetricCharts
            :groupedData="groupedData"
            :selectedExperiments="selectedExperiments"
          />
        </ScrollPanel>
      </Panel>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FileUploader from './components/FileUploader.vue';
import ExperimentList from './components/ExperimentList.vue';
import MetricCharts from './components/MetricCharts.vue';

const rawData = ref([]);
const selectedExperiments = ref([]);

const experimentIds = computed(() => {
  return [...new Set(rawData.value.map((item) => item.experiment_id))].filter(Boolean);
});

const groupedData = computed(() => {
  const result = {};
  for (const row of rawData.value) {
    const exp = row.experiment_id;
    const metric = row.metric_name;
    const step = Number(row.step);
    const value = Number(row.value);
    if (!exp || !metric || isNaN(step) || isNaN(value)) continue;

    if (!result[exp]) result[exp] = {};
    if (!result[exp][metric]) result[exp][metric] = [];

    result[exp][metric].push({ step, value });
  }

  for (const exp in result) {
    for (const metric in result[exp]) {
      result[exp][metric].sort((a, b) => a.step - b.step);
    }
  }

  return result;
});

function onParsed(data) {
  rawData.value = data;
  selectedExperiments.value = [];
}
</script>
