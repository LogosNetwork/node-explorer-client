let config

if (process.env.NODE_ENV === 'production') {
  config = {
    requestURL: '',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:pla.bs:8443',
    rpcHost: '3.215.28.211',
    rpcPort: '55000'
  }
} else {
  config = {
    requestURL: 'https://pla.bs',
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:pla.bs:8443',
    rpcHost: '3.215.28.211',
    rpcPort: '55000'
  }
}

export default config
