<template>
  <div>
    <b-row class="mb-3">
      <b-col cols="12">
        <h4>Lookup Information</h4>
      </b-col>
    </b-row>
    <accordion
      bgClass="bg-info"
      accordionGroup="lookupAccordion"
      :slotMinHeight="197"
      :requestIcon="faInfo"
      title="Account & Token Info"
      subtitle="Lookup the logos balance, token balances, and frontier of an account."
    >
      <accountLookup/>
    </accordion>

    <accordion
      bgClass="bg-warning"
      accordionGroup="lookupAccordion"
      :slotMinHeight="313"
      :requestIcon="faHistory"
      title="Account & Token History"
      subtitle="History of all requests sent to or from the account."
    >
      <historyLookup/>
    </accordion>

    <accordion
      bgClass="bg-primary"
      accordionGroup="lookupAccordion"
      :slotMinHeight="197"
      :requestIcon="faCube"
      title="Block & Request Info"
      subtitle="Info on a Request, Request Block, Micro Epoch, or Epoch with a given hash."
    >
      <block/>
    </accordion>

    <accordion
      bgClass="bg-danger"
      accordionGroup="lookupAccordion"
      :requestIcon="faExpandArrows"
      title="Expand a Private Key"
      subtitle="Derive the account name and public key from a private key."
    >
      <expandKey/>
    </accordion>

    <accordion
      bgClass="bg-info"
      accordionGroup="lookupAccordion"
      :requestIcon="faKey"
      title="Convert a Key"
      subtitle="Convert public keys to account names, and vice versa."
    >
      <convertKey/>
    </accordion>

    <accordion
      bgClass="bg-warning"
      accordionGroup="lookupAccordion"
      :requestIcon="faTools"
      title="Generate Work"
      subtitle="Creates the work with a given hash."
    >
      <generateWork/>
    </accordion>

    <accordion
      bgClass="bg-primary"
      accordionGroup="lookupAccordion"
      :slotMinHeight="265"
      :requestIcon="faEquals"
      title="Validate Work"
      subtitle="Validates if the given work is valid for the given hash."
    >
      <validateWork/>
    </accordion>
  </div>
</template>

<script>
import { faInfo, faHistory, faCube, faKey, faExpandArrows, faTools, faEquals } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Lookups',
  data () {
    return {
      faInfo,
      faHistory,
      faCube,
      faKey,
      faTools,
      faEquals,
      faExpandArrows
    }
  },
  components: {
    'accordion': () => import(/* webpackChunkName: "accordion" */'@/components/forge/accordion.vue'),
    'expandKey': () => import(/* webpackChunkName: "expandKeyForm" */'@/components/forge/lookupForms/expandKey.vue'),
    'convertKey': () => import(/* webpackChunkName: "convertKeyForm" */'@/components/forge/lookupForms/convertKey.vue'),
    'block': () => import(/* webpackChunkName: "blockForm" */'@/components/forge/lookupForms/block.vue'),
    'accountLookup': () => import(/* webpackChunkName: "accountLookupForm" */'@/components/forge/lookupForms/account.vue'),
    'historyLookup': () => import(/* webpackChunkName: "historyLookupForm" */'@/components/forge/lookupForms/history.vue'),
    'generateWork': () => import(/* webpackChunkName: "generateWorkForm" */'@/components/forge/lookupForms/generateWork.vue'),
    'validateWork': () => import(/* webpackChunkName: "validateWorkForm" */'@/components/forge/lookupForms/validateWork.vue')
  }
}
</script>
