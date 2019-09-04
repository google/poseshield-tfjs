<template>
  <div id="game-canvas-ship">
    <shipWireframe />
  </div>
</template>

<script>

// @ is an alias to /src
import shipWireframe from '@/assets/svgs/ship-wireframe.svg';

export default {
  name: 'game-canvas-ship',
  components: {
    shipWireframe,
  },
};
</script>

<style lang="scss" scoped>

#ship {
  height: 29.4791vw;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  top: 22.864583333vw;
  width: 20.625vw;

  #Original_Ship,
  #Original_Ship image {
    opacity: 1;
  }

  .cls-1,
  .cls-15,
  .cls-16,
  .cls-17,
  .cls-18,
  .cls-19,
  .cls-2,
  .cls-20,
  .cls-21,
  .cls-22,
  .cls-23,
  .cls-6 {
    fill: none;
    stroke: $svg-white-stroke;
    stroke-miterlimit: 10;
  }

  .cls-1 {
    mix-blend-mode: darken;
  }

  .cls-3 {
    isolation: isolate;
  }

  .cls-19,
  .cls-4,
  .cls-5 {
    opacity: 1;
  }

  .cls-15,
  .cls-16,
  .cls-17,
  .cls-18,
  .cls-5 {
    mix-blend-mode: screen;
  }

  .cls-6 {
    mix-blend-mode: color-dodge;
    opacity: .39;
  }

  .cls-7 {
    fill: $svg-white-stroke;
  }

  .cls-8 {
    clip-path: url('#clip-path');
  }

  .cls-9 {
    clip-path: url('#clip-path-2');
  }

  .cls-10,
  .cls-13 {
    mix-blend-mode: multiply;
  }

  .cls-11 {
    clip-path: url('#clip-path-3');
  }

  .cls-12 {
    clip-path: url('#clip-path-4');
  }

  .cls-13 {
    opacity: .66;
  }

  .cls-14 {
    clip-path: url('#clip-path-6');
  }

  .cls-15 {
    opacity: .32;
  }

  .cls-16 {
    opacity: .19;
  }

  .cls-17 {
    opacity: .1;
  }

  .cls-18 {
    opacity: .05;
  }

  .cls-20 {
    opacity: .2;
  }

  .cls-21 {
    opacity: .55;
  }

  .cls-22 {
    opacity: .78;
  }

  .cls-23 {
    opacity: .69;
  }
}
</style>
