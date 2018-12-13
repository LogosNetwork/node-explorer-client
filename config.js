let config

if (process.env.NODE_ENV === 'production') {
  config = {
    rpcProxy: 'https://pla.bs',
    mqttHost: 'wss:pla.bs:8443',
    requiresAuth: true,
    delegates: {
      0: '100.25.175.142',
      1: '174.129.135.230',
      2: '18.208.239.123',
      3: '18.211.1.90',
      4: '18.233.175.15',
      5: '18.233.235.87',
      6: '3.81.242.200',
      7: '3.82.164.171',
      8: '34.227.209.242',
      9: '34.237.166.184',
      10: '34.239.238.121',
      11: '35.170.167.20',
      12: '50.17.125.174',
      13: '52.203.151.67',
      14: '52.23.71.123',
      15: '52.6.18.99',
      16: '52.6.230.153',
      17: '52.86.212.70',
      18: '54.145.211.218',
      19: '54.145.253.93',
      20: '54.147.201.7',
      21: '54.147.253.43',
      22: '54.163.88.0',
      23: '54.166.158.6',
      24: '54.197.141.197',
      25: '54.205.169.103',
      26: '54.236.190.13',
      27: '54.242.31.23',
      28: '54.80.152.235',
      29: '54.84.116.105',
      30: '54.85.141.93',
      31: '54.91.99.2'
    }
  }
  config.rpcHost = `http://${config.delegates[0]}:55000`
} else {
  config = {
    rpcProxy: 'https://pla.bs',
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
