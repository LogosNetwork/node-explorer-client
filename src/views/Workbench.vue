<template>
  <div id="primary">
    <b-container class="pt-5">
        <h5 class="text-left" v-t="'build_api_cta'"></h5>
        <b-card no-body>
            <b-tabs pills card vertical>
                <b-tab title="My Account" active>
                    <p class="card-text">Private Key is required for account actions</p>
                    <b-input id="pkey" placeholder="Private Key" v-model="key" class="mb-3" />
                    <b-form-select v-model="selectedAccount" :options="labels[0]" class="mb-5" />
                    <div v-for="(param, index) in options[0][selectedAccount].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
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
                <b-tab title="Blocks">
                    <b-form-select v-model="selectedBlocks" :options="labels[4]" class="mb-5" />
                    <div class="text-left" v-for="(param, index) in options[4][selectedBlocks].params" :key="index">
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
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[4][selectedBlocks].action(options[4][selectedBlocks].params)">Execute</b-button>
                </b-tab>
                <b-tab title="Other">
                    <b-form-select v-model="selectedOther" :options="labels[5]" class="mb-5" />
                    <div v-for="(param, index) in options[5][selectedOther].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary" v-on:click="options[5][selectedOther].action(options[5][selectedOther].params)">Execute</b-button>
                </b-tab>
            </b-tabs>
        </b-card>
    </b-container>
  </div>
</template>

<script>

import Vue from 'vue'
import Logos from '../vue-logos'
Vue.use(Logos, { url: 'http://52.215.106.54:55000', debug: true })

