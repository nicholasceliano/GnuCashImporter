<template>
  <div id="app">
    <Header></Header>
    <div id="test">
      <SideBar></SideBar>
      <Content></Content>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FileImporter from './components/FileImporter.vue'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
import Content from './components/Content.vue'

@Component({
  components: {
    FileImporter,
    Header,
    SideBar,
    Content
  }
})
export default class App extends Vue {}
</script>

<style scoped>
#test {
  display: inline-block;
  flex-grow : 1;
}
</style>
<style>
html,
body {
  margin: 0;
  height: 100%;
}

#app {
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
