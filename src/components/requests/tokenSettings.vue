<template>
  <span>
    <span v-for="setting in Object.keys(token.settings)" :key="'set'+setting">
      <!-- Issuance -->
      <span class="setting mr-2" v-if="setting === 'issuance' && !token.settings['modify_issuance']" v-b-tooltip.hover :title="`${token.name} allows controllers to issue more ${token.symbol}. This is a permanent setting and cannot be disabled.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMagic" />
          <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'issuance' && token.settings['modify_issuance']" v-b-tooltip.hover :title="`${token.name} allows controllers to issue more ${token.symbol}. This can be disabled by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMagic" />
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'modify_issuance' && !token.settings['issuance']" v-b-tooltip.hover :title="`${token.name} does not allow controllers to issue more ${token.symbol}. This can be changed by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMagic" :style="{ opacity: '0.5' }"/>
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
      <!-- Revoke -->
      <span class="setting mr-2" v-if="setting === 'revoke' && !token.settings['modify_revoke']" v-b-tooltip.hover :title="`${token.name} allows controllers to revoke ${token.symbol} from token holder's accounts. This is a permanent setting and cannot be disabled.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMask" />
          <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-18 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'revoke' && token.settings['modify_revoke']" v-b-tooltip.hover :title="`${token.name} allows controllers to revoke ${token.symbol} from token holder's accounts. This can be disabled by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMask" />
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-18 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'modify_revoke' && !token.settings['revoke']" v-b-tooltip.hover :title="`${token.name} does not allow controllers to revoke ${token.symbol} from token holder's accounts. This can be changed by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faMask" :style="{ opacity: '0.5' }"/>
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-18 down-2" />
        </font-awesome-layers>
      </span>
      <!-- Freeze -->
      <span class="setting mr-2" v-if="setting === 'freeze' && !token.settings['modify_freeze']" v-b-tooltip.hover :title="`${token.name} allows controllers to freeze the funds in a ${token.symbol} accounts. This is a permanent setting and cannot be disabled.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faSnowflake" />
          <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'freeze' && token.settings['modify_freeze']" v-b-tooltip.hover :title="`${token.name} allows controllers to freeze the funds in a ${token.symbol} accounts. This can be disabled by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faSnowflake" />
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'modify_freeze' && !token.settings['freeze']" v-b-tooltip.hover :title="`${token.name} does not allow controllers to freeze the funds in a ${token.symbol} from accounts. This can be changed by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faSnowflake" :style="{ opacity: '0.5' }"/>
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <!-- Adjust Fee -->
      <span class="setting mr-2" v-if="setting === 'adjust_fee' && !token.settings['modify_adjust_fee']" v-b-tooltip.hover :title="`${token.name} allows controllers to adjust the fee of ${token.symbol}. This is a permanent setting and cannot be disabled.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faCoins" />
          <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'adjust_fee' && token.settings['modify_adjust_fee']" v-b-tooltip.hover :title="`${token.name} allows controllers to adjust the fee of ${token.symbol}. This can be disabled by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faCoins" />
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'modify_adjust_fee' && !token.settings['adjust_fee']" v-b-tooltip.hover :title="`${token.name} does not allow controllers to adjust the fee of ${token.symbol}. This can be changed by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faCoins" :style="{ opacity: '0.5' }"/>
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
        </font-awesome-layers>
      </span>
      <!-- Whitelist -->
      <span class="setting mr-2" v-if="setting === 'whitelist' && !token.settings['modify_whitelist']" v-b-tooltip.hover :title="`${token.name} requires accounts to be whitelisted prior to using the ${token.symbol} token. This is a permanent setting and cannot be disabled.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faListAlt" />
          <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'whitelist' && token.settings['modify_whitelist']" v-b-tooltip.hover :title="`${token.name} requires accounts to be whitelisted prior to using the ${token.symbol} token. This can be disabled by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faListAlt" />
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
      <span class="setting mr-2" v-if="setting === 'modify_whitelist' && !token.settings['whitelist']" v-b-tooltip.hover :title="`${token.name} does not require accounts to be whitelisted prior to using the ${token.symbol} token. This can be changed by a ${token.name} controller.`">
        <font-awesome-layers class="fa-lg mr-4">
          <font-awesome-icon :icon="faListAlt" :style="{ opacity: '0.5' }"/>
          <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
        </font-awesome-layers>
      </span>
    </span>
  </span>
</template>

<script>
import { faCoins, faMagic, faSnowflake, faMask, faListAlt, faLockOpenAlt, faLockAlt } from '@fortawesome/pro-light-svg-icons'
export default {
  name: 'tokenSettings',
  data () {
    return {
      faCoins,
      faMagic,
      faSnowflake,
      faMask,
      faListAlt,
      faLockOpenAlt,
      faLockAlt
    }
  },
  props: {
    token: Object
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .setting {
    display: inline-block;
  }
</style>
