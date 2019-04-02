<template>
  <div>
    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-success d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faPlus" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Create an Account
              </b-card-title>
              <b-card-subtitle>
                Create an account automatically or with a given private key.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-info d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faInfo" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Account & Token Info
              </b-card-title>
              <b-card-subtitle>
                Lookup the logos balance, token balances, and frontier of an account.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-warning d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faFastBackward" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Account & Token History
              </b-card-title>
              <b-card-subtitle>
                History of all requests sent to or from the account.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-primary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faCube" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Block Information
              </b-card-title>
              <b-card-subtitle>
                Info on a Request, Request Block, Micro Epoch, or Epoch with a given hash.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-danger d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faExpandArrows" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Expand a Private Key
              </b-card-title>
              <b-card-subtitle>
                Derive the account name and public key from a private key.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-info d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faKey" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Convert a key
              </b-card-title>
              <b-card-subtitle>
                Convert public keys to account names, and vice versa.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-warning d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faTools" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Generate Work
              </b-card-title>
              <b-card-subtitle>
                Creates the work with a given hash.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-primary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faEquals" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Validate Work
              </b-card-title>
              <b-card-subtitle>
                Validates if the given work is valid for the given hash.
              </b-card-subtitle>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>
  </div>
</template>

<script>
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
import { faInfo, faFastBackward, faPlus, faCube, faCubes, faKey, faExpandArrows, faTools, faEquals } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Lookups',
  data () {
    return {
      faInfo,
      faFastBackward,
      faPlus,
      faCube,
      faCubes,
      faKey,
      faTools,
      faEquals,
      faExpandArrows
    }
  },
  components: {
    bCardBody,
    bCardTitle,
    bCardSubtitle
  }
}
</script>

<style scoped lang="scss">
  .iconHolder {
    width: 52px;
    height: 52px;
    color: #FFF;
  }
  .actionSelector > div > div > div > .btn-link:hover,
  .actionSelector > div > div > div > .btn-link:focus {
    text-decoration: none;
  }
  .btn-link > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: 0px;
  }
  .actionSelector > div > div > div > .btn-link:hover > .card {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2) !important;
  }
</style>
