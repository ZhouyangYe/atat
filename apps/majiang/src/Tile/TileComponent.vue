<template>
  <div class="tile" :class="[name]" >{{name}}</div>
</template>

<script lang="ts">
export default {
  props: {
    name: String(),
  },
  data() {
    return {
      title: this.$props.name,
    }
  },
};
</script>

<style>
.tile {
  width: 50px;
  height: 100px;
  background-color: red;
}
</style>
