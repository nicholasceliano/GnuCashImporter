<template>
  <div id="content">
    <br />
    <span>Content</span>
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
  width: 90% - 1px;
  display: inline-block;
}
</style>
