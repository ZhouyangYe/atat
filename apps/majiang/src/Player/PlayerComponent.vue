<style>
</style>

<template>
  <div>{{ msg }}</div>
  <Tile :name="msg" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tile from './Tile/TileComponent.vue';

export default defineComponent({
  components: {
    Tile,
  },
  data() {
    return {
      msg: 'Hello Vue',
    };
  },
});
</script>
