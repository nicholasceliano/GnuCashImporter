<template>
  <div>
    <h1>DatabaseBackup</h1>
    <div>
      <div v-for="r in databaseBackupResps" :key="r">{{r}}</div>
      <button @click="backupDatabase()">Backup Database</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElectronApi } from '@/communication/electronSwitch'

@Component
export default class DatabaseBackup extends Vue {
  private databaseBackupResps: string[] = []

  private backupDatabase() {
    this.databaseBackupResps = []

    ElectronApi.send('database-backup')

    ElectronApi.on('database-dump-reply', (event, respMsg: string) => {
      this.databaseBackupResps.push(respMsg)
      ElectronApi.removeAllListeners('database-dump-reply')
    })

    ElectronApi.on('database-store-reply', (event, respMsg: string) => {
      this.databaseBackupResps.push(respMsg)
      ElectronApi.removeAllListeners('database-store-reply')
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
