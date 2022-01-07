const API_KEY_FOR_GET_TICKERS_PRICE = 'c901f3563f5c26b8e285e400f62fb11e12b8f497a3e53ae44bda545a5e83aa37';
const API_PATH_ALL_MANY_LIST = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
// const API_PATH_TICKERS_PRICE = `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY_FOR_GET_TICKERS_PRICE}`;
// const AGGREGATE_INDEX = "5";

// const socket = new WebSocket(API_PATH_TICKERS_PRICE);
const tickersHandlers = new Map();

export const subscribeToUpdatePrice = (ticker, cb) => {
    const subscribes = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribes, cb]);
}

export const removeSubscribeToUpdatePrice = (ticker) => {
    tickersHandlers.delete(ticker);
}

const loadPrice = () => {
    if (tickersHandlers.size === 0) return false;

    fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY_FOR_GET_TICKERS_PRICE}`).then(r => r.json()).then(rawData => {
        const updatePrices = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [key, value.USD])
        );
        Object.entries(updatePrices).forEach(([currency, newPrice]) => {
            const handlers = tickersHandlers.get(currency) ?? []
            handlers.forEach(fn => fn(newPrice));
        })
    })
}

export const getAllManyList = (cb) => {
    fetch(API_PATH_ALL_MANY_LIST)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const allManyList = [];
            for (const key in data.Data) {
                allManyList.push(data.Data[key].Symbol)
            }
            cb(allManyList)
        });
}

setInterval(loadPrice, 5000);