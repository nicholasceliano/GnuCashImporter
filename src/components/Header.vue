<template>
  <div>
    <div id="title-bar" v-if="isElectron">
      <div id="title-bar-btns">
        <div class="window-btn min-btn" @click="minimize()"></div>
        <div class="window-btn max-btn" @click="maximizeResize()"></div>
        <div class="window-btn close-btn" @click="close()"></div>
      </div>
    </div>
    <div id="header">
      <img src="@/assets/logo.png" alt />
      <div id="title">
        <b>GnuCash</b> Importer
      </div>
      <div id="configSelection" @click="showConfigModal()">
        <font-awesome-icon icon="cog" class="fa-btn" />
        <div>
          <span>
            <b>Database:</b>
          </span>
          <span>{{databaseName}}</span>
        </div>
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
@import '@/global.scss';

#header {
  overflow: hidden;
  width: 100%;
  height: 55px;
  border-bottom: 1px solid $line;
  background-color: $lightgreen;

  img {
    float: left;
    height: 100%;
  }

  #configSelection {
    height: calc(100% - 6px);
    float: right;
    margin: 3px;

    svg {
      display: block;
      margin: auto;
      padding-bottom: 3px;
      width: 22px;
      height: 22px;
    }

    span {
      text-align: center;
      display: block;
      font-size: 11px;
      line-height: 11px;
    }
  }

  #title {
    font-size: 25px;
    line-height: 35px;
    height: calc(100% - 20px);
    float: left;
    margin: 10px;
  }
}

#title-bar {
  -webkit-app-region: drag;
  height: 24px;
  background-color: $darkgray;
}

#title-bar-btns {
  -webkit-app-region: no-drag;
  height: 24px;
  float: right;
}

#title-bar-btns .window-button {
  display: inline-block;
}
</style>
