<style lang="less">
body {
  margin: 0;
  padding: 0;
  background-color: aliceblue;

  #app {
    width: 100vw;
    height: 100vh;
  }
}
</style>

<template>
  <MajiangTable />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MajiangTable from './Table/TableComponent.vue';

export default defineComponent({
  name: 'App',
  components: {
    MajiangTable,
  },
  data() {
    return {
      msg: 'Hello Vue',
    };
  },
});
</script>
