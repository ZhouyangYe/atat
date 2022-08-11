<style>
</style>

<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      msg: 'Hello Vue',
    };
  },
});
</script>
