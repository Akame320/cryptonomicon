<script src="api.js"></script>

<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <Adding :tickers="tickers" @addTicker="addNewTicker"/>
      <template v-if="tickers.length > 0">
        <hr class="w-full border-t border-gray-600 my-4"/>

        <PaginationBoard
            :itemsData="tickersFilter()"
            v-slot="slotProps"
            @filterInput="value => filterInput = value"
        >
          <TickerCard
              :data="slotProps.item"
              @clickSelect='tickerCardHandler'
              @clickRemove="removeTicker"
          />
        </PaginationBoard>

        <hr class="w-full border-t border-gray-600 my-4"/>
      </template>
      <Graph
          :ticker="currentTickerSelect"
          @remove="removeGraph"
      />
    </div>
  </div>
</template>

<script>
import {
  subscribeToUpdatePrice,
  removeSubscribeToUpdatePrice,
} from "./api";
import {
  saveTickersInLocalStorage,
  getTickersFromLocalStorage,
} from "./localStorage";

import InputButton from "./components/ui/InputButton";
import Adding from "./components/common/Adding";
import TickerCard from "./components/common/TickerCard";
import Graph from "./components/common/Graph";
import PaginationBoard from "./components/common/PaginationBoard";

export default {
  name: "App",
  components: {
    InputButton,
    Adding,
    TickerCard,
    Graph,
    PaginationBoard,
  },
  data() {
    return {
      currentTickerSelect: null,
      filterInput: "",
      tickers: [],
      page: 1,
    };
  },
  mounted() {
    if (getTickersFromLocalStorage()) {
      this.tickers = getTickersFromLocalStorage();
      this.tickers.forEach((ticker) => {
        subscribeToUpdatePrice(ticker.name, (newPrice) => {
          this.updateTickerPrice(ticker.name, newPrice);
        });
      });
    }
  },
  methods: {
    tickersFilter() {
      return this.tickers.filter((ticker) =>
          ticker.name.includes(this.filterInput)
      );
    },

    updateTickerPrice(name, newPrice) {
      this.tickers.forEach((ticker) => {
        if (ticker.name === name) {
          ticker.price = newPrice;
        }
      });
    },

    addNewTicker(newTickerName) {
      const newCreatedTicker = this.createTicker(newTickerName);
      this.tickers.push(newCreatedTicker);
    },

    createTicker(name) {
      subscribeToUpdatePrice(name, (newPrice) => {
        this.updateTickerPrice(name, newPrice);
      });

      return {
        name: name,
        price: "-",
      };
    },

    removeTicker(ticker) {
      const removeTickerIndex = this.tickers.findIndex((t) => t === ticker);
      this.tickers.splice(removeTickerIndex, 1);
      removeSubscribeToUpdatePrice(ticker.name);
    },

    tickerCardHandler(ticker) {
      this.currentTickerSelect = ticker;
    },

    removeGraph() {
      this.currentTickerSelect = null;
    },
  },
  watch: {
    tickers() {
      saveTickersInLocalStorage(this.tickers);
    },
  },
};
</script>

<style src="./assets/css/index.css"></style>
