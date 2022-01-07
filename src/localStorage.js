const LOCAL_STORAGE_TICKERS_KEY = 'tickerListStorage';


export const saveTickersInLocalStorage = (tickers) => {
    const tickerListStorage = JSON.stringify(tickers)
    localStorage.setItem(LOCAL_STORAGE_TICKERS_KEY, tickerListStorage)
}

export const getTickersFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TICKERS_KEY)) ?? false
}