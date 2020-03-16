<template>
  <div>
    Account Name: <input type="text" v-model="vuename">
    Account Owner: <input type="text" v-model="vueowner">
    <button @click="addAccount()">Add Account</button>
    <div><h2>Current Accounts:</h2></div>
    <table style="width:100%">
      <tr>
        <th>Name</th>
        <th>Owner</th>
      </tr>
      <tr v-for="i in accountList" :key=i.name>
        <td>{{ i.name }}</td>
        <td>{{ i.owner }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '@/communication/electronSwitch'
import { GoldCashAccount } from '../../models/goldCash/goldCashAccount'

@Component
export default class Accounts extends Vue {
  private accountList: string[] = []
  private newAccount!: GoldCashAccount

  async beforeMount() {
    this.accountList = await this.listAccounts()
  }

  private addAccount() {
    const newAccount = { guid: '', name: 'test5', owner: 'test5' }
    ElectronApi.send('add-account', newAccount)
    ElectronApi.on(
      'add-account-reply',
      (event, result: string[]) => {
        ElectronApi.removeAllListeners('add-account-reply')
      }
    )
    this.listAccounts() // should reload the list of accounts with the new one added
  }

  private listAccounts() {
    return new Promise<string[]>(resolve => {
      ElectronApi.send('get-accounts')
      ElectronApi.on(
        'get-accounts-reply',
        (event, result: string[]) => {
          ElectronApi.removeAllListeners('get-accounts-reply')
          resolve(result)
        }
      )
    }).then(accountsResp => {
      return accountsResp
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';
</style>
