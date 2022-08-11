<style lang="less">
.table {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto;
  perspective: 1400px;
  perspective-origin: 50% 0%;
  transform-style: preserve-3d;
  width: 1920px;
  height: 972px;

  .slot {
    position: absolute;
    bottom: 300px;
    left: calc(50% - 35px);
    transform-style: preserve-3d;

    &.top {
      transform: translateZ(-1800px) rotateY(180deg);
    }

    &.left {
      transform: translate3d(-800px, 0, -900px) rotateY(-90deg);
    }

    &.right {
      transform: translate3d(800px, 0, -900px) rotateY(90deg);
    }
  }

  .tabletop {
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    position: absolute;
    bottom: 300px;
    left: calc(50% - 35px);

    &>div {
      @width: 3000px;
      width: @width;
      height: @width;
      box-sizing: border-box;
      background-color: rgb(109, 36, 36);
      transform: translate3d(-1500px, -1400px, -1160px) rotateX(90deg);
      border: 80px solid rgb(153, 116, 24);
    }
  }
}
</style>

<template>
  <div class="table" :style="{ transform: `scale(${scale})`, top: `${top}px` }">
    <div class="tabletop">
      <div />
    </div>
    <div class="slot top">
      <TileComponent :index="0" :name="type.HONGZHONG" />
      <TileComponent :index="1" :name="type.FACAI" />
      <TileComponent :index="2" :name="type.BAIBAN" />
      <TileComponent :index="3" :name="type.DONG" />
      <TileComponent :index="4" :name="type.NAN" />
      <TileComponent :index="5" :name="type.XI" />
      <TileComponent :index="6" :name="type.BEI" />
      <TileComponent :index="7" :name="type.HUAFOUR" />
      <TileComponent :index="8" :name="type.JIUTIAO" />
      <TileComponent :index="9" :name="type.XI" />
      <TileComponent :index="10" :name="type.BEI" />
      <TileComponent :index="11" :name="type.HUAFOUR" />
      <TileComponent :index="12" :name="type.JIUTIAO" />
    </div>
    <div class="slot bottom">
      <TileComponent :index="0" :name="type.HONGZHONG" hoverable />
      <TileComponent :index="1" :name="type.FACAI" hoverable />
      <TileComponent :index="2" :name="type.BAIBAN" hoverable />
      <TileComponent :index="3" :name="type.DONG" hoverable />
      <TileComponent :index="4" :name="type.NAN" hoverable />
      <TileComponent :index="5" :name="type.XI" hoverable />
      <TileComponent :index="6" :name="type.BEI" hoverable />
      <TileComponent :index="7" :name="type.HUAFOUR" hoverable />
      <TileComponent :index="8" :name="type.JIUTIAO" hoverable />
      <TileComponent :index="9" :name="type.XI" hoverable />
      <TileComponent :index="10" :name="type.BEI" hoverable />
      <TileComponent :index="11" :name="type.HUAFOUR" hoverable />
      <TileComponent :index="12" :name="type.JIUTIAO" hoverable />
    </div>
    <div class="slot left">
      <TileComponent :index="0" :name="type.HONGZHONG" />
      <TileComponent :index="1" :name="type.FACAI" />
      <TileComponent :index="2" :name="type.BAIBAN" />
      <TileComponent :index="3" :name="type.DONG" />
      <TileComponent :index="4" :name="type.NAN" />
      <TileComponent :index="5" :name="type.XI" />
      <TileComponent :index="6" :name="type.BEI" />
      <TileComponent :index="7" :name="type.HUAFOUR" />
      <TileComponent :index="8" :name="type.JIUTIAO" />
      <TileComponent :index="9" :name="type.XI" />
      <TileComponent :index="10" :name="type.BEI" />
      <TileComponent :index="11" :name="type.HUAFOUR" />
      <TileComponent :index="12" :name="type.JIUTIAO" />
    </div>
    <div class="slot right">
      <TileComponent :index="0" :name="type.HONGZHONG" />
      <TileComponent :index="1" :name="type.FACAI" />
      <TileComponent :index="2" :name="type.BAIBAN" />
      <TileComponent :index="3" :name="type.DONG" />
      <TileComponent :index="4" :name="type.NAN" />
      <TileComponent :index="5" :name="type.XI" />
      <TileComponent :index="6" :name="type.BEI" />
      <TileComponent :index="7" :name="type.HUAFOUR" />
      <TileComponent :index="8" :name="type.JIUTIAO" />
      <TileComponent :index="9" :name="type.XI" />
      <TileComponent :index="10" :name="type.BEI" />
      <TileComponent :index="11" :name="type.HUAFOUR" />
      <TileComponent :index="12" :name="type.JIUTIAO" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TileComponent from '@/Tile/TileComponent.vue';
import { TileType } from '../enum';

export default defineComponent({
  name: 'MajiangTable',
  components: {
    TileComponent,
  },
  data() {
    return {
      msg: 'Hello Vue',
      type: TileType,
      scale: 1,
      top: 0,
    };
  },
  created() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize, false);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize, false);
  },
  methods: {
    handleResize() {
      const width = window.innerWidth, height = window.innerHeight;
      const s1 = width / 1920, s2 = height / 972;
      this.scale = Math.min(s1, s2);
      this.top = (height - 972) / 2;
    },
  }
});
</script>
