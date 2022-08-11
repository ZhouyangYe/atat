<style>
.tile {
  width: 50px;
  height: 100px;
  background-color: red;
}
</style>

<template>
  <div class="tile" :class="[name, direction, index]" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      required: false,
      default: '',
    },
    index: {
      type: Number,
      required: false,
      default: 0,
    },
    direction: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      title: this.$props.name,
    }
  },
});
</script>
