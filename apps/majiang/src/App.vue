<template>
  <div>{{ msg }}</div>
  <Tile name="test" />
</template>

<script lang="ts">
  import Tile from './Tile/TileComponent.vue';

  export default {
    components: {
      Tile,
    },
    data() {
      return {
        msg: 'Hello Vue',
      };
    },
  };
</script>
