<style lang="less">
.tile {
  position: absolute;
  width: 70px;
  height: 100px;
  transform-style: preserve-3d;
  transition: transform 0.2s ease;

  .face {
    position: absolute;
    box-sizing: border-box;
    border: 1px solid rgb(35, 156, 82);
    background-color: rgb(4, 121, 49);
  }

  .front {
    height: 100px;
    width: 70px;
    transform: translate3d(0, 0, 0);
    background-image: url('/@resources/static/materials/majiang/majiang.jpg');
    background-size: 700px 540px;
    background-color: ghostwhite;
  }

  .back {
    height: 100px;
    width: 70px;
    transform: translate3d(0, 0, -30px);
  }

  .left {
    height: 100px;
    width: 30px;
    left: 20px;
    transform: translate3d(-35px, 0, -15px) rotate3d(0, 1, 0, -90deg);
  }

  .right {
    height: 100px;
    width: 30px;
    left: 20px;
    transform: translate3d(35px, 0, -15px) rotate3d(0, 1, 0, 90deg);
  }

  .top {
    height: 30px;
    width: 70px;
    top: 35px;
    transform: translate3d(0, -50px, -15px) rotate3d(1, 0, 0, 90deg);
  }

  .bottom {
    height: 30px;
    width: 70px;
    top: 35px;
    transform: translate3d(0, 50px, -15px) rotate3d(1, 0, 0, -90deg);
  }
}
</style>

<template>
  <div
    class="tile" :class="[index]"
    :style="{ transform: `translate3d(${(index - 6) * 77}px, ${y}, 0)`, cursor: hoverable ? 'pointer' : 'default' }"
    @mouseenter="mouseEnter" @mouseleave="mouseLeave"
  >
    <div class="face front" :style="{ backgroundPosition: position }" />
    <div class="face back" />
    <div class="face left" />
    <div class="face right" />
    <div class="face top" />
    <div class="face bottom" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { spriteMap } from '../utils';

export default defineComponent({
  name: 'TileComponent',
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
    hoverable: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      position: spriteMap[this.$props.name],
      y: '0',
    }
  },
  methods: {
    mouseEnter() {
      if (!this.$props.hoverable) {
        return;
      }
      this.y = '-30px';
    },
    mouseLeave() {
      if (!this.$props.hoverable) {
        return;
      }
      this.y = '0';
    },
  },
});
</script>
