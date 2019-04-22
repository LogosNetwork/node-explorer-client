<template>
  <span>
    <!-- Issuance -->
    <span class="setting mr-2" v-if="token.settings.includes('issuance') && !token.settings.includes('modify_issuance')" v-b-tooltip.hover :title="`${token.name} allows controllers to issue more ${token.symbol}. This is a permanent setting and cannot be disabled.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faMagic" />
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="token.settings.includes('issuance') && token.settings.includes('modify_issuance')" v-b-tooltip.hover :title="`${token.name} allows controllers to issue more ${token.symbol}. This can be disabled by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faMagic" />
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('issuance') && token.settings.includes('modify_issuance')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to issue more ${token.symbol}. This can be changed by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faMagic" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('issuance') && !token.settings.includes('modify_issuance')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to issue more ${token.symbol}. This is a permanent settings and cannot be changed.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faMagic" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <!-- Revoke -->
    <span class="setting mr-2" v-if="token.settings.includes('revoke') && !token.settings.includes('modify_revoke')" v-b-tooltip.hover :title="`${token.name} allows controllers to revoke ${token.symbol} from token holder's accounts. This is a permanent setting and cannot be disabled.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faMask" />
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-18 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="token.settings.includes('revoke') && token.settings.includes('modify_revoke')" v-b-tooltip.hover :title="`${token.name} allows controllers to revoke ${token.symbol} from token holder's accounts. This can be disabled by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faMask" />
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-18 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('revoke') && token.settings.includes('modify_revoke')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to revoke ${token.symbol} from token holder's accounts. This can be changed by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faMask" transform="shrink-8 left-2"/>
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-18 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('revoke') && !token.settings.includes('modify_revoke')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to revoke ${token.symbol} from token holder's accounts. This is a permanent settings and cannot be changed.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faMask" transform="shrink-8 left-2"/>
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-18 down-2" />
      </font-awesome-layers>
    </span>
    <!-- Freeze -->
    <span class="setting mr-2" v-if="token.settings.includes('freeze') && !token.settings.includes('modify_freeze')" v-b-tooltip.hover :title="`${token.name} allows controllers to freeze the funds in a ${token.symbol} accounts. This is a permanent setting and cannot be disabled.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faSnowflake" />
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="token.settings.includes('freeze') && token.settings.includes('modify_freeze')" v-b-tooltip.hover :title="`${token.name} allows controllers to freeze the funds in a ${token.symbol} accounts. This can be disabled by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faSnowflake" />
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('freeze') && token.settings.includes('modify_freeze')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to freeze the funds in a ${token.symbol} from accounts. This can be changed by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faSnowflake" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('freeze') && !token.settings.includes('modify_freeze')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to freeze the funds in a ${token.symbol} from accounts. This is a permanent settings and cannot be changed.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faSnowflake" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <!-- Adjust Fee -->
    <span class="setting mr-2" v-if="token.settings.includes('adjust_fee') && !token.settings.includes('modify_adjust_fee')" v-b-tooltip.hover :title="`${token.name} allows controllers to adjust the fee of ${token.symbol}. This is a permanent setting and cannot be disabled.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faPercentage" />
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="token.settings.includes('adjust_fee') && token.settings.includes('modify_adjust_fee')" v-b-tooltip.hover :title="`${token.name} allows controllers to adjust the fee of ${token.symbol}. This can be disabled by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faPercentage" />
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('adjust_fee') && token.settings.includes('modify_adjust_fee')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to adjust the fee of ${token.symbol}. This can be changed by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faPercentage" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('adjust_fee') && !token.settings.includes('modify_adjust_fee')" v-b-tooltip.hover :title="`${token.name} does not allow controllers to adjust the fee of ${token.symbol}. This is a permanent settings and cannot be changed.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faPercentage" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-14 down-2" />
      </font-awesome-layers>
    </span>
    <!-- Whitelist -->
    <span class="setting mr-2" v-if="token.settings.includes('whitelist') && !token.settings.includes('modify_whitelist')" v-b-tooltip.hover :title="`${token.name} requires accounts to be whitelisted prior to using the ${token.symbol} token. This is a permanent setting and cannot be disabled.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faListAlt" />
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="token.settings.includes('whitelist') && token.settings.includes('modify_whitelist')" v-b-tooltip.hover :title="`${token.name} requires accounts to be whitelisted prior to using the ${token.symbol} token. This can be disabled by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faListAlt" />
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('whitelist') && token.settings.includes('modify_whitelist')" v-b-tooltip.hover :title="`${token.name} does not require accounts to be whitelisted prior to using the ${token.symbol} token. This can be changed by a ${token.name} controller.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faListAlt" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockOpenAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
    <span class="setting mr-2" v-if="!token.settings.includes('whitelist') && !token.settings.includes('modify_whitelist')" v-b-tooltip.hover :title="`${token.name} does not require accounts to be whitelisted prior to using the ${token.symbol} token. This is a permanent settings and cannot be changed.`">
      <font-awesome-layers class="fa-lg mr-4">
        <font-awesome-icon :icon="faBan" class="text-danger"/>
        <font-awesome-icon :icon="faListAlt" transform="shrink-6"/>
        <font-awesome-icon :icon="faLockAlt" transform="shrink-6 right-15 down-2" />
      </font-awesome-layers>
    </span>
  </span>
</template>

<script>
import Vue from 'vue'
import { faPercentage, faMagic, faSnowflake, faMask, faListAlt, faLockOpenAlt, faLockAlt, faBan } from '@fortawesome/pro-light-svg-icons'
import vBTooltip from 'bootstrap-vue/es/directives/tooltip/tooltip'
Vue.directive('b-tooltip', vBTooltip)

export default {
  name: 'tokenSettings',
  data () {
    return {
      faPercentage,
      faMagic,
      faSnowflake,
      faMask,
      faListAlt,
      faLockOpenAlt,
      faLockAlt,
      faBan
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
