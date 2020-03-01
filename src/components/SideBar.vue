<template>
  <div id="sidebar">
    <br />
    <div v-for="item in sideBarLinks" :key="item.name">
      <router-link v-bind:to="item.route">{{item.name}}</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class SideBar extends Vue {
  @Prop() private msg!: string

  private sideBarLinks = [
    {
      route: 'fileimporter',
      name: 'File Importer'
    },
    {
      route: 'quoteimporter',
      name: 'Quote Importer'
    },
    {
      route: 'databasebackup',
      name: 'Database Backup'
    }
  ]
}
</script>

<style lang="scss" scoped>
#sidebar {
  height: 100%;
  width: 10%;
  min-width: 150px;
  float: left;
  border-right: 1px solid grey;
  padding-left: 10px;

  a {
    color: inherit;
    text-decoration: inherit;
  }

  .router-link-active {
    font-weight: bold;
  }
}
</style>
