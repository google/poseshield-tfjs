<template>
  <div id="game-canvas-minimap">
    <div class="minimap-wrapper">
      <lottie :options="defaultOptions" v-on:animCreated="handleAnimation"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import store from '@/store';
import lottie from '@/lottie.vue';
import animationData from '@/assets/json/asteroid-map.json';

let animEl;

export default {
  name: 'game-canvas-minimap',
  components: {
    lottie,
  },
  computed: {
    ...mapState(['activeState', 'gameState']),
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData,
        autoplay: false,
        loop: false,
        renderer: 'canvas',
      },
      animationSpeed: 1,
    };
  },
  methods: {
    handleAnimation: (anim) => {
      animEl = anim;
      animEl.setSpeed(0.85);
    },
  },
  watch: {
    activeState: () => {
      if (store.state.activeState !== 'game'
        && store.state.activeState !== 'share') {
        animEl.stop();
      }
    },
    gameState: () => {
      if (store.state.activeState == 'game'
        && store.state.gameState == 'error') {
        animEl.pause();
      } else if (store.state.activeState == 'game'
        && store.state.gameState == 'playing') {
        animEl.play();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-minimap {
  left: -.2083333333333vw;
  position: absolute;
  top: 6.25vw;

  .minimap-wrapper {
    height: 10.9375vw;
    width: 13.125vw;
  }
}
</style>
