<template>
  <div id="asteroids">
    <game-asteroids></game-asteroids>
    <ambient-asteroids></ambient-asteroids>
  </div>
</template>

<script>

// @ is an alias to /src
import ambientAsteroids from
  '@/components/layouts/gameCanvasScreens/asteroidScreens/ambientAsteroids.vue';
import gameAsteroids from
  '@/components/layouts/gameCanvasScreens/asteroidScreens/gameAsteroids.vue';

export default {
  name: 'game-canvas-asteroids',
  components: {
    gameAsteroids,
    ambientAsteroids,
  },
};
</script>

<style lang="scss">
#asteroids {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 30;

  .asteroid-wrapper {
    display: flex;
    height: 5.8333333333333vw;
    left: -5.8333333333333vw;
    position: absolute;
    top: -5.8333333333333vw;
    width: 5.8333333333333vw;

    svg {
      bottom: 0;
      height: 5.8333333333333vw;
      left: 0;
      margin: auto;
      position: absolute;
      right: 0;
      top: 0;
      width: 5.8333333333333vw;
    }

    .cls-1 {
      fill: none;
      stroke: $white;
      stroke-miterlimit: 10;
      stroke-width: 2.93px;
    }
  }
}
</style>
