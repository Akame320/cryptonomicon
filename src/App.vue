<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!--    <div class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center">-->
    <!--      <svg class="animate-spin -ml-1 mr-3 h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"-->
    <!--           viewBox="0 0 24 24">-->
    <!--        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>-->
    <!--        <path class="opacity-75" fill="currentColor"-->
    <!--              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>-->
    <!--      </svg>-->
    <!--    </div>-->
    <div class="container">
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
            <!-- HELP -->
            <div v-if="similarTickers" class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
              <span
                  v-for="(similarTicker, idx) of filterSimilarTickers"
                  :key="idx"
                  @click="addTickerFromSimilar(similarTicker.Symbol)"
                  class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ similarTicker.Symbol }}
            </span>
            </div>
            <div v-if="isWarningTickerExists" class="text-sm text-red-600">Такой тикер уже добавлен</div>
          </div>
        </div>
        <button
            @click="addTicker(tickerInput)"
            type="button"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
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
        </button>
      </section>

      <template v-if="tickers.length > 0">

        <hr class="w-full border-t border-gray-600 my-4"/>

        <div>
          <button
              @click="page--"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              :class="{'btn-disable': page === 1}"
          >
            Назад
          </button>
          {{ page }}
          <button @click="page++"
                  class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  :class="{'btn-disable': page >= maxPages}"
          >
            Вперед
          </button>
          <div>Фильтр: <input v-model="filterInput"/></div>
        </div>

        <hr class="w-full border-t border-gray-600 my-4"/>

        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div v-for="ticker of paginationTickers" :key="ticker.name + ticker.price"
               @click="tickerCardHandler(ticker)"
               class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
               :class="{'border-4': currentTickerSelect === ticker}"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ ticker.name }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ ticker.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
                @click.stop="removeTicker(ticker)"
                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
              >
                <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4"/>
      </template>
      <section class="relative" v-if="currentTickerSelect">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ currentTickerSelect.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
              v-for="(bar, idx) of normalizeGraph"
              :key="idx"
              class="bg-purple-800 border w-10"
              :style="{height: `${bar}%`}"
          ></div>
        </div>
        <button
            type="button"
            class="absolute top-0 right-0"
            @click="removeGraph"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              version="1.1"
              width="30"
              height="30"
              x="0"
              y="0"
              viewBox="0 0 511.76 511.76"
              style="enable-background:new 0 0 512 512"
              xml:space="preserve"
          >
          <g>
            <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
            ></path>
          </g>
        </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>

// #-0-# Тикеры не обновляются при перезагрузке
// #-1-# Валидация работает не исправно
// #-2-# Маг значения
// #-3-# Нет подсказок
// #-4-# Портянка функций
// #-5-# Пересмотреть методы на логику
// #-6-#
// #-7-#
// #-8-#
// #-9-#

