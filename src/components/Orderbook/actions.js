export function hasErrored(bool) {
  return {
    type: 'ORDERBOOK_HAS_ERRORED',
    hasErrored: bool
  }
}

export function isLoading(bool) {
  return {
    type: 'ORDERBOOK_IS_LOADING',
    isLoading: bool
  }
}
export function hasFetched(bool) {
  return {
    type: 'ORDERBOOK_HAS_FETCHED',
    hasFetched: bool
  }
}

export function socketUpdate(data) {
  return {
    type: 'ORDERBOOK_WS_UPDATE',
    data: data
  }
}

export function connectToSocket() {
  return (dispatch) => {
    dispatch(isLoading(true))

    const socket = new WebSocket('wss://api.delta.exchange:2096')

    const handleData = (event) => {
      dispatch(isLoading(false))
      dispatch(hasFetched(true))

      const data = JSON.parse(event.data)
      dispatch(socketUpdate({
        type: data.type,
        response: data
      }))
    }

    socket.addEventListener('message', handleData)

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({
        type: 'subscribe',
        payload: {
          channels:[
            {"name":"l2_orderbook","symbols":["BTCUSD"]}
          ]
        }
      }))
    })

    socket.addEventListener('close', () => {
      console.info('WebSocket disconnected.')
      dispatch(hasErrored(true))
    })

  }
}
