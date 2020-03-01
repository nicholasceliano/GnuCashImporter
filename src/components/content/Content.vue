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

<style lang="scss" scoped>
@import '@/global.scss';

#content {
  padding-left: 10px;
  height: 100%;
  display: flex;
  background-color: $lightgreen-tertiary;
}
</style>
