<template>
  <div id="sidebar">
    <br />
    <div v-for="item in sideBarLinks" :key="item.name">{{item.name}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SideBar extends Vue {
  @Prop() private msg!: string

  private sideBarLinks = [
    {
      name: 'File Importer'
    },
    {
      name: 'Quote Importer'
    },
    {
      name: 'Database Backup'
    }
  ]
}
</script>

<style scoped>
#sidebar {
  width: 10%;
  height: 100%;
  float:left;
  border-right: 1px solid grey;
  padding-left:10px;
}
</style>