export default {
  name: 'App',
  components: {},
  data() {
    return {
      tickerInput: '',
      isWarningTickerExists: false,
      currentTickerSelect: null,
      filterInput: '',
      page: 1,

      similarTickers: [],
      tickers: [],
      allManyList: [],
      graph: [],

      LOCAL_STORAGE_TICKERS_KEY: 'tickerListStorage',
      PAGE_TICKERS_LENGTH: 6,
      API_PATH_ALL_MANY_LIST: 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true',
      API_KEY_FOR_GET_TICKERS_PRICE: '1bb9bb67f17a67ad766c00d7dbcfa4e20a525052f5980e77f399bfce8939a7d0',
      API_PATH_TICKERS_PRICE: 'https://min-api.cryptocompare.com/data/price',
      TICKERS_SIMILAR_OUT_COUNT: 4,
    }
  },
  mounted() {
    this.getAllMany();

    if (this.getTickersFromLocalStorage) {
      this.tickers = this.getTickersFromLocalStorage
      this.subscribeToUpdates()
    }

  },
  computed: {
    tickersFilter() {
      return this.tickers.filter((ticker) => ticker.name.includes(this.filterInput))
    },

    searchSimilarTickers() {
      return this.similarTickers.filter(ticker => {
        return ticker.Symbol.includes(this.tickerInput) && !this.checkPresenceTicker(ticker.Symbol)
      })
    },

    filterSimilarTickers() {
      return this.searchSimilarTickers.slice(0, this.TICKERS_SIMILAR_OUT_COUNT)
    },

    tickerInputValidation() {
      if (/^\s*$/.test(this.tickerInput)) return false;
      if (this.tickers.length > 0) {
        if (this.checkPresenceTicker(this.tickerInput)) return false;
      }
      if (!this.checkTickerInAllManyList) return false;
      return true;
    },

    paginationTickers() {
      return this.tickersFilter.slice(((this.page - 1) * this.PAGE_TICKERS_LENGTH), this.page * this.PAGE_TICKERS_LENGTH)
    },

    getTickersFromLocalStorage() {
      return JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_TICKERS_KEY))
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return new Array(this.graph.length).fill(50)
      }

      return this.graph.map(
          price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    checkTickerInAllManyList() {
      return this.similarTickers.find((ticker) => ticker.Symbol === this.tickerInput);
    },

    maxPages() {
      return Math.ceil(this.tickersFilter.length / this.PAGE_TICKERS_LENGTH)
    }
  },
  methods: {
    getAllMany() {
      fetch(this.API_PATH_ALL_MANY_LIST)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.similarTickers = this.normalizeSimilarTickers(data.Data)
          });
    },

    normalizeSimilarTickers(similarTickers) {
      const normSimilarTickers = []
      for (const key in similarTickers) {
        normSimilarTickers.push(similarTickers[key])
      }
      return normSimilarTickers;
    },

    /*
    ------------------------------------------------------------------------------------------------------------------------
    ------------------------- TICKER() -------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------
    */

    checkPresenceTicker(tickerName) {
      return this.tickers.find((t) => t.name === tickerName)
    },

    addTicker(tickerName) {
      if (!this.tickerInputValidation) return false;
      this.tickers.push(this.createTicker(tickerName))
      this.clearInputs()
    },

    addTickerFromSimilar(tickerName) {
      this.tickers.push(this.createTicker(tickerName))
      this.clearInputs()
    },

    createTicker(name) {
      return {
        name: name,
        price: null
      }
    },

    removeTicker(ticker) {
      const removeTickerIndex = this.tickers.findIndex((t) => t === ticker)
      this.tickers.splice(removeTickerIndex, 1)
    },

    tickerCardHandler(ticker) {
      this.currentTickerSelect = ticker
      this.graph.splice(0, this.graph.length)
    },

    /*
    ------------------------------------------------------------------------------------------------------------------------
    ------------------------- PAGINATION() ---------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------
    */

    updatePageCounter() {
      const thereIsTickersInBoard = this.paginationTickers;
      if (thereIsTickersInBoard.length === 0 && this.tickers && this.page !== 1) {
        this.page--;
      }
    },

    /*
    ------------------------------------------------------------------------------------------------------------------------
    ------------------------- GRAPH() --------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------
    */


    /*
    ------------------------------------------------------------------------------------------------------------------------
    ------------------------- HELPERS() --------------------------------------------------------------------------------------
    ------------------------------------------------------------------------------------------------------------------------
    */

    removeGraph() {
      this.currentTickerSelect = null
    },

    subscribeToUpdates() {
      setInterval(async () => {
        for (const ticker of this.tickers) {
          const f = await fetch(`${this.API_PATH_TICKERS_PRICE}?fsym=${ticker.name}&tsyms=USD&api-key=${this.API_KEY_FOR_GET_TICKERS_PRICE}`);

          const data = await f.json();

          this.tickers.find(t => t.name === ticker.name).price = data.USD > 1 ? data.USD.toFixed(2) : data.USD.toPrecision(2);

          if (this.currentTickerSelect?.name === ticker.name) {
            this.graph.push(data.USD);
          }
        }
      }, 5000);
    },

    saveTickersInLocalStorage() {
      const tickerListStorage = JSON.stringify(this.tickers)
      localStorage.setItem(this.LOCAL_STORAGE_TICKERS_KEY, tickerListStorage)
    },

    clearInputs() {
      this.tickerInput = ''
      this.filterInput = ''
    }


  },
  watch: {
    tickerInput() {
      this.isWarningTickerExists = this.checkPresenceTicker(this.tickerInput)
      this.similarTickers.splice(0, 3)
    },

    filterInput() {
      this.updatePageCounter()
    },

    tickers() {
      this.saveTickersInLocalStorage()
      this.updatePageCounter()
    },
  }
}
</script>

<style src="./assets/css/index.css"></style>
