<template>
  <div id="primary">
    <b-container class="pt-5">
        <h5 class="text-left" v-t="'build_api_cta'"></h5>
        <b-card no-body>
            <b-tabs pills card vertical>
                <b-tab title="My Account" active>
                    <p class="card-text">Private Key is required for account actions</p>
                    <b-input id="pkey" placeholder="Private Key" v-model="key" class="mb-3" />
                    <b-form-select v-model="accSelected" :options="accountLabels" class="mb-3" />
                </b-tab>
                <b-tab title="Accounts">
                    <br>Account Actions
                </b-tab>
                <b-tab title="Keys">
                    <br>Key Actions
                </b-tab>
                <b-tab title="Work">
                    <br>Work Actions
                </b-tab>
                <b-tab title="Blocks">
                    <br>Block Actions
                </b-tab>
                <b-tab title="Other">
                    <br>Other Actions
                </b-tab>
            </b-tabs>
        </b-card>
    </b-container>
  </div>
</template>

<script>
const accountLabels = [
  'Open an Account',
  'Create a Send',
  'Change Representative',
  'Check balance in Reason',
  'Check balance in Logos',
  'Lookup total block count',
  'Pull account history',
  'Info',
  'Lookup Public Key',
  'Ledger',
  'Pending Blocks',
  'Representative',
  'Weight'
]
const accountActions = [
  {
    'label': 'Open an Account',
    'action': 'account_open',
    'params': [
      {
        'name': 'representative',
        'type': 'string',
        'required': false
      },
      {
        'name': 'hash',
        'type': 'string',
        'required': false
      }
    ]
  },
  {
    'label': 'Create a Send',
    'action': 'account_send',
    'params': [
      {
        'name': 'logosAmount',
        'type': 'string',
        'required': true
      },
      {
        'name': 'address',
        'type': 'string',
        'required': true
      }
    ]
  }
]

export default {
  name: 'workbench',
  components: {},
  data () {
    return {
      key: null,
      accountOptions: accountActions,
      accountLabels: accountLabels,
      accSelected: 'Open an Account'
    }
  }
}
</script>

<style scoped lang="scss">
    .nav-link {
        color:#6b7c93;
    }
</style>
