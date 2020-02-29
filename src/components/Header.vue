<template>
  <div id="header">
    <div id="title">GnuCash Importer</div>
    <div id="configSelection" @click="showConfigModal()">
      <span>Database:</span>
      <span>{{databaseName}}</span>
    </div>
    <ConfigModal :configData="configData" v-on:saveConfig="saveConfigHandler"></ConfigModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ConfigModal from './modals/ConfigModal.vue'
import { ElectronApi } from '@/communication/commSwitch'
import { ConfigurationData } from '@/models/ConfigurationData'

@Component({
  components: {
    ConfigModal
  }
})
export default class Header extends Vue {
  private configModal = 'configModal'
  private configData!: ConfigurationData
  private databaseName!: string

  data() {
    return {
      configData: this.configData,
      databaseName: this.databaseName
    }
  }

  async beforeMount() {
    await this.getConfig()
  }

  saveConfigHandler(configData: ConfigurationData) {
    this.configData = configData
    this.saveConfig()
    this.setDatabaseName()
  }

  private showConfigModal() {
    this.$modal.show(this.configModal)
  }

  private getConfig() {
    return new Promise<ConfigurationData>(resolve => {
      ElectronApi.send('get-config')
      ElectronApi.on('get-config-reply', (event, result) => resolve(result))
    }).then(configData => {
      this.configData = configData
      this.setDatabaseName()
    })
  }

  private saveConfig() {
    ElectronApi.send('save-config', this.configData)
  }

  private setDatabaseName() {
    this.databaseName =
      this.configData.GnuCashDbConn &&
      this.configData.GnuCashDbConn.Host.length > 0 &&
      this.configData.GnuCashDbConn.Database.length > 0
        ? `${this.configData.GnuCashDbConn.Database}(${this.configData.GnuCashDbConn.Host})`
        : 'None'
  }
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
#configSelection {
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
