<template>
  <div class="space-y-10">
    <div v-if="metrics.length === 0" class="text-center text-gray-500 text-lg py-16">
      No metrics to display. Select experiments.
    </div>
    <div
      v-for="metric in metrics"
      :key="metric"
      class="border p-6 rounded shadow bg-white"
    >
      <h3 class="mb-4 font-semibold text-xl">{{ metric }}</h3>
      <canvas :ref="setChartRef(metric)" class="w-full" style="height: 28rem;"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

const props = defineProps({
  groupedData: Object,
  selectedExperiments: Array,
});

const chartInstances = new Map();
const canvasRefs = new Map();
const metrics = ref([]);

function collectMetrics() {
  const metricSet = new Set();
  for (const exp of props.selectedExperiments) {
    const data = props.groupedData?.[exp];
    if (!data) continue;
    Object.keys(data).forEach((m) => metricSet.add(m));
  }
  return Array.from(metricSet);
}

function setChartRef(metric) {
  return (el) => {
    if (el) canvasRefs.set(metric, el);
  };
}

function getColor(index, alpha = 1) {
  const colors = [
    '#2563EB', // синій (темніший)
    '#DC2626', // червоний
    '#16A34A', // зелений
    '#D97706', // жовтий/оранж
    '#7C3AED', // фіолетовий
    '#0891B2', // бірюзовий
    '#65A30D', // лаймовий
    '#EA580C', // помаранчевий
  ];
  const color = colors[index % colors.length];
  if (alpha < 1) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

function renderChart(metric) {
  if (!canvasRefs.has(metric)) return;
  const canvas = canvasRefs.get(metric);

  if (chartInstances.has(metric)) {
    chartInstances.get(metric).destroy();
  }

  const datasets = [];

  props.selectedExperiments.forEach((exp, i) => {
    const points = props.groupedData?.[exp]?.[metric];
    if (!points) return;

    datasets.push({
      label: exp,
      data: points.map((p) => ({ x: p.step, y: p.value })),
      borderColor: getColor(i),
      backgroundColor: getColor(i, 0.4),
      fill: false,
      tension: 0.2,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 8,
      hoverBorderWidth: 4,
      // додаємо легку тінь
      segment: {
        borderColor: getColor(i),
      },
    });
  });

  if (datasets.length === 0) return;

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { size: 14 },
            usePointStyle: true,
          },
          onClick: (e, legendItem, legend) => {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          },
        },
        title: {
          display: true,
          text: metric,  // Без "over Steps"
          font: { size: 20, weight: 'bold' },
          padding: { top: 10, bottom: 15 },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          // покращений ховер
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14 },
          cornerRadius: 6,
          padding: 10,
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Step',
            font: { size: 14, weight: 'bold' },
          },
          ticks: {
            font: { size: 13 },
          },
          grid: {
            color: '#eee',
            borderColor: '#ccc',
            borderDash: [5, 5],
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
            font: { size: 14, weight: 'bold' },
          },
          ticks: {
            font: { size: 13 },
          },
          grid: {
            color: '#eee',
            borderColor: '#ccc',
            borderDash: [5, 5],
          },
        },
      },
    },
  });

  chartInstances.set(metric, chart);
}

watch(
  () => [props.groupedData, props.selectedExperiments],
  async () => {
    metrics.value = collectMetrics();

    await nextTick();

    chartInstances.forEach((c) => c.destroy());
    chartInstances.clear();

    metrics.value.forEach(renderChart);
  },
  { immediate: true }
);
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 28rem !important; /* 450px */
}
</style>
