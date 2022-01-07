const API_KEY_FOR_GET_TICKERS_PRICE = '1bb9bb67f17a67ad766c00d7dbcfa4e20a525052f5980e77f399bfce8939a7d0';
const API_PATH_ALL_MANY_LIST = 'https://min-api.cryptocompare.com/data/all/coinlist?summary=true'
const API_PATH_TICKERS_PRICE = `wss://streamer.cryptocompare.com/v2`;
const AGGREGATE_INDEX = "5";

const socket = new WebSocket(`${API_PATH_TICKERS_PRICE}?api_key=${API_KEY_FOR_GET_TICKERS_PRICE}`);
const tickersHandlers = new Map();




export const subscribeToUpdatePriceWS = (ticker) => {
    sendMessageToWb({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}

export const removeSubscribeToUpdatePriceWS = (ticker) => {
    sendMessageToWb({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    })
}

const sendMessageToWb = (message) => {
    const messageJSON = JSON.stringify(message)

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(messageJSON)
        return;
    }

    socket.addEventListener('open', () => {
        socket.send(messageJSON)
    }, {once: true})
}

export const subscribeToUpdatePrice = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToUpdatePriceWS(ticker);
};

export const removeSubscribeToUpdatePrice = ticker => {
    tickersHandlers.delete(ticker);
    removeSubscribeToUpdatePriceWS(ticker);
};

socket.addEventListener('message',(evt) => {
    const {TYPE: type, FROMSYMBOL: currentTickerName, PRICE: newPrice} = JSON.parse(evt.data);
    if (type !== AGGREGATE_INDEX || newPrice === undefined) return false;
    tickersHandlers.get(currentTickerName)?.forEach(fn => fn(newPrice))
})

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