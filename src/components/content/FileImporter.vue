<template>
  <div class="container">
    <div>FileImporter</div>
    <FileUpload uploadFieldName="fileImporterUpload" acceptedFiles=".csv"></FileUpload>
    <button @click="importFiles()">Import Files</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '@/communication/electronSwitch'
import FileUpload from '@/components/FileUpload.vue'

@Component({
  components: {
    FileUpload
  }
})
export default class FileImporter extends Vue {
  importFiles() {
    ElectronApi.send('import-files')
  }
}
</script>

<style lang="scss" scoped>
.container {
  width:100%;
}
</style>
