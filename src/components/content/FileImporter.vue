<template>
  <div>
    <h1>FileImporter</h1>
    <button @click="importFiles()">Import Files</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'

@Component
export default class FileImporter extends Vue {
  importFiles() {
    ipcRenderer.send('import-files')
  }
}
</script>

<style scoped>
</style>
