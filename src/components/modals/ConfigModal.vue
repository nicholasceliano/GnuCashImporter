<template>
  <modal name="configModal" @before-open="beforeOpen" @closed="closed" width="300" height="auto">
    <div id="header">
      <div class="title">Configuration</div>
      <div class="close-button" @click="$modal.hide(modelName)">❌</div>
    </div>
    <div id="body" v-if="configData">
      <div>
        <div>GnuCash Database</div>
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
        <div>AlphaVantage</div>
        <div class="input-item">
          <div class="label">API Key</div>
          <input type="text" v-model="configData.AlphaVantageApiKey" />
        </div>
      </div>
    </div>
    <div id="footer">
      <div class="button" @click="saveConfig">Save</div>
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
    this.originalData = Object.assign({}, this.configData)
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

<style scoped>
#databaseModal {
  padding: 10px;
}
#header {
  height: 15%;
  padding: 10px;
}
.title {
  display: inline-block;
  font-size: 20px;
}
.close-button {
  float: right;
  cursor: pointer;
}
#body {
  height: 70%;
  padding: 10px;
}
.label {
  width: 70px;
  display: inline-block;
}
.input-item {
  margin: auto;
  width: 200px;
}
input {
  width: 120px;
}
#footer {
  border-top: 1px solid lightgray;
  height: 15%;
  padding: 10px;
}
.button {
  text-align: right;
  cursor: pointer;
  font-weight: bold;
}
</style>
