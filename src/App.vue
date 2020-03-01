<template>
  <div id="app">
    <Header></Header>
    <div id="page">
      <SideBar></SideBar>
      <Content></Content>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
import Content from './components/content/Content.vue'
import { router } from './router'

@Component({
  components: {
    Header,
    SideBar,
    Content
  },
  router
})
export default class App extends Vue {}
</script>

<style lang="scss" scoped>
#page {
  display: inline-block;
  flex-grow: 1;
}
</style>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
