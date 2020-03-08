<template>
  <div class="container">
    <div>FileImporter</div>
    <FileUpload
      uploadFieldName="fileImporterUpload"
      acceptedFiles=".csv"
      ref="fileUpload"
      @filesChanged="filesChanged"
    ></FileUpload>
    <div v-if="uploadedFiles.length > 0" class="fileDesc">
      <div class="descType bold">Import Type</div>
      <div class="descType bold">Import Account</div>
      <div class="descName bold">File Name</div>
      <div class="descClose bold"></div>
      <div></div>
    </div>
    <div v-for="f in uploadedFiles" :key="f.FilePath">
      <div class="fileDesc">
        <div title="Import Type" class="descType">
          <select name="importTypeList" v-model="f.ImportType" @change="clearTransactions(f)">
            <option value>Select Import Type...</option>
            <option v-for="o in fileImportOptions" v-bind:key="o.Id" :value="o.Id">{{o.Name}}</option>
          </select>
        </div>
        <div title="Import Account" class="descType">
          <select name="importAccountList" v-model="f.ImportAccount" @change="clearTransactions(f)">
            <option value>Select Import Account...</option>
            <option v-for="a in importAccounts" v-bind:key="a.guid" :value="a.guid">{{a.name}}</option>
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
              <th v-if="checkForStockTransaction(f.Transactions)" class="tblSymbol">Symbol</th>
              <th v-if="checkForStockTransaction(f.Transactions)" class="tblPrice">Price</th>
              <th v-if="checkForStockTransaction(f.Transactions)" class="tblQuantity">Quantity</th>
              <th class="tblDate">Date</th>
              <th class="tblReconcileAccount">Reconcile Account</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in f.Transactions" :key="t.name">
              <td v-bind:title="t.Description">{{t.Description}}</td>
              <td v-bind:title="t.Amount.toDollars()">{{t.Amount.toDollars()}}</td>
              <td
                v-if="checkForStockTransaction(f.Transactions)"
                v-bind:title="t.StockData.Symbol"
              >{{t.StockData.Symbol}}</td>
              <td
                v-if="checkForStockTransaction(f.Transactions)"
                v-bind:title="t.StockData.PriceString"
              >{{t.StockData.PriceString}}</td>
              <td
                v-if="checkForStockTransaction(f.Transactions)"
                v-bind:title="t.StockData.Quantity"
              >{{t.StockData.Quantity}}</td>
              <td
                v-bind:title="t.PostDate.toMySqlDateTimeString()"
              >{{t.PostDate.toMySqlDateTimeString()}}</td>
              <td>
                <select v-model="t.ReconcileAccountGuid">
                  <option
                    v-for="a in t.IsStock ? stockReconcileAccounts : reconcileAccounts"
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
import { GnuCashTransaction } from '../../models/gnuCash/GnuCashTransaction'

@Component({
  components: {
    FileUpload
  }
})
export default class FileImporter extends Vue {
  private uploadedFiles: GnuCashImportFile[] = []
  private fileUploadComponent!: FileUpload
  private reconcileAccounts!: GnuCashAccount[]
  private stockReconcileAccounts!: GnuCashAccount[]
  private importAccounts!: GnuCashAccount[]
  private fileImportOptions: SelectOption[] = []

  async beforeMount() {
    await this.getData<GnuCashAccount[]>(
      'reconcile-accounts',
      r => (this.reconcileAccounts = r)
    )
    await this.getData<GnuCashAccount[]>(
      'stock-reconcile-accounts',
      r => (this.stockReconcileAccounts = r)
    )
    await this.getData<SelectOption[]>(
      'file-import-options',
      r => (this.fileImportOptions = r)
    )
    await this.getData<GnuCashAccount[]>(
      'import-accounts',
      r => (this.importAccounts = r)
    )
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
          ImportType: '',
          ImportAccount: '',
          Transactions: []
        } as GnuCashImportFile)
      }
    })
  }

  private removeFile(filePath: string) {
    this.uploadedFiles = this.uploadedFiles.filter(x => x.FilePath !== filePath)
    this.fileUploadComponent.removeFile(filePath)
  }

  private clearTransactions(f: GnuCashImportFile) {
    f.Transactions = []
  }

  private parseFiles() {
    this.uploadedFiles.forEach(f => {
      if (f.ImportType && f.ImportAccount && f.Transactions.length === 0) {
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
      } else {
        f.Transactions = []
      }
    })
  }

  private importFiles() {
    this.uploadedFiles.forEach((f, i) => {
      if (f.Transactions.length > 0) {
        ElectronApi.send('import-files', f)
        ElectronApi.on('import-files-reply', () => {
          ElectronApi.removeAllListeners('import-files-reply')
          // TODO: Need to rework this with Import result
          this.uploadedFiles.splice(i, 1)
          this.fileUploadComponent.reset()
        })
      }
    })
  }

  private fileAlreadyUploaded(f: File) {
    return this.uploadedFiles.filter(x => x.FilePath === f.path).length > 0
  }

  private getData<T>(apiCall: string, promiseResp: (asd: T) => T) {
    return new Promise<T>(resolve => {
      ElectronApi.send(`get-${apiCall}`)
      ElectronApi.on(`get-${apiCall}-reply`, (event, result) => {
        ElectronApi.removeAllListeners(`get-${apiCall}-reply`)

        resolve(result)
      })
    }).then(reconcileAccounts => {
      promiseResp(reconcileAccounts)
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

  private checkForStockTransaction(t: GnuCashTransaction[]) {
    return t.filter(t => t.IsStock).length > 0
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
  line-height: 20px;

  div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
  }
  .descType {
    width: 20%;
    padding-right: 4px;
    select {
      width: 100%;
    }
  }
  .descName {
    width: calc(60% - 23px);
    padding-right: 4px;
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
    min-width: 20%;
    max-width: 45%;
  }
  .tblAmount,
  .tblSymbol,
  .tblPrice,
  .tblQuantity {
    width: 10%;
  }
  .tblDate {
    width: 20%;
  }
  .tblReconcileAccount {
    width: 20%;
  }
}
</style>