export default {
  name: 'workbench',
  components: {},
  data () {
    let $this = this
    const accountLabels = [
      { value: 0, text: 'Create a Send' },
      { value: 1, text: 'Change Representative' },
      { value: 2, text: 'Check balance in Reason' },
      { value: 3, text: 'Check balance in Logos' },
      { value: 4, text: 'Lookup total block count' },
      { value: 5, text: 'Pull account history' },
      { value: 6, text: 'Info' },
      { value: 7, text: 'Lookup Public Key' },
      { value: 8, text: 'Ledger' },
      { value: 9, text: 'Representative' },
      { value: 10, text: 'Weight' }
    ]
    const accountOptions = [
      {
        'action': function (params) {
          let nanoAmount = params[0].value
          let address = params[1].value
          $this.$Logos.account($this.key).send(nanoAmount, address).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'logosAmount',
            'label': `The amount of Logos you wish to send`,
            'required': true
          },
          {
            'name': 'address',
            'label': `The address of the account you wish to send to`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let representative = params[0].value
          $this.$Logos.account($this.key).change(representative).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `The address of the account you wish to set as your representative`,
            'required': true
          }
        ]
      },
      {
        'action': function () {
          console.log($this.key)
          $this.$Logos.account($this.key).reasonBalance().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).logosBalance().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).blockCount().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let count = params[0].value
          $this.$Logos.account($this.key).history(count).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'count',
            'label': `The number of blocks you want to fetch`,
            'required': false
          }
        ]
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).info().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).publicKey().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let count = params[0].value
          let details = params[1].value
          $this.$Logos.account($this.key).ledger(count, details).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'count',
            'label': `The number of blocks you want to fetch`,
            'required': false
          }
        ]
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).representative().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.$Logos.account($this.key).weight().then((val) => {
            console.log(val)
          })
        },
        'params': []
      }
    ]

    const accountsOptions = [
      {
        'action': function (params) {
          $this.$Logos.accounts.get(params[0].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'publicKey',
            'label': `Public Key`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          $this.$Logos.accounts.reasonBalance(params[0].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          $this.$Logos.accounts.logosBalance(params[0].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let tarAccounts = params[0].value.split(',')
          $this.$Logos.accounts.balances(tarAccounts).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'accounts',
            'label': `Account Ids Comma Seperated`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          $this.$Logos.accounts.history(params[0].value, params[1].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          },
          {
            'name': 'count',
            'label': `Number of blocks you wish to see`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          $this.$Logos.accounts.info(params[0].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          $this.$Logos.accounts.key(params[0].value).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let account = params[0].value
          let count = params[1].value
          let details = params[2].value
          $this.$Logos.accounts.ledger(account, count, details).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          },
          {
            'name': 'count',
            'label': `Number of blocks to retrieve`,
            'required': false
          },
          {
            'name': 'details',
            'type': 'boolean',
            'label': `Show full block details`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let account = params[0].value
          $this.$Logos.accounts.representative(account).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let account = params[0].value
          $this.$Logos.accounts.weight(account).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'account',
            'label': `Account Id`,
            'required': true
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
      { value: 6, text: 'Get public key from account name' },
      { value: 7, text: 'Get ledger information of an account' },
      { value: 8, text: 'Get Representative of an account' },
      { value: 9, text: 'Get Voting weight of an account' }
    ]

    const keyOptions = [
      {
        'action': function (params) {
          $this.$Logos.key.create().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let privateKey = params[0].value
          $this.$Logos.key.expand(privateKey).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'privateKey',
            'label': `Private Key`,
            'required': true
          }
        ]
      }
    ]
    const keyLabels = [
      { value: 0, text: 'Create a new key' },
      { value: 1, text: 'Derive public key and account number from private key' }
    ]

    const workOptions = [
      {
        'action': function (params) {
          let hash = params[0].value
          $this.$Logos.work.generate(hash).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the block you are requesting work for`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let work = params[0].value
          let hash = params[1].value
          $this.$Logos.work.validate(work, hash).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'work',
            'label': `The work you want to be validated`,
            'required': true
          },
          {
            'name': 'hash',
            'label': `Hash of the block you are checking the work for`,
            'required': true
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
        'action': function (params) {
          let hash = params[0].value
          $this.$Logos.blocks.account(hash).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the block you want to know who published`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let type = params[0].value
          $this.$Logos.blocks.count(type).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'type': `boolean`,
            'label': `Split block count by block type`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let hash = params[0].value
          let count = params[1].value
          $this.$Logos.blocks.chain(hash, count).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the block you want to know the predecessors to`,
            'required': true
          },
          {
            'name': 'count',
            'label': `Number of predecessors to retrieve`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let hash = params[0].value
          let count = params[1].value
          $this.$Logos.blocks.history(hash, count).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the block you want to know the successors to`,
            'required': true
          },
          {
            'name': 'count',
            'label': `Number of successors to retrieve`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let hash = params[0].value.split(',')
          $this.$Logos.blocks.info(hash).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Comma seperated Hashes of the blocks you want to know about`,
            'required': true
          },
          {
            'name': 'details',
            'type': 'boolean',
            'label': `Show full block details`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let block = params[0].value
          $this.$Logos.blocks.createSend(block).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'sendBlock',
            'label': `JSON representation of the send block`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let block = params[0].value
          $this.$Logos.blocks.createChange(block).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'changeBlock',
            'label': `JSON representation of the change block`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let block = params[0].value
          $this.$Logos.blocks.publish(block).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'block',
            'label': `JSON representation of the block you want broadcasted`,
            'required': true
          }
        ]
      }
    ]
    const blockLabels = [
      { value: 0, text: 'Lookup account by block' },
      { value: 1, text: 'Get number of blocks' },
      { value: 2, text: 'Retrieve chain up to block' },
      { value: 3, text: 'Retrieve chain after a block' },
      { value: 4, text: 'Block Info' },
      { value: 5, text: 'Create Send' },
      { value: 6, text: 'Create Change' },
      { value: 7, text: 'Publish Block' }
    ]

    const otherOptions = [
      {
        'action': function () {
          $this.$Logos.available().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.$Logos.representatives().then((val) => {
            console.log(val)
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let seed = params[0].value
          let index = params[1].value
          $this.$Logos.deterministicKey(seed, index).then((val) => {
            console.log(val)
          })
        },
        'params': [
          {
            'name': 'seed',
            'label': `The seed you wish to derive from`,
            'required': true
          },
          {
            'name': 'index',
            'label': `index of the key`,
            'required': false
          }
        ]
      }
    ]
    const otherLabels = [
      { value: 0, text: 'Total Available Supply' },
      { value: 1, text: 'Representative List' },
      { value: 2, text: 'Deterministic Key' }
    ]

    const options = [
      accountOptions,
      accountsOptions,
      keyOptions,
      workOptions,
      blockOptions,
      otherOptions
    ]

    const labels = [
      accountLabels,
      accountsLabels,
      keyLabels,
      workLabels,
      blockLabels,
      otherLabels
    ]

    return {
      key: null,
      options: options,
      labels: labels,
      selectedAccount: 0,
      selectedAccounts: 0,
      selectedKeys: 0,
      selectedWork: 0,
      selectedBlocks: 0,
      selectedOther: 0
    }
  }
}
</script>

<style scoped lang="scss">
    .nav-link {
        color:#6b7c93;
    }
</style>
