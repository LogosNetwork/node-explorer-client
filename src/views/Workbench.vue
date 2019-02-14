<template>
  <div id="primary">
    <b-container class="pt-5">
        <h5 class="text-left" v-t="'build_api_cta'"></h5>
        <b-input :placeholder="config.rpcHost" v-model="nodeURL" class="mb-3" />
        <b-card no-body class="mb-3">
            <b-tabs pills card vertical>
                <b-tab title="Accounts">
                   <b-form-select v-model="selectedAccounts" :options="labels[0]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[0][selectedAccounts].params" :key="index">
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
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[0][selectedAccounts].action(options[0][selectedAccounts].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Keys">
                    <b-form-select v-model="selectedKeys" :options="labels[1]" class="mb-5" />
                    <div v-for="(param, index) in options[1][selectedKeys].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[1][selectedKeys].action(options[1][selectedKeys].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Work">
                    <b-form-select v-model="selectedWork" :options="labels[2]" class="mb-5" />
                    <div v-for="(param, index) in options[2][selectedWork].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[2][selectedWork].action(options[2][selectedWork].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Transactions">
                    <b-form-select v-model="selectedTransactions" :options="labels[3]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[3][selectedTransactions].params" :key="index">
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
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[3][selectedTransactions].action(options[3][selectedTransactions].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Blocks">
                    <b-form-select v-model="selectedBlocks" :options="labels[5]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[5][selectedBlocks].params" :key="index">
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
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[5][selectedBlocks].action(options[5][selectedBlocks].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Other">
                    <b-form-select v-model="selectedOther" :options="labels[4]" class="mb-5" />
                    <div v-for="(param, index) in options[4][selectedOther].params" :key="index">
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
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[4][selectedOther].action(options[4][selectedOther].params)">Execute</b-button>
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
import codepad from '@/components/codepad.vue'
import config from '../../config'
Vue.use(Logos, { url: config.rpcHost, proxyURL: config.rpcProxy, debug: true })
export default {
  name: 'workbench',
  components: {
    codepad
  },
  data () {
    let $this = this

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
          $this.editor += JSON.stringify($this.$Logos.accounts.key(accountId), null, ' ') + '\n\n'
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
        action: function (params) {
          let privateKey = params[0].value
          let transacitons = [{ target: params[1].value, amount: params[2].value }]
          let forceDelegate = params[3].value
          $this.editor += `Creating transactions... \n`
          $this.$Logos.transactions.createSend(privateKey, transacitons).then(val => {
            $this.editor += JSON.stringify(val, null, 2) + '\n\n'
            let delegateId = null
            if (val.previous !== '0000000000000000000000000000000000000000000000000000000000000000') {
              delegateId = parseInt(val.previous.slice(-2), 16) % 32
            } else {
              let key = $this.$Logos.accounts.key(val.account)
              delegateId = parseInt(key.slice(-2), 16) % 32
            }
            if (!forceDelegate) {
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
              $this.editor += `Publishing transaction to delegate ${delegateId}... \n`
            } else {
              $this.editor += `Publishing transaction... \n`
            }
            $this.$Logos.transactions.publish(JSON.stringify(val)).then((response) => {
              $this.editor += JSON.stringify(response, null, ' ') + '\n\n'
              if (!forceDelegate) {
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
              }
            })
          })
        },
        params: [
          {
            name: 'privateKey',
            label: `The private key of your account only used to locally sign the transaction`,
            required: true
          },
          {
            name: 'address',
            label: `The address of the account you wish to send to`,
            required: true
          },
          {
            name: 'logosAmount',
            label: `The amount of Logos you wish to send`,
            required: true
          },
          {
            name: 'force',
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
      accountsOptions,
      keyOptions,
      workOptions,
      transactionOptions,
      otherOptions,
      blockOptions
    ]

    const labels = [
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
