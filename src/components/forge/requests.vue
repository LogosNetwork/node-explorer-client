<template>
  <div>
    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.send>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-success d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faPaperPlane" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Send Logos
              </b-card-title>
              <b-card-subtitle>
                Send logos to another account.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!send" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="send" id="send" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">
            <b-form @submit="createSend">
              <b-form-group
                id="sendFrom"
                label="From"
                label-for="fromSelector"
              >
                <v-select
                  id="fromSelector"
                  v-model="sendForm.from"
                  required
                  placeholder="Origin"
                ></v-select>
              </b-form-group>

              <b-form-group id="sendTo"
                label="To"
                label-for="toSelector"
              >
                <v-select
                  taggable
                  push-tags
                  id="toSelector"
                  v-model="sendForm.to"
                  required
                  placeholder="Destination"
                ></v-select>
              </b-form-group>

              <b-form-group
                id="sendAmount"
                label="Amount"
                label-for="amountInput"
                :description="sendForm.amountDescription"
              >
                <b-form-input
                  id="amountInput"
                  v-model="sendForm.amount"
                  required
                  placeholder="Amount of Logos"
                ></b-form-input>
              </b-form-group>
              <div class="text-right">
                <b-button type="submit" variant="primary">Create Send</b-button>
              </div>
            </b-form>
          </div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenSend>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-primary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faCoins" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Send Tokens
              </b-card-title>
              <b-card-subtitle>
                Send tokens to another account.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenSend" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenSend" id="tokenSend" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenIssuance>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-info d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faPlus" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Issue a Token
              </b-card-title>
              <b-card-subtitle>
                Create and issue your token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenIssuance" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenIssuance" id="tokenIssuance" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenAdditional>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-secondary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faMagic" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Issue Additional Tokens
              </b-card-title>
              <b-card-subtitle>
                Increases the total supply of a token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenAdditional" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenAdditional" id="tokenAdditional" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenSetting>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-warning d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faExchange" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Change Token Setting
              </b-card-title>
              <b-card-subtitle>
                Change the settings of the given token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenSetting" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenSetting" id="tokenSetting" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenImmuteSetting>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-danger d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faLockAlt" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Immute Token Setting
              </b-card-title>
              <b-card-subtitle>
                Permanently immute a setting of the given token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenImmuteSetting" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenImmuteSetting" id="tokenImmuteSetting" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenRevoke>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-success d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faMask" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Revoke Token from User
              </b-card-title>
              <b-card-subtitle>
                Remove tokens from a one account and send them to another.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenRevoke" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenRevoke" id="tokenRevoke" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenUser>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-primary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faUserEdit" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Adjust User Token Setting
              </b-card-title>
              <b-card-subtitle>
                Freeze, Un-Freeze, Whitelist, or Blacklist a user.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenUser" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenUser" id="tokenUser" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenFee>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-info d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faPercentage" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Adjust Token Fee
              </b-card-title>
              <b-card-subtitle>
                Change the token fee for the given token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenFee" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenFee" id="tokenFee" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenInfo>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-secondary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faEdit" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Update Token Info
              </b-card-title>
              <b-card-subtitle>
                Change the token information of the given token.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenInfo" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenInfo" id="tokenInfo" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenBurn>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-warning d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faFire" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Burn Tokens
              </b-card-title>
              <b-card-subtitle>
                Remove some tokens from the total supply.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenBurn" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenBurn" id="tokenBurn" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenDistribute>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-danger d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faArrowDown" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Distribute Tokens
              </b-card-title>
              <b-card-subtitle>
                Send tokens from the token account to a user's account.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenDistribute" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenDistribute" id="tokenDistribute" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenWithdrawFee>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-success d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faHandReceiving" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Withdraw Fee
              </b-card-title>
              <b-card-subtitle>
                Withdraw the token balance to a user's account.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenWithdrawFee" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenWithdrawFee" id="tokenWithdrawFee" accordion="accordion" role="tabpanel">
        <b-card-body class="collapsedForm">
          <div class="mt-3">Hello World</div>
        </b-card-body>
      </b-collapse>
    </b-card>

    <b-card no-body class="shadow-sm mb-3">
      <b-button class="w-100 text-left p-0" variant="link">
        <b-card-body v-b-toggle.tokenWithdrawLogos>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder text-white rounded bg-primary d-flex align-items-center justify-content-center">
                <font-awesome-icon size="2x" :icon="faLambda" />
              </div>
            </b-col>
            <b-col>
              <b-card-title>
                Withdraw Logos
              </b-card-title>
              <b-card-subtitle>
                Withdraw the Logos balance of the token account to a user's account.
              </b-card-subtitle>
            </b-col>
            <b-col cols="auto">
              <div class="iconHolder text-muted rounded d-flex align-items-center justify-content-center">
                <font-awesome-icon v-if="!tokenWithdrawLogos" size="lg" :icon="faChevronDown" />
                <font-awesome-icon v-else size="lg" :icon="faChevronUp" />
              </div>
            </b-col>
          </b-row>
        </b-card-body>
      </b-button>
      <b-collapse v-model="tokenWithdrawLogos" id="tokenWithdrawLogos" accordion="accordion" role="tabpanel">
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
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import vSelect from 'vue-select'
import { faLambda, faCoins, faPlus, faMagic, faExchange, faLockAlt, faMask, faUserEdit, faPaperPlane, faEdit, faFire, faArrowDown, faHandReceiving, faPercentage, faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Lookups',
  data () {
    return {
      sendForm: {
        from: '',
        to: '',
        amount: '',
        amountDescription: ''
      },
      send: false,
      tokenSend: false,
      tokenIssuance: false,
      tokenAdditional: false,
      tokenSetting: false,
      tokenImmuteSetting: false,
      tokenRevoke: false,
      tokenUser: false,
      tokenFee: false,
      tokenInfo: false,
      tokenBurn: false,
      tokenDistribute: false,
      tokenWithdrawFee: false,
      tokenWithdrawLogos: false,
      faLambda,
      faCoins,
      faPlus,
      faMagic,
      faExchange,
      faLockAlt,
      faMask,
      faUserEdit,
      faPaperPlane,
      faEdit,
      faFire,
      faArrowDown,
      faHandReceiving,
      faPercentage,
      faChevronDown,
      faChevronUp
    }
  },
  components: {
    bCardBody,
    bCardTitle,
    bCardSubtitle,
    bFormGroup,
    bFormInput,
    bCollapse,
    vSelect
  },
  methods: {
    createSend () {
      console.log('hello')
    }
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
