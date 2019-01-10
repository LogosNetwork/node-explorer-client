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
              </tr>
            </thead>
            <tbody name="list" is="transition-group">
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
