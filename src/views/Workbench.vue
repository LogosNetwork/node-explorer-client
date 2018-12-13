<template>
  <div id="primary">
    <b-container class="pt-5">
        <h5 class="text-left" v-t="'build_api_cta'"></h5>
        <b-input :placeholder="config.rpcHost" v-model="nodeURL" class="mb-3" />
        <b-card no-body class="mb-3">
            <b-tabs pills card vertical>
                <b-tab title="My Account" active>
                    <p class="card-text text-left">Private Key is required for account actions</p>
                    <p>
                      <small class="text-danger">These commands will send your private key to the node to perform actions. You can do all these actions locally elsewhere in the workbench.</small>
                    </p>
                    <b-input id="pkey" placeholder="Private Key" v-model="key" class="mb-3" />
                    <b-form-select v-model="selectedAccount" :options="labels[0]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[0][selectedAccount].params" :key="index">
                      <p v-if="!param.type || param.type === 'text'" class="card-text text-left">{{param.label}}
                          {{param.type}}
                          <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                      </p>
                      <b-form-checkbox v-if="param.type && param.type === 'boolean'"
                          v-model="param.value"
                          value="true"
                          unchecked-value="false">
                          {{param.label}}
                      </b-form-checkbox>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[0][selectedAccount].action(options[0][selectedAccount].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Accounts">
                   <b-form-select v-model="selectedAccounts" :options="labels[1]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[1][selectedAccounts].params" :key="index">
                        <p v-if="!param.type || param.type === 'text'" class="card-text text-left">{{param.label}}
                            {{param.type}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                        <b-form-checkbox v-if="param.type && param.type === 'boolean'"
                            v-model="param.value"
                            value="true"
                            unchecked-value="false">
                            {{param.label}}
                        </b-form-checkbox>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[1][selectedAccounts].action(options[1][selectedAccounts].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Keys">
                    <b-form-select v-model="selectedKeys" :options="labels[2]" class="mb-5" />
                    <div v-for="(param, index) in options[2][selectedKeys].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[2][selectedKeys].action(options[2][selectedKeys].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Work">
                    <b-form-select v-model="selectedWork" :options="labels[3]" class="mb-5" />
                    <div v-for="(param, index) in options[3][selectedWork].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[3][selectedWork].action(options[3][selectedWork].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Transactions">
                    <b-form-select v-model="selectedTransactions" :options="labels[4]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[4][selectedTransactions].params" :key="index">
                      <p v-if="!param.type || param.type === 'text'" class="card-text text-left">{{param.label}}
                          {{param.type}}
                          <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                      </p>
                      <b-form-checkbox v-if="param.type && param.type === 'boolean'"
                          v-model="param.value"
                          value="true"
                          unchecked-value="false">
                          {{param.label}}
                      </b-form-checkbox>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[4][selectedTransactions].action(options[4][selectedTransactions].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Blocks">
                    <b-form-select v-model="selectedBlocks" :options="labels[6]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[6][selectedBlocks].params" :key="index">
                      <p v-if="!param.type || param.type === 'text'" class="card-text text-left">{{param.label}}
                          {{param.type}}
                          <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                      </p>
                      <b-form-checkbox v-if="param.type && param.type === 'boolean'"
                          v-model="param.value"
                          value="true"
                          unchecked-value="false">
                          {{param.label}}
                      </b-form-checkbox>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[6][selectedBlocks].action(options[6][selectedBlocks].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Other">
                    <b-form-select v-model="selectedOther" :options="labels[5]" class="mb-5" />
                    <div v-for="(param, index) in options[5][selectedOther].params" :key="index">
                      <p v-if="!param.type || param.type === 'text'" class="card-text text-left">{{param.label}}
                          {{param.type}}
                          <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                      </p>
                      <b-form-checkbox v-if="param.type && param.type === 'boolean'"
                          v-model="param.value"
                          value="true"
                          unchecked-value="false">
                          {{param.label}}
                      </b-form-checkbox>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[5][selectedOther].action(options[5][selectedOther].params)">Execute</b-button>
                </b-tab>
            </b-tabs>
        </b-card>
        <h5 class="text-left" v-if='editor.length > 0' v-t="'workbench_output'"></h5>
        <codepad id='editor' class="text-left mb-3" v-if='editor.length > 0' :code='editor'/>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Logos from '../api/rpc'
import LogosWallet from '../api/wallet'
import codepad from '@/components/codepad.vue'
import config from '../../config'
Vue.use(Logos, { url: config.rpcHost, proxyURL: config.rpcProxy, debug: true })
Vue.use(LogosWallet)

export default {
  name: 'workbench',
  components: {
    codepad
  },
  data () {
    let $this = this
    let unsecureSend = async function (params, count = 0) {
      if (count > 2) return
      let logosAmount = params[0].value
      let address = params[1].value
      let forceDelegate = params[2].value
      let lastHash = null
      let abort = false
      $this.editor += `Sending ${logosAmount} to ${address}... \n`
      // Ensure block propagation in test-net in real net bootstraping will solve this client side check
      let shouldAbort = function () {
        return new Promise(resolve => {
          let results = []
          for (let i = 0; i < Object.keys(config.delegates).length; i++) {
            $this.delegateNodeUrl = config.delegates[i]
            if (config.rpcProxy) {
              $this.$Logos.changeServer(
                config.rpcProxy,
                `http://${$this.delegateNodeUrl}:55000`
              )
            } else {
              $this.$Logos.changeServer(
                `http://${$this.delegateNodeUrl}:55000`
              )
            }

            $this.$Logos
              .account($this.key)
              .info()
              .then(val => {
                results.push(val.frontier)
                if (results.length === 32) {
                  let status = results.every((val, i, arr) => val === arr[0])
                  resolve(!status)
                }
              })
          }
        })
      }
      let sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
      }
      abort = await shouldAbort()
      if (config.rpcProxy) {
        $this.$Logos.changeServer(config.rpcProxy, $this.nodeURL)
      } else {
        $this.$Logos.changeServer($this.nodeURL)
      }
      if (!abort) {
        if (!forceDelegate || forceDelegate === 'false') {
          $this.$Logos
            .account($this.key)
            .info()
            .then(val => {
              let delegateId = null
              if (lastHash === '0000000000000000000000000000000000000000000000000000000000000000') {
                $this.$Logos
                  .account($this.key)
                  .publicKey()
                  .then(data => {
                    delegateId = parseInt(data.key.slice(-2), 16) % 32
                    $this.delegateNodeUrl = config.delegates[delegateId]
                    if (config.rpcProxy) {
                      $this.$Logos.changeServer(
                        config.rpcProxy,
                        `http://${$this.delegateNodeUrl}:55000`
                      )
                    } else {
                      $this.$Logos.changeServer(
                        `http://${$this.delegateNodeUrl}:55000`
                      )
                    }
                    $this.editor += `Using delegate:${delegateId}@${$this.delegateNodeUrl}....\n`
                    $this.$Logos
                      .account($this.key)
                      .send(logosAmount, address)
                      .then(val => {
                        $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
                        if (config.rpcProxy) {
                          $this.$Logos.changeServer(
                            config.rpcProxy,
                            $this.nodeURL
                          )
                        } else {
                          $this.$Logos.changeServer($this.nodeURL)
                        }
                      })
                  })
              } else {
                delegateId = parseInt(val.frontier.slice(-2), 16) % 32
                $this.delegateNodeUrl = config.delegates[delegateId]
                if (config.rpcProxy) {
                  $this.$Logos.changeServer(
                    config.rpcProxy,
                    `http://${$this.delegateNodeUrl}:55000`
                  )
                } else {
                  $this.$Logos.changeServer(
                    `http://${$this.delegateNodeUrl}:55000`
                  )
                }
                $this.editor += `Using delegate:${delegateId}@${$this.delegateNodeUrl}....\n`
                $this.$Logos
                  .account($this.key)
                  .send(logosAmount, address)
                  .then(val => {
                    $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
                    if (config.rpcProxy) {
                      $this.$Logos.changeServer(config.rpcProxy, $this.nodeURL)
                    } else {
                      if (config.rpcProxy) {
                        $this.$Logos.changeServer(
                          config.rpcProxy,
                          $this.nodeURL
                        )
                      } else {
                        $this.$Logos.changeServer($this.nodeURL)
                      }
                    }
                  })
              }
            })
        } else {
          $this.editor += `Using forced delegate:${$this.nodeURL}....\n`
          $this.$Logos
            .account($this.key)
            .send(logosAmount, address)
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        }
      } else {
        await sleep(1000)
        unsecureSend(params, ++count)
      }
    }
    let secureSend = async function (params, count = 0) {
      if (count > 2) return
      let wallet = new $this.$Wallet()
      let blk = new $this.$Block()
      let pk = params[0].value
      let accountId = params[1].value
      let amountLogos = params[2].value
      let recipientAddress = params[3].value
      let forceDelegate = params[4].value
      let lastHash = null
      let delegateId = null
      let abort = false
      $this.editor += `Sending ${amountLogos} to ${recipientAddress}... \n`
      // Ensure block propagation in test-net in real net bootstraping will solve this client side check
      let shouldAbort = function () {
        return new Promise(resolve => {
          let results = []
          for (let i = 0; i < Object.keys(config.delegates).length; i++) {
            $this.delegateNodeUrl = config.delegates[i]
            if (config.rpcProxy) {
              $this.$Logos.changeServer(
                config.rpcProxy,
                `http://${$this.delegateNodeUrl}:55000`
              )
            } else {
              $this.$Logos.changeServer(
                `http://${$this.delegateNodeUrl}:55000`
              )
            }
            $this.$Logos.accounts.info(accountId).then(val => {
              results.push(val.frontier)
              if (results.length === 32) {
                let status = results.every((val, i, arr) => val === arr[0])
                resolve(!status)
              }
            })
          }
        })
      }
      let sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
      }
      let workAndProcess = function () {
        $this.$Logos.work.generate(lastHash).then(val => {
          $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          blk.setWork(val.work)
          let transaction = blk.getJSONBlock()
          if (!forceDelegate || forceDelegate === 'false') {
            $this.editor += `Using delegate:${delegateId}@${$this.delegateNodeUrl} \n ${JSON.stringify(transaction, null, ' ')} \n`
          } else {
            $this.editor += `Using forced delegate of ${$this.nodeURL} \n ${JSON.stringify(transaction, null, ' ')} \n`
          }
          $this.$Logos.transactions.publish(transaction).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            if (!forceDelegate || forceDelegate === 'false') {
              if (config.rpcProxy) {
                $this.$Logos.changeServer(config.rpcProxy, $this.nodeURL)
              } else {
                $this.$Logos.changeServer($this.nodeURL)
              }
            }
          })
        })
      }
      abort = await shouldAbort()
      if (config.rpcProxy) {
        $this.$Logos.changeServer(config.rpcProxy, $this.nodeURL)
      } else {
        $this.$Logos.changeServer($this.nodeURL)
      }
      if (!abort) {
        $this.editor += `Retreiving the account info of my account....\n`
        let amount = $this.$Logos.convert.toReason(amountLogos, 'LOGOS')
        $this.$Logos.accounts.info(accountId).then(val => {
          $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          lastHash = val.frontier
          blk.setSendParameters(lastHash, recipientAddress, amount)
          blk.setAccount(accountId)
          if (val.representative_block) {
            blk.setRepresentative(val.representative_block)
          } else {
            blk.setRepresentative(accountId)
          }
          blk.build()
          let hash = blk.getHash()
          let uint8PK = $this.$LogosFunctions.hex_uint8(pk)
          blk.setSignature(
            $this.$LogosFunctions.uint8_hex(wallet.sign(hash, uint8PK))
          )
          $this.editor += `Generating work for ${lastHash}....\n`
          if (!forceDelegate || forceDelegate === 'false') {
            if (lastHash === '0000000000000000000000000000000000000000000000000000000000000000') {
              $this.$Logos.accounts.key(accountId).then(data => {
                delegateId = parseInt(data.key.slice(-2), 16) % 32
                $this.delegateNodeUrl = config.delegates[delegateId]
                if (config.rpcProxy) {
                  $this.$Logos.changeServer(
                    config.rpcProxy,
                    `http://${$this.delegateNodeUrl}:55000`
                  )
                } else {
                  $this.$Logos.changeServer(
                    `http://${$this.delegateNodeUrl}:55000`
                  )
                }
                workAndProcess()
              })
            } else {
              delegateId = parseInt(val.frontier.slice(-2), 16) % 32
              $this.delegateNodeUrl = config.delegates[delegateId]
              if (config.rpcProxy) {
                $this.$Logos.changeServer(
                  config.rpcProxy,
                  `http://${$this.delegateNodeUrl}:55000`
                )
              } else {
                $this.$Logos.changeServer(
                  `http://${$this.delegateNodeUrl}:55000`
                )
              }
              workAndProcess()
            }
          } else {
            workAndProcess()
          }
        })
      } else {
        await sleep(1000)
        secureSend(params, ++count)
      }
    }
    const accountLabels = [
      { value: 0, text: 'Create a Send' },
      { value: 1, text: 'Check balance in Reason' },
      { value: 2, text: 'Check balance in Logos' },
      { value: 3, text: 'Lookup total transaction count' },
      { value: 4, text: 'Pull account history' },
      { value: 5, text: 'Info' },
      { value: 6, text: 'Lookup Public Key' }
    ]
    const accountOptions = [
      {
        action: unsecureSend,
        params: [
          {
            name: 'logosAmount',
            label: `The amount of Logos you wish to send`,
            required: true
          },
          {
            name: 'address',
            label: `The address of the account you wish to send to`,
            required: true
          },
          {
            name: 'details',
            type: 'boolean',
            label: `Force transaction to be processed by your selected node this will incur a 5 second delay on your transaction`,
            required: true
          }
        ]
      },
      {
        action: function () {
          $this.editor += `Checking my balance in reason....\n`
          $this.$Logos
            .account($this.key)
            .reasonBalance()
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: []
      },
      {
        action: function () {
          $this.editor += `Checking my balance in logos....\n`
          $this.$Logos
            .account($this.key)
            .logosBalance()
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: []
      },
      {
        action: function () {
          $this.editor += `Retreiving the sum of transactions in my account....\n`
          $this.$Logos
            .account($this.key)
            .blockCount()
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: []
      },
      {
        action: function (params) {
          let count = params[0].value
          $this.editor += `Retreiving the last ${count} transactions in my account....\n`
          $this.$Logos
            .account($this.key)
            .history(count)
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: [
          {
            name: 'count',
            label: `The number of transactions you want to fetch`,
            required: false
          }
        ]
      },
      {
        action: function () {
          $this.editor += `Retreiving the account info of my account....\n`
          $this.$Logos
            .account($this.key)
            .info()
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: []
      },
      {
        action: function () {
          $this.editor += `Retreiving the public key for my account....\n`
          $this.$Logos
            .account($this.key)
            .publicKey()
            .then(val => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
            })
        },
        params: []
      }
    ]

    const accountsOptions = [
      {
        action: function (params) {
          let publicKey = params[0].value
          $this.editor += `Fetching the account id for ${publicKey}....\n`
          $this.$Logos.accounts.toAddress(publicKey).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'publicKey',
            label: `Public Key`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let accountId = params[0].value
          $this.editor += `Checking reason balance for account id ${accountId}....\n`
          $this.$Logos.accounts.reasonBalance(accountId).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'account',
            label: `Account Id`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let accountId = params[0].value
          $this.editor += `Checking logos balance for account id ${accountId}....\n`
          $this.$Logos.accounts.logosBalance(accountId).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'account',
            label: `Account Id`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let tarAccounts = params[0].value.split(',')
          $this.editor += `Checking balances for accounts ${tarAccounts}....\n`
          $this.$Logos.accounts.balances(tarAccounts).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'accounts',
            label: `Account Ids Comma Seperated`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let accountId = params[0].value
          let count = params[1].value
          $this.editor += `Checking last ${count} transactions for account ${accountId}....\n`
          $this.$Logos.accounts.history(accountId, count).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'account',
            label: `Account Id`,
            required: true
          },
          {
            name: 'count',
            label: `Number of transactions you wish to see`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let accountId = params[0].value
          $this.editor += `Getting info for account ${accountId}....\n`
          $this.$Logos.accounts.info(accountId).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'account',
            label: `Account Id`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let accountId = params[0].value
          $this.editor += `Getting public key for account ${accountId}....\n`
          $this.$Logos.accounts.key(accountId).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'account',
            label: `Account Id`,
            required: true
          }
        ]
      }
    ]
    const accountsLabels = [
      { value: 0, text: 'Get the account name from public key' },
      { value: 1, text: 'Account Balance in Reason' },
      { value: 2, text: 'Account Balance in Logos' },
      { value: 3, text: 'Accounts Balance' },
      { value: 4, text: 'History of an account' },
      { value: 5, text: 'Account info' },
      { value: 6, text: 'Get public key from account name' }
    ]

    const keyOptions = [
      {
        action: function (params) {
          $this.editor += `Creating a new keypair....\n`
          $this.$Logos.key.create().then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: []
      },
      {
        action: function (params) {
          let privateKey = params[0].value
          $this.editor += `Expanding the private key ${privateKey} into a keypair....\n`
          $this.$Logos.key.expand(privateKey).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'privateKey',
            label: `Private Key`,
            required: true
          }
        ]
      }
    ]
    const keyLabels = [
      { value: 0, text: 'Create a new key' },
      {
        value: 1,
        text: 'Derive public key and account number from private key'
      }
    ]

    const workOptions = [
      {
        action: function (params) {
          let hash = params[0].value
          $this.editor += `Generating work for ${hash}....\n`
          $this.$Logos.work.generate(hash).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'hash',
            label: `Hash of the transaction you are requesting work for`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let work = params[0].value
          let hash = params[1].value
          $this.editor += `Validating the work ${work} for the hash ${hash}....\n`
          $this.$Logos.work.validate(work, hash).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'work',
            label: `The work you want to be validated`,
            required: true
          },
          {
            name: 'hash',
            label: `Hash of the transaction you are checking the work for`,
            required: true
          }
        ]
      }
    ]
    const workLabels = [
      { value: 0, text: 'Generate work' },
      { value: 1, text: 'Validate work' }
    ]

    const blockOptions = [
      {
        action: function (params) {
          let hash = params[0].value
          if (hash.indexOf(',') !== -1) {
            hash = hash.split(',')
          } else {
            hash = [hash]
          }
          $this.editor += `Fetching batch block of ${hash}....\n`
          $this.$Logos.batchBlocks.get(hash).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'hash',
            label: `Comma seperated Hashes of the batch blocks you want to know about`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let count = params[0].value
          let delegateIndex = params[1].value
          $this.editor += `Fetching ${count} of the most recent batch state blocks from delegate ${delegateIndex}....\n`
          $this.$Logos.batchBlocks.history(count, delegateIndex).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'count',
            label: `Number of most recent batch state blocks you wish to retreive`,
            required: false
          },
          {
            name: 'delegateIndex',
            label: `Index of the delegate you wish to lookup their batch state block chain`,
            required: false
          }
        ]
      },
      {
        action: function (params) {
          let hash = params[0].value
          if (hash.indexOf(',') !== -1) {
            hash = hash.split(',')
          } else {
            hash = [hash]
          }
          $this.editor += `Fetching micro epochs of ${hash}....\n`
          $this.$Logos.microEpochs.get(hash).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'hash',
            label: `Comma seperated Hashes of the micro epochs you want to know about`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let count = params[0].value
          $this.editor += `Fetching ${count} of the most recent micro epochs....\n`
          $this.$Logos.microEpochs.history(count).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'count',
            label: `Number of most recent micro epochs you wish to retreive`,
            required: false
          }
        ]
      },
      {
        action: function (params) {
          let hash = params[0].value
          if (hash.indexOf(',') !== -1) {
            hash = hash.split(',')
          } else {
            hash = [hash]
          }
          $this.editor += `Fetching epochs of ${hash}....\n`
          $this.$Logos.epochs.get(hash).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'hash',
            label: `Comma seperated Hashes of the epoch you want to know about`,
            required: true
          }
        ]
      },
      {
        action: function (params) {
          let count = params[0].value
          $this.editor += `Fetching ${count} of the most recent epoch blocks....\n`
          $this.$Logos.epochs.history(count).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'count',
            label: `Number of most recent epoch blocks you wish to retreive`,
            required: false
          }
        ]
      }
    ]

    const blockLabels = [
      { value: 0, text: 'Lookup Batch Blocks by hash' },
      { value: 1, text: 'Recent Batch Blocks' },
      { value: 2, text: 'Lookup Micro Epochs by hash' },
      { value: 3, text: 'Recent Micro Epochs' },
      { value: 4, text: 'Lookup Epochs by hash' },
      { value: 5, text: 'Recent Epochs' }
    ]

    const transactionOptions = [
      {
        action: function (params) {
          let hash = params[0].value
          if (hash.indexOf(',') !== -1) {
            hash = hash.split(',')
          }
          let details = params[1].value
          $this.editor += `Fetching transaciton info of ${hash}....\n`
          $this.$Logos.transactions.info(hash, details).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'hash',
            label: `Comma seperated Hashes of the transactions you want to know about`,
            required: true
          },
          {
            name: 'details',
            type: 'boolean',
            label: `Show full transaction details`,
            required: false
          }
        ]
      },
      {
        action: secureSend,
        params: [
          {
            name: 'privateKey',
            label: `Private Key only used locally to sign the message`,
            required: true
          },
          {
            name: 'accountid',
            label: `My Account id `,
            required: true
          },
          {
            name: 'amount',
            label: `Transaction Amount you want to send in Logos`,
            required: true
          },
          {
            name: 'destination',
            label: `Target Address`,
            required: true
          },
          {
            name: 'details',
            type: 'boolean',
            label: `Force transaction to be processed by your selected node this will incur a 5 second delay on your transaction`,
            required: true
          }
        ]
      }
    ]

    const transactionLabels = [
      { value: 0, text: 'Transaction Info' },
      { value: 1, text: 'Publish Send Transaction' }
    ]

    const otherOptions = [
      {
        action: function () {
          $this.editor += `Fetching total amount of Logos....\n`
          $this.$Logos.available().then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: []
      },
      {
        action: function (params) {
          let seed = params[0].value
          let index = params[1].value
          $this.editor += `Generating the ${index} index keypair to ${seed}....\n`

          $this.$Logos.deterministicKey(seed, index).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'seed',
            label: `The seed you wish to derive from`,
            required: true
          },
          {
            name: 'index',
            label: `index of the key`,
            required: false
          }
        ]
      },
      {
        action: function (params) {
          // let count = params[0].value
        },
        params: [
          {
            name: 'number',
            label: `Number of transactions to send`,
            required: false
          }
        ]
      },
      {
        action: function (params) {
          let epoch = params[0].value
          $this.editor += `Forcing Transition to occur....\n`
          $this.$Logos.generateMicroBlock(epoch).then(val => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        params: [
          {
            name: 'epoch',
            type: 'boolean',
            label: `Generate Epoch also`,
            required: false
          }
        ]
      }
    ]
    const otherLabels = [
      { value: 0, text: 'Total Available Supply' },
      { value: 1, text: 'Deterministic Key' }
      // { value: 2, test: 'Fun Stress Test'}
      // { value: 3, text: 'Force Micro Epoch and Epoch to occur' }
    ]

    const options = [
      accountOptions,
      accountsOptions,
      keyOptions,
      workOptions,
      transactionOptions,
      otherOptions,
      blockOptions
    ]

    const labels = [
      accountLabels,
      accountsLabels,
      keyLabels,
      workLabels,
      transactionLabels,
      otherLabels,
      blockLabels
    ]

    return {
      key: null,
      options: options,
      config: config,
      editor: '',
      nodeURL: config.rpcHost,
      delegateNodeUrl: null,
      labels: labels,
      selectedAccount: 0,
      selectedAccounts: 0,
      selectedKeys: 0,
      selectedWork: 0,
      selectedTransactions: 0,
      selectedOther: 0,
      selectedBlocks: 0
    }
  },
  watch: {
    nodeURL: function (val) {
      if (config.rpcProxy) {
        this.$Logos.changeServer(config.rpcProxy, val)
      } else {
        this.$Logos.changeServer(val)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.nav-link {
  color: #6b7c93;
}
#editor {
  max-height: 400px;
  overflow-y: scroll;
}
</style>
