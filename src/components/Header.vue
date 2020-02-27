<template>
  <div id="header">
    <div id="title">GnuCash Importer</div>
    <div id="dbSelection">
      <span>Database Connection:</span>
      <select name="dbConnection" id="dbConn"></select>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private msg!: string
}
</script>

<style scoped>
#header {
  display: inline-block;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid grey;
  padding-bottom: 15px;
}
#dbSelection {
  height: 100%;
  float: right;
}
#title {
  height: 100%;
  float: left;
  font-size: 40px;
  padding-left: 10px;
}
</style>
