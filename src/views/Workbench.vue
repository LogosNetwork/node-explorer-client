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
                    <b-button class="float-right mb-3" variant="primary">Execute</b-button>
                </b-tab>
                <b-tab title="Accounts">

                </b-tab>
                <b-tab title="Keys">
                    <b-form-select v-model="selectedKeys" :options="labels[2]" class="mb-5" />
                    <div v-for="(param, index) in options[2][selectedKeys].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary">Execute</b-button>
                </b-tab>
                <b-tab title="Work">
                    <b-form-select v-model="selectedWork" :options="labels[3]" class="mb-5" />
                    <div v-for="(param, index) in options[3][selectedWork].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary">Execute</b-button>
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
                    <b-button class="float-right mb-3" variant="primary">Execute</b-button>
                </b-tab>
                <b-tab title="Other">
                    <b-form-select v-model="selectedOther" :options="labels[5]" class="mb-5" />
                    <div v-for="(param, index) in options[5][selectedOther].params" :key="index">
                        <p class="card-text text-left">{{param.label}}
                            <b-input :placeholder="param.name" v-model="param.value" class="mb-3" />
                        </p>
                    </div>
                    <b-button class="float-right mb-3" variant="primary">Execute</b-button>
                </b-tab>
            </b-tabs>
        </b-card>
    </b-container>
  </div>
</template>

<script>

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
    'action': 'account_send',
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
    'action': 'account_representative',
    'params': [
      {
        'name': 'account',
        'label': `The address of the account you wish to set as your representative`,
        'required': true
      }
    ]
  },
  {
    'action': 'check_reason',
    'params': []
  },
  {
    'action': 'check_logos',
    'params': []
  },
  {
    'action': 'account_block_count',
    'params': []
  },
  {
    'action': 'account_history',
    'params': [
      {
        'name': 'count',
        'label': `The number of blocks you want to fetch`,
        'required': false
      }
    ]
  },
  {
    'action': 'account_info',
    'params': []
  },
  {
    'action': 'account_key',
    'params': []
  },
  {
    'action': 'ledger',
    'params': [
      {
        'name': 'count',
        'label': `The number of blocks you want to fetch`,
        'required': false
      }
    ]
  },
  {
    'action': 'account_representative',
    'params': []
  },
  {
    'action': 'account_weight',
    'params': []
  }
]

const accountsOptions = []
const accountsLabels = []

const keyOptions = [
  {
    'action': 'key_create',
    'params': []
  },
  {
    'action': 'key_expand',
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
    'action': 'work_generate',
    'params': [
      {
        'name': 'hash',
        'label': `Hash of the block you are requesting work for`,
        'required': true
      }
    ]
  },
  {
    'action': 'work_validate',
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
    'action': 'block_account',
    'params': [
      {
        'name': 'hash',
        'label': `Hash of the block you want to know who published`,
        'required': true
      }
    ]
  },
  {
    'action': 'block_count_type',
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
    'action': 'chain',
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
    'action': 'successors',
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
    'action': 'blocks_info',
    'params': [
      {
        'name': 'hash',
        'label': `Hash of the block you want to know about`,
        'required': true
      }
    ]
  },
  {
    'action': 'block_create',
    'params': [
      {
        'name': 'sendBlock',
        'label': `JSON representation of the send block`,
        'required': true
      }
    ]
  },
  {
    'action': 'block_create',
    'params': [
      {
        'name': 'changeBlock',
        'label': `JSON representation of the change block`,
        'required': true
      }
    ]
  },
  {
    'action': 'process',
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
    'action': 'available_supply',
    'params': [
      {
        'name': 'hash',
        'label': `Hash of the block you are requesting work for`,
        'required': true
      }
    ]
  },
  {
    'action': 'representatives',
    'params': []
  },
  {
    'action': 'deterministic_key',
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

export default {
  name: 'workbench',
  components: {},
  data () {
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
