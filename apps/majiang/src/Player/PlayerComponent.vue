<style>
</style>

<template>
  <div>{{ msg }}</div>
  <Tile :name="msg" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TileType } from '../enum';

export default defineComponent({
  name: 'PlayerComponent',
  props: {
    tiles: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      msg: 'Hello Vue',
    };
  },
});
</script>
