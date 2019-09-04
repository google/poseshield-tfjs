<template>
  <div id="game-canvas-bg">
    <lottie
      v-for="n in circleCount"
      v-bind:key="n"
      :id="'circle-' + n"
      :data-id="n"
      :width="9"
      :height="40.5"
      :options="defaultOptions"
      v-on:animCreated="handleAnimation"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store';
import lottie from '@/lottie.vue';
import animationData from '@/assets/json/circle-animation.json';

const circleCount = 3;
const circles = [];

let beginTime = ( performance || Date ).now();
let prevTime = beginTime;
let seconds = 0;

export default {
  name: 'game-canvas-bg',
  components: {
    lottie,
  },
  data() {
    return {
      defaultOptions: {
        animationData: animationData,
        autoplay: false,
        loop: false,
        renderer: 'canvas',
      },
      circleCount: circleCount,
    };
  },
  mounted() {
    this.animateCircleId = requestAnimationFrame( this.animateCircles );
  },
  methods: {
    handleAnimation(animationData) {
      const id = animationData.wrapper.getAttribute('data-id');
      const arrayId = id - 1;
      const anim = animationData;
      anim.frameModifier = 0.120;
      anim.frameMult = 0.120;
      anim.frameRate = 120;

      circles[arrayId] = anim;
    },

    animateCircles() {
      const vm = this;
      beginTime = ( performance || Date ).now();
      const time = ( performance || Date ).now();

      if ( time > prevTime + 1000 ) {
        seconds++;
        prevTime = time;
        if (store.state.activeState !== 'game') {
          if (seconds == 1) {
            circles[0].play();
            circles[1].stop();
            circles[2].stop();
          } else if (seconds == 2) {
            circles[0].stop();
            circles[1].play();
            circles[2].stop();
          } else if (seconds == 6) {
            circles[0].stop();
            circles[1].stop();
            circles[2].play();
          } else if (seconds == 11) {
            seconds = 0;
          }
        }
      }

      vm.animateCircleId = requestAnimationFrame( this.animateCircles );
    },
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-bg {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 0;

  #circle-1 {
    left: 16.9270833333333vw;
    position: absolute;
    top: 14.5833333333333vw;
  }

  #circle-2 {
    left: 8.33333333333337vw;
    position: absolute;
    top: 29.1666666666667vw;
  }

  #circle-3 {
    left: 51.0416666666667vw;
    position: absolute;
    top: 39.6875vw;
  }
}
</style>
