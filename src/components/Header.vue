<template>
  <div>
    <div id="title-bar" v-if="isElectron">
      <div id="title-bar-btns">
        <div id="min-btn" @click="minimize()"></div>
        <div id="max-btn" @click="maximizeResize()"></div>
        <div id="close-btn" @click="close()"></div>
      </div>
    </div>
    <div id="header">
      <div id="title">GnuCash Importer</div>
      <div id="configSelection" @click="showConfigModal()">
        <span>Database:</span>
        <span>{{databaseName}}</span>
      </div>
      <ConfigModal :configData="configData" v-on:saveConfig="saveConfigHandler"></ConfigModal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ConfigModal from './modals/ConfigModal.vue'
import {
  ElectronApi,
  ElectronWindow,
  isElectron
} from '@/communication/electronSwitch'
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
  private isElectron = false

  data() {
    return {
      configData: this.configData,
      databaseName: this.databaseName
    }
  }

  async beforeMount() {
    await this.getConfig()
    this.isElectron = isElectron
  }

  close() {
    ElectronWindow.close()
  }

  minimize() {
    ElectronWindow.minimize()
  }

  maximizeResize() {
    ElectronWindow.maximizeResize()
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

<style lang="scss" scoped>
#header {
  overflow: hidden;
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

#title-bar {
  -webkit-app-region: drag;
  height: 24px;
  background-color: grey;
}

#title-bar-btns {
  -webkit-app-region: no-drag;
  height: 24px;
  float: right;
}

#title-bar-btns div {
  display: inline-block;
  cursor: pointer;
  width: 13px;
  margin: 5px 3px;
  border-radius: 5px;
  border: 1px solid lightgray;
  height: 13px;
}

#min-btn {
  background-color: rgba(255, 190, 68, 0.5);
  &:hover {
    background-color: rgba(255, 190, 68, 1);
  }
}

#max-btn {
  background-color: rgba(0, 202, 78, 0.5);
  &:hover {
    background-color: rgba(0, 202, 78, 1);
  }
}

#close-btn {
  background-color: rgba(255, 96, 92, 0.5);
  &:hover {
    background-color: rgba(255, 96, 92, 1);
  }
}
</style>
