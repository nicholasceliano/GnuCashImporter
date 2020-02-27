<template>
  <div id="content">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Content extends Vue {}
</script>

<style scoped>
#content {
  padding-left: 10px;
  height: 100%;
  display: flex;
}
</style>
