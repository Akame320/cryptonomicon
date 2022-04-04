<template>
  <div>
    <div>
      <button
          @click="localCurrentPage--"
          class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          :class="{'btn-disable': disablePrev()}"
          :disabled="disablePrev()"
      >
        Назад
      </button>
      {{ localCurrentPage }}
      <button
          @click="localCurrentPage++"
          class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          :class="{'btn-disable': disableNext()}"
          :disabled="disableNext()"
      >
        Вперед
      </button>
      <div>Фильтр: <input v-on:input="$emit('filterInput', $event.target.value)"/></div>
    </div>

    <hr class="w-full border-t border-gray-600 my-4"/>

    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div
          v-for="(item, idx) of paginationItems()"
          :key="idx"
      >
        <slot :item="item"></slot>
      </div>
    </dl>
  </div>
</template>

<script>

export default {
  name: "PaginationBoard",
  props: {
    itemsData: {
      type: Array,
      default() {
        return []
      }
    },
    maxItemsOnViewed: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      localCurrentPage: 1,
      filterInput: ''
    }
  },
  methods: {
    maxPages() {
      return Math.ceil(this.itemsData.length / this.maxItemsOnViewed)
    },

    paginationItems() {
      return this.itemsData.slice(
          (this.localCurrentPage - 1) * this.maxItemsOnViewed,
          this.localCurrentPage * this.maxItemsOnViewed
      );
    },

    disableNext() {
      return this.localCurrentPage === this.maxPages();
    },

    disablePrev() {
      return this.localCurrentPage === 1;
    }
  },
  mounted() {
    this.$emit('currentPageIsLast', this.disableNext())
    this.$emit('currentPageIsFirst', this.disablePrev())
  }
}
</script>

<style scoped>

</style>