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
                  <div class="text-truncate">Poop Coin (POOP) <br/>This is a JSON description from the token issuer json data</div>
                </td>
                <td aria-colindex="2">
                  <div class="text-truncate">lgs_123...456</div>
                </td>
                <td aria-colindex="3">
                  <div class="text-truncate">1,000,000 POOP</div>
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
