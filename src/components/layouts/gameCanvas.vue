<template>
  <div id="game-canvas" :activeState="activeState" :gameState="gameState">
    <div class="branding-wrapper">
      <branding></branding>
    </div>
    <div class="spinner-wrapper">
      <spinner />
    </div>
    <div class="game-ui-wrapper">
      <game-canvas-asteroid-warning></game-canvas-asteroid-warning>
      <game-canvas-minimap></game-canvas-minimap>
      <game-canvas-seconds></game-canvas-seconds>
      <game-canvas-health-meter></game-canvas-health-meter>
    </div>
    <asteroids></asteroids>
    <game-canvas-countdown></game-canvas-countdown>
    <game-canvas-shields></game-canvas-shields>
    <game-canvas-ship></game-canvas-ship>
    <game-canvas-bg></game-canvas-bg>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import branding from
  '@/components/layouts/gameCanvasScreens/branding.vue';
import spinner from
  '@/components/layouts/gameCanvasScreens/spinner.vue';
import asteroids from
  '@/components/layouts/gameCanvasScreens/asteroids.vue';
import gameCanvasShields from
  '@/components/layouts/gameCanvasScreens/gameCanvasShields.vue';
import gameCanvasShip from
  '@/components/layouts/gameCanvasScreens/gameCanvasShip.vue';
import gameCanvasHealthMeter from
  '@/components/layouts/gameCanvasScreens/gameCanvasHealthMeter.vue';
import gameCanvasAsteroidWarning from
  '@/components/layouts/gameCanvasScreens/gameCanvasAsteroidWarning.vue';
import gameCanvasMinimap from
  '@/components/layouts/gameCanvasScreens/gameCanvasMinimap.vue';
import gameCanvasSeconds from
  '@/components/layouts/gameCanvasScreens/gameCanvasSeconds.vue';
import gameCanvasCountdown from
  '@/components/layouts/gameCanvasScreens/gameCanvasCountdown.vue';
import gameCanvasBg from
  '@/components/layouts/gameCanvasScreens/gameCanvasBg.vue';

export default {
  name: 'game-canvas',
  computed: mapState([
    'activeState',
    'poseActive',
    'calibrated',
    'gameState',
  ]),
  components: {
    branding,
    spinner,
    asteroids,
    gameCanvasShields,
    gameCanvasShip,
    gameCanvasHealthMeter,
    gameCanvasAsteroidWarning,
    gameCanvasMinimap,
    gameCanvasSeconds,
    gameCanvasCountdown,
    gameCanvasBg,
  },
};
</script>

<style lang="scss">
#game-canvas {
  border-right: 1px solid $dark-blue;
  box-sizing: border-box;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 66.667%;

  h1 {
    padding-top: 10%;
  }

  .branding-wrapper,
  .game-ui-wrapper {
    width: auto;
  }

  .spinner-wrapper {
    pointer-events: none;
    width: 100%;
    z-index: 30;
  }

  .branding-wrapper,
  .spinner-wrapper,
  .game-ui-wrapper {
    height: 100%;
    opacity: 0;
    position: absolute;
    transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
  }

  .branding-wrapper {
    left: 2.0833333333333vw;
    pointer-events: none;
    top: 0;
    width: 21.0963vw;
    z-index: 30;
  }

  .game-ui-wrapper {
    left: 2.083333vw;
    top: 0;
    z-index: 20;
  }

  &[activestate='attract'] {
    .branding-wrapper {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &[activestate='game'] {
    .game-ui-wrapper {
      opacity: 1;
    }
  }

  &[gameState='countdown'] {
    #game-canvas-countdown {
      opacity: 1;
    }
  }

  &[activestate='share'],
  &[gameState='error'] {
    .spinner-wrapper {
      opacity: 1;
      pointer-events: auto;
      z-index: 1100;
    }
  }
}
</style>
