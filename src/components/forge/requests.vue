<template>
  <div>
    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-success d-flex align-items-center justify-content-center">
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
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-secondary d-flex align-items-center justify-content-center">
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
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-success d-flex align-items-center justify-content-center">
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
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

      <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-secondary d-flex align-items-center justify-content-center">
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
          </b-row>
        </b-card-body>
      </b-card>
    </b-button>

    <b-button class="w-100" variant="link">
      <b-card no-body class="text-left shadow-sm">
        <b-card-body>
          <b-row>
            <b-col cols="auto">
              <div class="iconHolder rounded bg-success d-flex align-items-center justify-content-center">
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
import { faLambda, faCoins, faPlus, faMagic, faExchange, faLockAlt, faMask, faUserEdit, faPaperPlane, faEdit, faFire, faArrowDown, faHandReceiving, faPercentage } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Lookups',
  data () {
    return {
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
      faPercentage
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
