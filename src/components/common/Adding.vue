<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер {{ tickerInput }}</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            @keydown.enter="addTicker(tickerInput)"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
            v-model="tickerInput"
          />
        </div>
        <div
          v-if="similarTickers"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="(similarTickerName, idx) of similarTickers"
            :key="idx"
            @click="addTicker(similarTickerName)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ similarTickerName }}
          </span>
        </div>
        <div v-if="isWarningTickerExists" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
        <div v-if="isWarningTickerDoesNotExists" class="text-sm text-red-600">
          Такого тикера не существует
        </div>
      </div>
    </div>
    <InputButton @click="addTicker(tickerInput)">
      <svg
        class="-ml-0.5 mr-2 h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        ></path>
      </svg>
      Добавить
    </InputButton>
  </section>
</template>

<script>
import InputButton from "@/components/ui/InputButton";
import { getAllManyList } from "@/api";

export default {
  name: "Adding",
  components: {
    InputButton,
  },
  props: {
    tickers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isWarningTickerExists: false,
      isWarningTickerDoesNotExists: false,
      similarTickers: [],
      allManyList: [],
      tickerInput: "",
      TICKERS_SIMILAR_OUT_COUNT: 4,
    };
  },
  mounted() {
    getAllManyList(data => {
      this.allManyList = data;
    });
  },
  methods: {
    searchSimilarTickers(tickerName) {
      return this.allManyList.filter((simTicker) => {
        return simTicker.includes(tickerName);
      });
    },

    tickerInputValidation(tickerName) {
      if (/^\s*$/.test(tickerName)) {
        this.isWarningTickerDoesNotExists = true;
        return false;
      }
      if (!this.searchSimilarTickers(tickerName)) {
        this.isWarningTickerDoesNotExists = true;
        return false;
      }
      return true;
    },

    clearErrors() {
      this.isWarningTickerExists = false;
      this.isWarningTickerDoesNotExists = false;
    },

    addTicker(tickerName) {
      if (!this.tickerInputValidation(tickerName)) return false;
      this.$emit("addTicker", tickerName);
    },

    checkPresenceTicker(tickerName) {
      return this.tickers.find((t) => t.name === tickerName);
    },
  },
  watch: {
    tickerInput() {
      this.isWarningTickerExists = this.checkPresenceTicker(this.tickerInput);
      this.similarTickers = this.searchSimilarTickers(this.tickerInput).slice(0, 3);
    },
  },
};
</script>

<style scoped></style>
