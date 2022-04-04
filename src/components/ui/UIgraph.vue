<template>
  <div class="flex items-end border-gray-600 border-b border-l h-64">
    <div
      v-for="(bar, idx) of normalizeGraph()"
      :key="idx"
      class="bg-purple-800 border w-10"
      :style="{ height: `${bar}%` }"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'UIgraph',
  props: {
    numbers: {
      type: Array,
    },
  },
  methods: {
    normalizeGraph() {
      const maxValue = Math.max(...this.numbers);
      const minValue = Math.min(...this.numbers);

      if (maxValue === minValue) {
        return new Array(this.numbers.length).fill(50);
      }

      return this.numbers.map(
          (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue),
      );
    },
  },
};
</script>

<style scoped></style>
