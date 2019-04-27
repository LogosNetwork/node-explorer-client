let config

if (process.env.NODE_ENV === 'production') {
  config = {
    requestURL: '',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:pla.bs:8443'
  }
} else {
  config = {
    requestURL: 'http://localhost:3000',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'ws:localhost:8883'
  }
}

export default config
