<template>
  <div>
    <button @click="addAccount()">Add Account</button>
    <div v-for="i in accountList" :key="i">{{i}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '@/communication/electronSwitch'

@Component
export default class Accounts extends Vue {
  private accountList: string[] = []

  async beforeMount() {
    this.accountList = await this.listAccounts()
  }

  private addAccount() {
    console.log('Adding account')
    ElectronApi.send('add-account')
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
      console.log(accountsResp)
      return accountsResp
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/global.scss';
</style>
