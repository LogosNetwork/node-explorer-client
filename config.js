let config

if (process.env.NODE_ENV === 'production') {
  config = {
    requestURL: '',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:pla.bs:8443',
    rpcHost: 'http://3.215.28.211:55000'
  }
} else {
  config = {
    requestURL: 'http://localhost:3000',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'ws:localhost:8883',
    rpcHost: 'http://172.1.1.100:55000'
  }
}

export default config
