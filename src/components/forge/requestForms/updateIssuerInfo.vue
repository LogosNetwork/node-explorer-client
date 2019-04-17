<template>
  <div>
    <b-form-group
      id="updateIssuerInfoToken"
      label="Select Token"
      label-size="lg"
    >
      <Multiselect
        id="tokenSelector"
        v-model="selectedToken"
        required
        track-by="tokenAccount"
        label="name"
        :custom-label="nameWithAddress"
        :options="updatableTokens"
        :disabled="updatableTokens.length <= 1"
        :multiple="false"
        placeholder="Search for a token"
      >
        <template slot="singleLabel" slot-scope="{ option }">
          <span v-if="option.name !== option.tokenAccount">
            <strong>{{ option.name }}</strong>  -
          </span>
          <LogosAddress :inactive="true" :force="true" :address="option.tokenAccount" />
        </template>
      </Multiselect>
      <div v-if="!selectedToken" style="display:block" class="invalid-feedback">
        You must select a token to update the info
      </div>
      <div v-if="selectedToken && !sufficientBalance" style="display:block" class="invalid-feedback">
        {{selectedToken.name}} has an insufficient supply of logos to afford the fee for this transaction
      </div>
    </b-form-group>

    <b-form-group id="advancedInputCheckboxGroup">
      <b-form-checkbox v-model="advancedInput">Advanced Custom Input</b-form-checkbox>
    </b-form-group>

    <div v-if="!advancedInput">
      <b-form-group
        id="tokenDecimals"
        label="Token Decimals"
        label-size="lg"
        :description="decimalDescription"
      >
        <b-form-input
          id="tokenDecimalsInput"
          v-model="decimals"
          autocomplete="off"
          aria-describedby="decimalError"
          :state="validDecimal"
          placeholder="Enter the decimal value of the display unit"
        ></b-form-input>
        <b-form-invalid-feedback id="decimalError">
          Optional, must be an integer value
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="tokenImage"
        label="Token Image"
        label-size="lg"
        :description="`Optionally provide a url to small 128x128 image to be your default icon`"
      >
        <b-form-input
          id="tokenImageInput"
          v-model="image"
          autocomplete="off"
          placeholder="Enter image url"
          aria-describedby="imageError"
          :state="validImage"
        ></b-form-input>
        <b-form-invalid-feedback id="imageError">
          Must be a valid URL
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="tokenWebsite"
        label="Token Website"
        label-size="lg"
        :description="`Optionally provide a website url to let people learn more about your token`"
      >
        <b-form-input
          id="websiteInput"
          v-model="website"
          autocomplete="off"
          placeholder="Enter Website URL"
          aria-describedby="urlError"
          :state="validURL"
        ></b-form-input>
        <b-form-invalid-feedback id="urlError">
          Must be a valid URL
        </b-form-invalid-feedback>
      </b-form-group>
    </div>

    <b-form-group v-if="advancedInput"
        id="tokenInfo"
        label="Custom Token Info"
        label-size="lg"
      >
        <codepad :code="issuerInfo"/>
        <div v-if="!validIssuerInfo" style="display:block" class="invalid-feedback">
          Issuer Info must be less than or equal to 512 byes
        </div>
    </b-form-group>

    <div class="text-right">
      <b-button
        v-on:click="updateIssuerInfo()"
        type="submit"
        :disabled="!sufficientBalance ||
          (!advancedInput && (validDecimal === false || validImage === false || validURL === false) ||
          (advancedInput && (!validIssuerInfo)))"
        variant="primary"
      >
          Update Token Info
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bFormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import bFormInput from 'bootstrap-vue/es/components/form-input/form-input'
import LogosAddress from '@/components/LogosAddress.vue'
import Multiselect from 'vue-multiselect'
import cloneDeep from 'lodash/cloneDeep'
import bigInt from 'big-integer'
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
export default {
  name: 'updateIssuerInfoForm',
  data () {
    return {
      selectedToken: null,
      advancedInput: false,
      decimals: 0,
      website: '',
      image: '',
      issuerInfo: ''
    }
  },
  components: {
    codepad: () => import('@/components/forge/forgeCodepad.vue'),
    bFormGroup,
    bFormInput,
    LogosAddress,
    Multiselect
  },
  computed: {
    ...mapState('forge', {
      updatedIssuerInfo: state => state.issuerInfo,
      forgeTokens: state => state.tokens,
      currentAccount: state => state.currentAccount
    }),
    validDecimal: function () {
      if (this.decimals === '') return null
      return /^([0-9]+)$/.test(this.decimals)
    },
    validImage: function () {
      if (this.image === '') return null
      return urlRegex.test(this.image)
    },
    validURL: function () {
      if (this.website === '') return null
      return urlRegex.test(this.website)
    },
    validIssuerInfo: function () {
      return this.$utils.byteCount(this.updatedIssuerInfo) <= 512
    },
    decimalDescription: function () {
      if (this.validDecimal && this.selectedToken) {
        return `With the decimial set to ${this.decimals} the total supply will be ${this.$Logos.convert.fromTo(this.selectedToken.total_supply, 0, this.decimals)} ${this.selectedToken.symbol}`
      } else if (this.selectedToken) {
        return `With no decimial set the total supply will be ${this.selectedToken.total_supply} ${this.tokenOptions.symbol}`
      } else {
        return `Select a token first`
      }
    },
    sufficientBalance: function () {
      if (!this.selectedToken) return null
      return bigInt(this.selectedToken.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    updatableTokens: function () {
      let tokens = []
      for (let tokenAddress in this.forgeTokens) {
        if (this.forgeTokens[tokenAddress].controllers instanceof Array) {
          for (let controller of this.forgeTokens[tokenAddress].controllers) {
            if (controller.account === this.currentAccount.address &&
              controller.privileges instanceof Array &&
              controller.privileges.indexOf('update_issuer_info') > -1) {
              tokens.push(this.forgeTokens[tokenAddress])
            }
          }
        }
      }
      return tokens
    }
  },
  methods: {
    updateIssuerInfo () {
      let issuerInfo = null
      if (this.advancedInput) {
        issuerInfo = this.updatedIssuerInfo
      } else {
        issuerInfo = JSON.stringify({
          image: this.image,
          website: this.website,
          decimals: this.decimals
        })
      }
      this.$wallet.account.createUpdateIssuerInfoRequest({
        tokenAccount: this.selectedToken.tokenAccount,
        issuerInfo: issuerInfo
      })
    },
    nameWithAddress ({ name, tokenAccount }) {
      return `${name} — ${tokenAccount.substring(0, 9)}...${tokenAccount.substring(59, 64)}`
    }
  },
  created: function () {
    if (this.updatableTokens.length > 0) {
      this.selectedToken = this.updatableTokens[0]
      // TODO this should be on selected token change
      if (this.selectedToken.issuerInfo) {
        if (typeof this.selectedToken.issuerInfo.decimals !== 'undefined') {
          this.decimals = cloneDeep(this.selectedToken.issuerInfo.decimals)
        }
        if (typeof this.selectedToken.issuerInfo.website !== 'undefined') {
          this.website = cloneDeep(this.selectedToken.issuerInfo.website)
        }
        if (typeof this.selectedToken.issuerInfo.image !== 'undefined') {
          this.image = cloneDeep(this.selectedToken.issuerInfo.image)
        }
      }
      if (this.selectedToken.issuer_info) {
        this.issuerInfo = cloneDeep(this.selectedToken.issuer_info)
      }
    }
  },
  watch: {
    updatableTokens: function (newDistTks, oldDistTks) {
      if (newDistTks.length > 0) {
        let valid = false
        for (let token of newDistTks) {
          if (this.selectedToken && token.tokenAccount === this.selectedToken.tokenAccount) {
            this.selectedToken = token
            valid = true
          }
        }
        if (valid === false) {
          this.selectedToken = newDistTks[0]
        }
      } else {
        this.selectedToken = null
      }
    }
  }
}
</script>
