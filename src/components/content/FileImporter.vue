<template>
  <div class="container">
    <div>FileImporter</div>
    <FileUpload
      uploadFieldName="fileImporterUpload"
      acceptedFiles=".csv"
      @filesChanged="filesChanged"
    ></FileUpload>
    <div v-for="f in uploadedFiles" :key="f.Id">
      <div>{{f.FileName}}</div>
      <div>
        <select name="importTypeList" v-model="f.ImportType">
          <option>Select Import Type...</option>
          <option value="ALLY">Ally</option>
          <option value="TDAM">Td Ameritrade</option>
        </select>
      </div>
      <div v-for="t in f.Transactions" :key="t.name">
        <div>{{t.Description}}</div>
        <div>{{t.Amount}}</div>
        <div>{{t.PostDate}}</div>
        <div>
          Reconcile acc:
          <select></select>
        </div>
      </div>
    </div>
    <button @click="parseFiles()">Parse Files</button>
    <button @click="importFiles()">Import Files</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '@/communication/electronSwitch'
import FileUpload from '@/components/FileUpload.vue'
import { GnuCashImportFile } from '../../models/GnuCashImportFile'
import { GnuCashTransaction } from '../../models/GnuCashTransaction'

@Component({
  components: {
    FileUpload
  }
})
export default class FileImporter extends Vue {
  private uploadedFiles: GnuCashImportFile[] = []

  private filesChanged(uploadedFiles: File[]) {
    this.uploadedFiles = []

    uploadedFiles.forEach(f => {
      this.uploadedFiles.push({
        Id: '12',
        FilePath: f.path,
        FileName: f.name,
        Transactions: []
      } as GnuCashImportFile)
    })
  }

  private parseFiles() {
    this.uploadedFiles.forEach(f => {
      if (f.ImportType) {
        new Promise<GnuCashTransaction[]>(resolve => {
          ElectronApi.send('parse-files', f)
          ElectronApi.on(
            'parse-files-reply',
            (event, result: GnuCashTransaction[]) => resolve(result)
          )
        }).then(transactions => {
          f.Transactions = transactions
        })
      }
    })
  }

  private importFiles() {
    this.uploadedFiles.forEach(f => {
      if (f.Transactions.length > 0) {
        ElectronApi.send('import-files', f)
        ElectronApi.on('import-files-reply', () => this.uploadedFiles = [])
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
}
</style>
