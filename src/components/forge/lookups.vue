<template>
  <div>
    <accordion
      bgClass="bg-info"
      accordionGroup="lookupAccordion"
      :requestIcon="faInfo"
      title="Account & Token Info"
      subtitle="Lookup the logos balance, token balances, and frontier of an account."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-warning"
      accordionGroup="lookupAccordion"
      :requestIcon="faFastBackward"
      title="Account & Token History"
      subtitle="History of all requests sent to or from the account."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-primary"
      accordionGroup="lookupAccordion"
      :requestIcon="faCube"
      title="Block & Request Information"
      subtitle="Info on a Request, Request Block, Micro Epoch, or Epoch with a given hash."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-danger"
      accordionGroup="lookupAccordion"
      :requestIcon="faExpandArrows"
      title="Expand a Private Key"
      subtitle="Derive the account name and public key from a private key."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-info"
      accordionGroup="lookupAccordion"
      :requestIcon="faKey"
      title="Convert a Key"
      subtitle="Convert public keys to account names, and vice versa."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-warning"
      accordionGroup="lookupAccordion"
      :requestIcon="faTools"
      title="Generate Work"
      subtitle="Creates the work with a given hash."
    >
      Hello World
    </accordion>

    <accordion
      bgClass="bg-primary"
      accordionGroup="lookupAccordion"
      :requestIcon="faEquals"
      title="Validate Work"
      subtitle="Validates if the given work is valid for the given hash."
    >
      Hello World
    </accordion>
  </div>
</template>

<script>
import { faInfo, faFastBackward, faCube, faKey, faExpandArrows, faTools, faEquals } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'Lookups',
  data () {
    return {
      faInfo,
      faFastBackward,
      faCube,
      faKey,
      faTools,
      faEquals,
      faExpandArrows
    }
  },
  components: {
    'accordion': () => import(/* webpackChunkName: "accordion" */'@/components/forge/accordion.vue')
  }
}
</script>
