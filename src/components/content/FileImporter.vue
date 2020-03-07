<template>
  <div class="container">
    <div>FileImporter</div>
    <FileUpload
      uploadFieldName="fileImporterUpload"
      acceptedFiles=".csv"
      ref="fileUpload"
      @filesChanged="filesChanged"
    ></FileUpload>
    <div v-for="f in uploadedFiles" :key="f.FilePath">
      <div class="fileDesc">
        <div title="Import Type" class="descType">
          <select
            name="importTypeList"
            v-model="f.ImportType"
            v-bind:disabled="f.Transactions.length > 0"
          >
            <option value="undefined">Select Import Type...</option>
            <option v-for="o in fileImportOptions" v-bind:key="o.Id" :value=o.Id>{{o.Name}}</option>
          </select>
        </div>
        <div v-bind:title="f.FileName" class="descName">{{f.FileName}}</div>
        <div title="Remove" class="descClose">
          <font-awesome-icon icon="times" @click="removeFile(f.FilePath)" />
        </div>
      </div>
      <div class="tableContainer">
        <table class="transTable" v-if="f.Transactions.length > 0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th class="tblDescription">Description</th>
              <th class="tblAmount">Amount</th>
              <th class="tblDate">Date</th>
              <th class="tblReconcileAccount">Reconcile Account</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in f.Transactions" :key="t.name">
              <td v-bind:title="t.Description">{{t.Description}}</td>
              <td v-bind:title="t.Amount.toDollars()">{{t.Amount.toDollars()}}</td>
              <td
                v-bind:title="t.PostDate.toMySqlDateTimeString()"
              >{{t.PostDate.toMySqlDateTimeString()}}</td>
              <td>
                <select v-model="t.ReconcileAccountGuid">
                  <option
                    v-for="a in reconcileAccounts"
                    :value="a.guid"
                    :key="a.guid"
                    v-bind:class="getAccClass(a.account_type)"
                  >{{ a.name }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
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
import { GnuCashImportFile } from '@/models/gnuCash/GnuCashImportFile'
import { GnuCashAccount } from '@/models/gnuCash/GnuCashAccount'
import { SelectOption } from '../../models/utility/SelectOption'

@Component({
  components: {
    FileUpload
  }
})
export default class FileImporter extends Vue {
  private uploadedFiles: GnuCashImportFile[] = []
  private fileUploadComponent!: FileUpload
  private reconcileAccounts!: GnuCashAccount[]
  private fileImportOptions: SelectOption[] = []

  async beforeMount() {
    await this.getReconcileAccounts()
    await this.getFileImportOptions()
  }

  mounted() {
    this.fileUploadComponent = this.$refs.fileUpload as FileUpload
  }

  private filesChanged(files: File[]) {
    files.forEach(f => {
      if (!this.fileAlreadyUploaded(f)) {
        this.uploadedFiles.push({
          FilePath: f.path,
          FileName: f.name,
          Transactions: []
        } as GnuCashImportFile)
      }
    })
  }

  private removeFile(filePath: string) {
    this.uploadedFiles = this.uploadedFiles.filter(x => x.FilePath !== filePath)
    this.fileUploadComponent.removeFile(filePath)
  }

  private parseFiles() {
    this.uploadedFiles.forEach(f => {
      if (f.ImportType && f.Transactions.length === 0) {
        new Promise<GnuCashImportFile>(resolve => {
          ElectronApi.send('parse-files', f)
          ElectronApi.on(
            'parse-files-reply',
            (event, result: GnuCashImportFile) => {
              ElectronApi.removeAllListeners('parse-files-reply')

              resolve(result)
            }
          )
        }).then(fileResp => {
          if (f.FilePath === fileResp.FilePath) {
            f.Transactions = fileResp.Transactions
          }
        })
      }
    })
  }

  private importFiles() {
    this.uploadedFiles.forEach(f => {
      if (f.Transactions.length > 0) {
        ElectronApi.send('import-files', f)
        ElectronApi.on('import-files-reply', () => {
          ElectronApi.removeAllListeners('import-files-reply')

          // TODO: Need to rework this with Import result
          // const fileUploadComponent = this.$refs.fileUpload as FileUpload
          // fileUploadComponent.reset()
        })
      }
    })
  }

  private fileAlreadyUploaded(f: File) {
    return this.uploadedFiles.filter(x => x.FilePath === f.path).length > 0
  }

  private getReconcileAccounts() {
    return new Promise<GnuCashAccount[]>(resolve => {
      ElectronApi.send('get-reconcile-accounts')
      ElectronApi.on('get-reconcile-accounts-reply', (event, result) => {
        ElectronApi.removeAllListeners('get-reconcile-accounts-reply')

        resolve(result)
      })
    }).then(reconcileAccounts => {
      this.reconcileAccounts = reconcileAccounts.sort((a, b) =>
        a.name > b.name ? 1 : -1
      )
    })
  }

  private getFileImportOptions() {
    return new Promise<SelectOption[]>(resolve => {
      ElectronApi.send('get-file-import-options')
      ElectronApi.on('get-file-import-options-reply', (event, result) => {
        ElectronApi.removeAllListeners('get-file-import-options-reply')

        resolve(result)
      })
    }).then(fileImportOptions => {
      this.fileImportOptions = fileImportOptions.sort((a, b) =>
        a.Name > b.Name ? 1 : -1
      )
    })
  }

  private getAccClass(accountType: string) {
    switch (accountType) {
      case 'EXPENSE':
        return 'negAcc'
      case 'INCOME':
        return 'posAcc'
      default:
        return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';

.container {
  width: 100%;
}

.fileDesc {
  width: calc(100% - 10px);
  padding-right: 10px;

  div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
  }
  .descType {
    width: 20%;
    select {
      width: 100%;
    }
  }
  .descName {
    width: calc(80% - 19px);
    padding-right: 4px;
    padding-left: 4px;
  }
  .descClose {
    width: 11px;
    cursor: pointer;
    color: $close-red;
  }
}

.tableContainer {
  width: calc(100% - 10px);
  padding-right: 10px;
}

.transTable {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

  td,
  th {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
  }
  select {
    width: 100%;

    .posAcc {
      color: $max-green;
    }
    .negAcc {
      color: $close-red;
    }
  }
  .tblDescription {
    width: 45%;
  }
  .tblAmount {
    width: 15%;
  }
  .tblDate {
    width: 25%;
  }
  .tblReconcileAccount {
    width: 20%;
  }
}
</style>
