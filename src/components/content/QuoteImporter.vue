<template>
  <div class="container">
    <h1>QuoteImporter</h1>
    <button @click="getQuotes()">Get Quotes</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '../../communication/electronSwitch'

@Component
export default class QuoteImporter extends Vue {
  getQuotes() {
    ElectronApi.send('get-quotes')
  }
}
</script>

<style lang="scss" scoped></style>
