<template>
<div id="primary">
    <b-container class="pt-5">
      <b-row class="text-left">
        <b-col cols="12" class="mb-5">
          <h5 class="text-left" v-t="'tokens'"></h5>
          <table class="table b-table table-bordered table-sm b-table-fixed" style="background:#FFF">
            <thead>
              <tr>
                <th aria-colindex="1">Token</th>
                <th aria-colindex="2">Issuer</th>
                <th aria-colindex="3">Total Supply</th>
              </tr>
            </thead>
            <tbody name="list">
              <tr>
                <td aria-colindex="1">
                  <div class="text-truncate">My Coin (COIN) <br/>This is a JSON description from the token issuer json data</div>
                </td>
                <td aria-colindex="2">
                  <div class="text-truncate">lgs_13duy35orkazz577x7ucwysu5ujwkr8qgu8beb91r1p14ema7j7n7syadbtx</div>
                </td>
                <td aria-colindex="3">
                  <div class="text-truncate">1,000,000 COIN</div>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'tokens',
  components: {}
}
</script>

<style scoped lang="scss">
</style>
