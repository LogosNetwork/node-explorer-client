let config

if (process.env.NODE_ENV === 'production') {
  config = {
    rpcHost: 'http://34.230.59.175:55000',
    mqttHost: 'wss:18.235.68.120:8883/mqtt',
    requiresAuth: true
  }
} else {
  config = {
    rpcHost: 'http://34.230.59.175:55000',
    mqttHost: 'ws:18.235.68.120:8883/mqtt',
    requiresAuth: false
  }
}

export default config
