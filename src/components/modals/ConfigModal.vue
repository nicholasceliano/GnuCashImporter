<template>
  <modal name="configModal" @before-open="beforeOpen" @closed="closed" width="300" height="auto">
    <div id="databaseModal">
      <div id="header">
        <div class="title">Configuration</div>
        <div class="window-btn close-btn" @click="$modal.hide(modelName)"></div>
      </div>
      <div id="body" v-if="configData">
        <div>
          <div class="section-title">GnuCash Database</div>
          <div class="input-item">
            <div class="label">Host:</div>
            <input type="text" v-model="configData.GnuCashDbConn.Host" />
          </div>
          <div class="input-item">
            <div class="label">Database:</div>
            <input type="text" v-model="configData.GnuCashDbConn.Database" />
          </div>
          <div class="input-item">
            <div class="label">User:</div>
            <input type="text" v-model="configData.GnuCashDbConn.User" />
          </div>
          <div class="input-item">
            <div class="label">Password:</div>
            <input type="password" v-model="configData.GnuCashDbConn.Password" />
          </div>
        </div>
        <div>
          <div class="section-title">GnuCash Defaults</div>
          <div class="input-item">
            <div class="label">Currency:</div>
            <select v-model="configData.GnuCashDefaults.CurrencyGUID">
              <option v-for="c in currencies" :value="c.guid" :key="c.guid">{{c.fullname}}</option>
            </select>
          </div>
        </div>
        <div>
          <div class="section-title">AlphaVantage</div>
          <div class="input-item">
            <div class="label">API Key</div>
            <input type="text" v-model="configData.AlphaVantageApiKey" />
          </div>
        </div>
      </div>
      <div id="footer">
        <font-awesome-icon icon="save" class="fa-btn" title="Save" @click="saveConfigClick" />
        <font-awesome-icon
          icon="sync"
          class="fa-btn sync"
          title="Refresh"
          @click="syncConfigClick"
        />
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ConfigurationData } from '@/models/ConfigurationData'
import { GnuCashCurrency } from '../../models/GnuCashCurrency'
import { ElectronApi } from '@/communication/electronSwitch'

@Component
export default class ConfigModal extends Vue {
  @Prop() configData!: ConfigurationData
  public modelName = 'configModal'
  private currencies: GnuCashCurrency[] = []
  private originalData!: ConfigurationData
  private saved = false

  private async beforeMount() {
    await this.getCurrencies()
  }

  private beforeOpen() {
    this.saved = false
    this.originalData = JSON.parse(JSON.stringify(this.configData))
  }

  private closed() {
    if (!this.saved) {
      this.configData.GnuCashDbConn.Host = this.originalData.GnuCashDbConn.Host
      this.configData.GnuCashDbConn.Database = this.originalData.GnuCashDbConn.Database
      this.configData.GnuCashDbConn.User = this.originalData.GnuCashDbConn.User
      this.configData.GnuCashDbConn.Password = this.originalData.GnuCashDbConn.Password
      this.configData.AlphaVantageApiKey = this.originalData.AlphaVantageApiKey
    }
  }

  private saveConfigClick() {
    this.saveConfig().then(() => {
      this.$modal.hide(this.modelName)
    })
  }

  private saveConfig() {
    return new Promise<void>(resolve => {
      ElectronApi.send('save-config', this.configData)
      ElectronApi.on('save-config-reply', (event, configData) => {
        ElectronApi.removeAllListeners('save-config-reply')
        this.$emit('configSaved', configData)
        this.saved = true

        resolve()
      })
    })
  }

  private syncConfigClick() {
    this.saveConfig().then(() => {
      this.getCurrencies()
    })
  }

  private getCurrencies() {
    return new Promise<GnuCashCurrency[]>(resolve => {
      ElectronApi.send('get-currencies')
      ElectronApi.on('get-currencies-reply', (event, result) => {
        ElectronApi.removeAllListeners('get-currencies-reply')

        resolve(result)
      })
    }).then(currencies => {
      this.currencies = currencies
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';

#databaseModal {
  background-color: $lightgreen;
}
#header {
  height: 15px;
  padding: 10px;

  .title {
    float: left;
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
  }

  .close-btn {
    float: right;
    border-color: $darkgray;
    margin: 0;
  }
}

#body {
  height: calc(85% - 42px - 20px);
  padding: 10px;
  font-size: 12px;

  .section-title {
    font-size: 14px;
  }

  .input-item {
    margin: auto;
    width: 200px;

    .label {
      width: 70px;
      display: inline-block;
    }

    select {
      width: 120px;
    }

    input {
      width: 120px;
      border: 0;
      border-bottom: 1px solid $darkgray;
      background-image: none;
      background-color: transparent;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
    }
  }
}

#footer {
  height: 22px;
  padding: 10px;

  .fa-btn {
    float: right;
    height: 22px;
    width: 22px;
    padding-left: 7px;
  }

  .sync {
    height: 15px;
    width: 15px;
    color: $blue-refresh;
    padding-top: 3px;
  }
}
</style>
