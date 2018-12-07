let config

if (process.env.NODE_ENV === 'production') {
  config = {
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:18.235.68.120:8443/mqtt',
    requiresAuth: true,
    delegates: {
      0: '172.1.1.100',
      1: '172.1.1.101',
      2: '172.1.1.102',
      3: '172.1.1.103',
      4: '172.1.1.104',
      5: '172.1.1.105',
      6: '172.1.1.106',
      7: '172.1.1.107',
      8: '172.1.1.108',
      9: '172.1.1.109',
      10: '172.1.1.110',
      11: '172.1.1.111',
      12: '172.1.1.112',
      13: '172.1.1.113',
      14: '172.1.1.114',
      15: '172.1.1.115',
      16: '172.1.1.116',
      17: '172.1.1.117',
      18: '172.1.1.118',
      19: '172.1.1.119',
      20: '172.1.1.120',
      21: '172.1.1.121',
      22: '172.1.1.122',
      23: '172.1.1.123',
      24: '172.1.1.124',
      25: '172.1.1.125',
      26: '172.1.1.126',
      27: '172.1.1.127',
      28: '172.1.1.128',
      29: '172.1.1.129',
      30: '172.1.1.130',
      31: '172.1.1.131'
    }
  }
  config.rpcHost = `http://${config.delegates[0]}:55000`
} else {
  config = {
    mqttHost: 'ws:18.235.68.120:8883/mqtt',
    requiresAuth: false,
    delegates: {
      0: '172.1.1.100',
      1: '172.1.1.101',
      2: '172.1.1.102',
      3: '172.1.1.103',
      4: '172.1.1.104',
      5: '172.1.1.105',
      6: '172.1.1.106',
      7: '172.1.1.107',
      8: '172.1.1.108',
      9: '172.1.1.109',
      10: '172.1.1.110',
      11: '172.1.1.111',
      12: '172.1.1.112',
      13: '172.1.1.113',
      14: '172.1.1.114',
      15: '172.1.1.115',
      16: '172.1.1.116',
      17: '172.1.1.117',
      18: '172.1.1.118',
      19: '172.1.1.119',
      20: '172.1.1.120',
      21: '172.1.1.121',
      22: '172.1.1.122',
      23: '172.1.1.123',
      24: '172.1.1.124',
      25: '172.1.1.125',
      26: '172.1.1.126',
      27: '172.1.1.127',
      28: '172.1.1.128',
      29: '172.1.1.129',
      30: '172.1.1.130',
      31: '172.1.1.131'
    }
  }
  config.rpcHost = `http://${config.delegates[0]}:55000`
}

export default config
