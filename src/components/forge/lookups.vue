<template>
  <div>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.info>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-info d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!info" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="info" id="info" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.history>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-warning d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!history" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="history" id="history" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.blockInfo>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-primary d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!blockInfo" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="blockInfo" id="blockInfo" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.expand>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-danger d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!expand" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="expand" id="expand" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.convert>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-info d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faKey" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Convert a Key
              </b-card-title>
              <b-card-subtitle>
                Convert public keys to account names, and vice versa.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!convert" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="convert" id="convert" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.generate>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-warning d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!generate" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="generate" id="generate" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.validate>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded text-white bg-primary d-flex align-items-center justify-content-center">
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
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!validate" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="validate" id="validate" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

  </div>
</template>

<script>
import bCardBody from 'bootstrap-vue/es/components/card/card-body'
import bCardTitle from 'bootstrap-vue/es/components/card/card-title'
import bCardSubtitle from 'bootstrap-vue/es/components/card/card-sub-title'
import bCollapse from 'bootstrap-vue/es/components/collapse/collapse'
import { faInfo, faFastBackward, faPlus, faCube, faCubes, faKey, faExpandArrows, faTools, faEquals, faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons'

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
      faExpandArrows,
      faChevronDown,
      faChevronUp,
      createAccount: false,
      info: false,
      history: false,
      blockInfo: false,
      expand: false,
      convert: false,
      generate: false,
      validate: false
    }
  },
  components: {
    bCardBody,
    bCardTitle,
    bCardSubtitle,
    bCollapse
  }
}
</script>

<style scoped lang="scss">
  .collapsedForm {
    border-top:1px solid rgba(0, 0, 0, 0.075);
    margin-left: 1.25rem;
    margin-right: 1.25rem;
    padding: 0;
    padding-bottom: 1.25rem;
  }
  .iconHolder {
    width: 52px;
    height: 52px;
  }
  .card > .btn-link:hover,
  .card > .btn-link:focus {
    text-decoration: none;
  }
  .actionSelector > div > div > div > .card {
    -webkit-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    border: 0px;
  }
  .actionSelector > div > div > div > .card:hover {
    box-shadow: 0 10px 30px -5px rgba(10,16,34,.2) !important;
  }
</style>
