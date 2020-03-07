<template>
  <div class="container">
    <h1>QuoteImporter</h1>
    <button @click="getQuotes()">Get Quotes</button>
    <div>
      <div
        v-for="r in quoteImportResps"
        :key="r.Msg"
        v-bind:class="r.Success ? 'success' : 'fail'"
      >{{r.Msg}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '../../communication/electronSwitch'
import { AVQuoteImportResponse } from '@/models/AVQuoteImportResponse'

@Component
export default class QuoteImporter extends Vue {
  private quoteImportResps: AVQuoteImportResponse[] = []

  getQuotes() {
    ElectronApi.send('get-quotes')

    ElectronApi.on('quote-import-response', (event, msg) => {
      this.quoteImportResps.unshift(msg)
    })

    ElectronApi.on('get-quotes-reply', () => {
      ElectronApi.removeAllListeners('get-quotes-reply')
      ElectronApi.removeAllListeners('quote-import-response')
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';

.container {
  width: 100%;
}

.fail {
  color: $close-red;
}

.success {
  color: $max-green;
}
</style>
