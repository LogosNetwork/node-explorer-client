<template>
  <div id="primary">
    <b-container class="pt-5">
        <h5 class="text-left" v-t="'build_api_cta'"></h5>
        <b-input placeholder="http://18.212.15.104:55000" v-model="nodeURL" class="mb-3" />
        <b-card no-body>
            <b-tabs pills card vertical>
                <b-tab title="My Account" active>
                    <p class="card-text text-left">Private Key is required for account actions</p>
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
        <h5 class="text-left mt-3" v-if='editor.length > 0' v-t="'workbench_output'"></h5>
        <codepad id='editor' class="text-left mb-3" v-if='editor.length > 0' :code='editor'/>
    </b-container>
  </div>
</template>

<script>

import Vue from 'vue'
import Logos from '../api/rpc'
import LogosWallet from '../api/wallet'
import codepad from '@/components/codepad.vue'
Vue.use(Logos, { url: 'http://18.212.15.104:55000', debug: true })
Vue.use(LogosWallet)

export default {
  name: 'workbench',
  components: {
    codepad
  },
  data () {
    let $this = this
    const accountLabels = [
      { value: 0, text: 'Create a Send' },
      { value: 1, text: 'Change Representative' },
      { value: 2, text: 'Check balance in Reason' },
      { value: 3, text: 'Check balance in Logos' },
      { value: 4, text: 'Lookup total transaction count' },
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
          $this.editor += `Sending ${nanoAmount} to ${address}....\n`
          $this.$Logos.account($this.key).send(nanoAmount, address).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          $this.editor += `Changing Represenative to ${representative}....\n`
          $this.$Logos.account($this.key).change(representative).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          $this.editor += `Checking my balance in reason....\n`
          $this.$Logos.account($this.key).reasonBalance().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.editor += `Checking my balance in logos....\n`
          $this.$Logos.account($this.key).logosBalance().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.editor += `Retreiving the sum of transactions in my account....\n`
          $this.$Logos.account($this.key).blockCount().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let count = params[0].value
          $this.editor += `Retreiving the last ${count} transactions in my account....\n`
          $this.$Logos.account($this.key).history(count).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'count',
            'label': `The number of transactions you want to fetch`,
            'required': false
          }
        ]
      },
      {
        'action': function () {
          $this.editor += `Retreiving the account info of my account....\n`
          $this.$Logos.account($this.key).info().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.editor += `Retreiving the public key for my account....\n`
          $this.$Logos.account($this.key).publicKey().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let count = params[0].value
          let details = params[1].value
          $this.editor += `Retreiving the ledger of my account up to ${count} transactions....\n`
          $this.$Logos.account($this.key).ledger(count, details).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'count',
            'label': `The number of transactions you want to fetch`,
            'required': false
          }
        ]
      },
      {
        'action': function () {
          $this.editor += `Retreiving the representative of my account....\n`
          $this.$Logos.account($this.key).representative().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.editor += `Retreiving the weight of my account....\n`
          $this.$Logos.account($this.key).weight().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      }
    ]

    const accountsOptions = [
      {
        'action': function (params) {
          let publicKey = params[0].value
          $this.editor += `Fetching the account id for ${publicKey}....\n`
          $this.$Logos.accounts.toAddress(publicKey).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Checking reason balance for account id ${accountId}....\n`
          $this.$Logos.accounts.reasonBalance(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Checking logos balance for account id ${accountId}....\n`
          $this.$Logos.accounts.logosBalance(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          $this.editor += `Checking balances for accounts ${tarAccounts}....\n`
          $this.$Logos.accounts.balances(tarAccounts).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          let count = params[1].value
          $this.editor += `Checking last ${count} transactions for account ${accountId}....\n`
          $this.$Logos.accounts.history(accountId, count).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
            'label': `Number of transactions you wish to see`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Getting info for account ${accountId}....\n`
          $this.$Logos.accounts.info(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Getting public key for account ${accountId}....\n`
          $this.$Logos.accounts.key(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          let count = params[1].value
          let details = params[2].value
          $this.editor += `Getting ledger for account ${accountId} for the last ${count} transactions....\n`
          $this.$Logos.accounts.ledger(accountId, count, details).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
            'label': `Number of transactions to retrieve`,
            'required': false
          },
          {
            'name': 'details',
            'type': 'boolean',
            'label': `Show full transaction details`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Getting representative for account ${accountId}....\n`
          $this.$Logos.accounts.representative(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          let accountId = params[0].value.replace('lgs_', 'xrb_')
          $this.editor += `Getting weight for account ${accountId}....\n`
          $this.$Logos.accounts.weight(accountId).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          $this.editor += `Creating a new keypair....\n`
          $this.$Logos.key.create().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let privateKey = params[0].value
          $this.editor += `Expanding the private key ${privateKey} into a keypair....\n`
          $this.$Logos.key.expand(privateKey).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
          $this.editor += `Generating work for ${hash}....\n`
          $this.$Logos.work.generate(hash).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the transaction you are requesting work for`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let work = params[0].value
          let hash = params[1].value
          $this.editor += `Validating the work ${work} for the hash ${hash}....\n`
          $this.$Logos.work.validate(work, hash).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
            'label': `Hash of the transaction you are checking the work for`,
            'required': true
          }
        ]
      }
    ]
    const workLabels = [
      { value: 0, text: 'Generate work' },
      { value: 1, text: 'Validate work' }
    ]

    const transactionOptions = [
      {
        'action': function (params) {
          let hash = params[0].value
          $this.editor += `Fetching account who published the transaction with the hash ${hash}....\n`
          $this.$Logos.blocks.account(hash).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the transaction you want to know who published`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let type = params[0].value
          $this.editor += `Fetching transaction counts....\n`
          $this.$Logos.blocks.count(type).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'type': `boolean`,
            'label': `Split transaction count by transaction type`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          let hash = params[0].value
          let count = params[1].value
          $this.editor += `Fetching ${count} predecessors to the transaciton ${hash}....\n`
          $this.$Logos.blocks.chain(hash, count).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the transaction you want to know the predecessors to`,
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
          $this.editor += `Fetching ${count} sucessors to the transaciton ${hash}....\n`
          $this.$Logos.blocks.history(hash, count).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Hash of the transaction you want to know the successors to`,
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
          let hash = params[0].value
          if (hash.indexOf(',') !== -1) {
            hash = hash.split(',')
          }
          let details = params[1].value
          $this.editor += `Fetching transacitons of ${hash}....\n`
          $this.$Logos.blocks.info(hash, details).then((val) => {
            $this.editor += JSON.stringify(JSON.parse(val), null, ' ') + '\n\n'
          })
        },
        'params': [
          {
            'name': 'hash',
            'label': `Comma seperated Hashes of the transactions you want to know about`,
            'required': true
          },
          {
            'name': 'details',
            'type': 'boolean',
            'label': `Show full transaction details`,
            'required': false
          }
        ]
      },
      {
        'action': function (params) {
          let wallet = new $this.$Wallet()
          let blk = new $this.$Block()
          let pk = params[0].value
          let accountId = params[1].value.replace('lgs_', 'xrb_')
          let amount = params[2].value
          let recipientAddress = params[3].value
          let lastHash = null
          $this.editor += `Retreiving the account info of my account....\n`
          $this.$Logos.accounts.info(accountId).then((val) => {
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
            blk.setSignature($this.$LogosFunctions.uint8_hex(wallet.sign(hash, uint8PK)))
            $this.editor += `Generating work for ${lastHash}....\n`
            $this.$Logos.work.generate(lastHash).then((val) => {
              $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
              blk.setWork(val.work)
              let transaction = blk.getJSONBlock()
              $this.editor += `Publishing a transaction \n ${JSON.stringify(transaction, null, ' ')} \n`
              $this.$Logos.blocks.publish(transaction).then((val) => {
                $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
              })
            })
          })
        },
        'params': [
          {
            'name': 'privateKey',
            'label': `Private Key used to sign the message`,
            'required': true
          },
          {
            'name': 'accountid',
            'label': `My Account id `,
            'required': true
          },
          {
            'name': 'amount',
            'label': `Transaction Amount you want to send in RAW`,
            'required': true
          },
          {
            'name': 'destination',
            'label': `Target Address`,
            'required': true
          }
        ]
      },
      {
        'action': function (params) {
          // TODO
        },
        'params': [
          {
            'name': 'hash',
            'label': `Comma seperated Hashes of the transactions you want to know about`,
            'required': true
          },
          {
            'name': 'details',
            'type': 'boolean',
            'label': `Show full transaction details`,
            'required': false
          }
        ]
      }
    ]
    /*
      | Field Name |Size| Description |
      | --- | -------------| ----------------- |
      | Version | 1 - Byte| Logos Core Protocol version|
      | Message Type| 1 - Byte| Type of message|
      | Account  | 32-Byte | Account address |
      | Sequence Number  | 4-Byte | Number of sends, increment only |
      | Previous | 32-Byte | Previous head block on account|
      | Number of transactions | 1-Byte | 1-8|
      | Target Address [0] | 32-Byte | Multipurpose Field, up to an array of 8 addresses; <br/>See Table below for additional clarification<br/>Must have the same number of elements as transaction amount |
      | Transaction Amount [0]   | 16-Byte | Amount to send, up to an array of 8 elements. 0 if *change rep* <br/>Must have the same number of elements as target address |
      | Signature | 64 - Byte | EdDSA signature |
      | Work      | 8-Byte  |Proof of Work Nonce |
      | Type      | Send or Change  | What is this transaction |
    */

    const transactionLabels = [
      { value: 0, text: 'Lookup account by transaction' },
      { value: 1, text: 'Get number of transactions' },
      { value: 2, text: 'Retrieve chain up to transaction' },
      { value: 3, text: 'Retrieve chain after a transaction' },
      { value: 4, text: 'Transaction Info' },
      { value: 5, text: 'Publish Send Transaction' },
      { value: 6, text: 'Publish Change Transaction' }
    ]

    const otherOptions = [
      {
        'action': function () {
          $this.editor += `Fetching total amount of Logos....\n`
          $this.$Logos.available().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function () {
          $this.editor += `Fetching top representatives....\n`
          $this.$Logos.representatives().then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
          })
        },
        'params': []
      },
      {
        'action': function (params) {
          let seed = params[0].value
          let index = params[1].value
          $this.editor += `Generating the ${index} index keypair to ${seed}....\n`

          $this.$Logos.deterministicKey(seed, index).then((val) => {
            $this.editor += JSON.stringify(val, null, ' ') + '\n\n'
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
      transactionOptions,
      otherOptions
    ]

    const labels = [
      accountLabels,
      accountsLabels,
      keyLabels,
      workLabels,
      transactionLabels,
      otherLabels
    ]

    return {
      key: null,
      options: options,
      editor: '',
      nodeURL: 'http://18.212.15.104:55000',
      labels: labels,
      selectedAccount: 0,
      selectedAccounts: 0,
      selectedKeys: 0,
      selectedWork: 0,
      selectedTransactions: 0,
      selectedOther: 0
    }
  },
  watch: {
    nodeURL: function (val) {
      this.$Logos.changeServer(val)
    }
  }
}
</script>

<style scoped lang="scss">
    .nav-link {
        color:#6b7c93;
    }
    #editor {
      max-height: 400px;
      overflow-y: scroll
    }
</style>
