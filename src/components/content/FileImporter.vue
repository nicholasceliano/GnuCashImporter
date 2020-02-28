<template>
  <div>
    <h1>FileImporter</h1>
    <button @click="importFiles()">Import Files</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '../../communication/commSwitch'

@Component
export default class FileImporter extends Vue {
  importFiles() {
    ElectronApi.send('import-files')
  }
}
</script>

<style scoped>
</style>
