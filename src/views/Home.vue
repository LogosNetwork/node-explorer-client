<template>
  <div id="primary">
    <b-container class="pt-5">
      <font-awesome-icon size="3x" class="logosLogo align-middle mb-3" :icon="faLambda" />
      <h2>Logos Network</h2>
      <b-button
        class="mt-3"
        variant="outline-primary"
        href="/whitepaper.pdf"
      >
        Whitepaper
      </b-button>
      <b-button
        class="ml-3 mt-3"
        variant="outline-primary"
        href="https://github.com/logosNetwork"
        target="_blank"
      >
        Source Code
      </b-button>
      <b-button
        class="ml-3 mt-3"
        variant="outline-primary"
        href="https://github.com/LogosNetwork/logos-core/wiki"
        target="_blank"
      >
        Design Docs
      </b-button>
      <b-button
        class="ml-3 mt-3"
        variant="outline-primary"
        href="https://logosnetwork.atlassian.net/wiki/spaces/LOGOS/pages/274071553/Logos+-+Notes+to+future+developers"
        target="_blank"
      >
        Deployment Docs
      </b-button>
      <div class="text-left mt-5">
        <h2>Overview</h2>
        <p>Logos is a high performance scalable cryptocurrency designed for real time payments. Our novel consensus, Axios PBFT, provides decentralization, fast settlement times, high throughput, and transaction immuatability</p>
        <!-- <h3>Parallelization / Concurrency</h3>
        <p>
          In order to achieve this performance we focus on paralleizing our consensus so that multiple rounds of concensus can take place at the same time.
        </p>
        <h3>Send & Receive Chain</h3>
        <p>
          Every account in logos network has its own chains. This allows each account to be updated quickly and asynchronously independently to the rest of the network.
        </p>
        <h3>Logos Accounts</h3>
        <p>
          Logos accounts are the standard accounts on the Logos Network. See <a href="https://github.com/LogosNetwork/SDF/blob/master/design/original_g_drive/Design/Tokens/AccountChains.md" target="_blank">types of blocks associated to a logos account.</a>
        </p>
        <h3>Token Accounts</h3>
        <p>
          Token accounts are the ledger account of a token where all the history of transactions performed on the token are contained. See <a href="https://github.com/LogosNetwork/SDF/blob/master/design/original_g_drive/Design/Tokens/AccountChains.md" target="_blank">types of blocks associated to a token account.</a>
        </p>
        <h3>Confirmation Process & Governance</h3>
        <h4>Axios PBFT</h4>
        <h4>BLS</h4>
        <h4>Elections</h4>
        <h4>Staking</h4>
        <h4>Rewards</h4>
        <h4>Fees</h4>
        <h3>Epoch Blocks</h3>
        <h3>Micro Epoch Blocks</h3>
        <h3>Request Blocks</h3>
        <h3>Epoch transition</h3>
        <h3>Tx Acceptors and DDoS prevention</h3>
        <h3>P2P</h3>
        <h3>Bootstrapping</h3>
        <h3>Identity Management</h3>
        <h3>Automated Testing Infrastructure</h3> -->
      </div>
    </b-container>
  </div>
</template>

<script>
import { faLambda } from '@fortawesome/pro-light-svg-icons'

export default {
  name: 'home',
  data () {
    return {
      faLambda
    }
  }
}
</script>

<style scoped lang="scss">
.logosLogo {
  color: #4668da;
}
</style>
