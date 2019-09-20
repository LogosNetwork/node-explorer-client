<template>
  <div>
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
        <codepad :readOnly="false" :forge="true"/>
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
import { mapState, mapActions } from 'vuex'
import { BFormGroup, BFormInput, BFormInvalidFeedback, BFormCheckbox } from 'bootstrap-vue'
import cloneDeep from 'lodash.clonedeep'
import bigInt from 'big-integer'
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
export default {
  name: 'updateIssuerInfoForm',
  props: {
    tokenAccount: Object
  },
  data () {
    return {
      advancedInput: false,
      decimals: 0,
      website: '',
      image: '',
      issuerInfo: ''
    }
  },
  components: {
    'codepad': () => import(/* webpackChunkName: "Codepad" */'@/components/codepad.vue'),
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormCheckbox
  },
  computed: {
    ...mapState('forge', {
      updatedIssuerInfo: state => state.tempInfo
    }),
    validDecimal: function () {
      if (this.decimals === '' || this.decimals === null) return null
      return /^([0-9]+)$/.test(this.decimals)
    },
    validImage: function () {
      if (this.image === '' || this.image === null) return null
      return urlRegex.test(this.image)
    },
    validURL: function () {
      if (this.website === '' || this.website === null) return null
      return urlRegex.test(this.website)
    },
    validIssuerInfo: function () {
      return this.$utils.byteCount(this.updatedIssuerInfo) <= 512
    },
    decimalDescription: function () {
      if (this.validDecimal && this.tokenAccount) {
        return `With the decimial set to ${this.decimals} the total supply will be ${this.$Logos.convert.fromTo(this.tokenAccount.totalSupply, 0, this.decimals)} ${this.tokenAccount.symbol}`
      } else if (this.tokenAccount) {
        return `With no decimial set the total supply will be ${this.tokenAccount.totalSupply} ${this.tokenAccount.symbol}`
      } else {
        return `Select a token first`
      }
    },
    sufficientBalance: function () {
      if (!this.tokenAccount) return null
      return bigInt(this.tokenAccount.balance).greaterOrEquals(bigInt(this.$utils.minimumFee))
    },
    updateableControllers: function () {
      let controllers = []
      for (let controller of this.tokenAccount.controllers) {
        if (this.$wallet.accounts[controller.account] && controller.privileges.update_issuer_info) {
          controllers.push(this.$wallet.accounts[controller.account])
        }
      }
      return controllers
    }
  },
  methods: {
    updateIssuerInfo () {
      if (this.updateableControllers.length > 0) {
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
        this.updateableControllers[0].createUpdateIssuerInfoRequest({
          tokenAccount: this.tokenAccount.address,
          issuerInfo: issuerInfo
        })
      }
    },
    ...mapActions('forge',
      [
        'setIssuerInfo'
      ]
    ),
    nameWithAddress ({ name, address }) {
      return `${name} — ${address.substring(0, 9)}...${address.substring(59, 64)}`
    }
  },
  created: function () {
    let issuerInfo = null
    try {
      issuerInfo = JSON.parse(this.tokenAccount.issuerInfo)
    } catch (e) {
      issuerInfo = null
    }
    if (issuerInfo) {
      if (typeof issuerInfo.decimals !== 'undefined') {
        this.decimals = cloneDeep(issuerInfo.decimals)
      }
      if (typeof issuerInfo.website !== 'undefined') {
        this.website = cloneDeep(issuerInfo.website)
      }
      if (typeof issuerInfo.image !== 'undefined') {
        this.image = cloneDeep(issuerInfo.image)
      }
    }
    if (this.tokenAccount.issuerInfo) {
      this.setIssuerInfo(this.tokenAccount.issuerInfo)
    } else {
      this.setIssuerInfo('')
    }
  }
}
</script>
