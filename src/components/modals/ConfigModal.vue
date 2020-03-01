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
          <div class="section-title">AlphaVantage</div>
          <div class="input-item">
            <div class="label">API Key</div>
            <input type="text" v-model="configData.AlphaVantageApiKey" />
          </div>
        </div>
      </div>
      <div id="footer">
        <font-awesome-icon icon="save" class="fa-btn" @click="saveConfig" />
      </div>
    </div>
  </modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ConfigurationData } from '@/models/ConfigurationData'

@Component
export default class DatabaseModal extends Vue {
  public modelName = 'configModal'
  @Prop() configData!: ConfigurationData
  private originalData!: ConfigurationData
  private saved = false

  beforeOpen() {
    this.saved = false
    this.originalData = JSON.parse(JSON.stringify(this.configData))
  }

  closed() {
    if (!this.saved) {
      this.configData.GnuCashDbConn.Host = this.originalData.GnuCashDbConn.Host
      this.configData.GnuCashDbConn.Database = this.originalData.GnuCashDbConn.Database
      this.configData.GnuCashDbConn.User = this.originalData.GnuCashDbConn.User
      this.configData.GnuCashDbConn.Password = this.originalData.GnuCashDbConn.Password
      this.configData.AlphaVantageApiKey = this.originalData.AlphaVantageApiKey
    }
  }

  saveConfig() {
    this.configData.GnuCashDbConn.Host = this.configData.GnuCashDbConn.Host.trim()
    this.configData.GnuCashDbConn.Database = this.configData.GnuCashDbConn.Database.trim()
    this.configData.GnuCashDbConn.User = this.configData.GnuCashDbConn.User.trim()
    this.configData.GnuCashDbConn.Password = this.configData.GnuCashDbConn.Password.trim()
    this.configData.AlphaVantageApiKey = this.configData.AlphaVantageApiKey.trim()

    this.$emit('saveConfig', this.configData)
    this.$modal.hide(this.modelName)
    this.saved = true
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
  }
}
</style>
