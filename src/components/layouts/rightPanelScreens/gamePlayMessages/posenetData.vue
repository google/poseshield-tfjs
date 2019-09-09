<template>
  <div id="posenet-data" class="game-messages">
    <div class="tensorflow-branding-wrapper">
      <p>
        <span v-html="$t('gameplay-text.tensorflow')"></span>
         / <span v-html="$t('gameplay-text.tensorflowjs')"></span>
      </p>
      <p v-html="$t('gameplay-text.posenet-model')"></p>
      <br>
      <p>{{ fpsNumber }}
         <span v-html="$t('gameplay-text.fps-title')"></span>
      </p>
    </div>
    <div class="posenet-stream">
      <div class="text" v-if="poseHasData">
        <div class="posenet-text"
          v-for="(poseData, index) in poseDatas"
          v-bind:key="index"
          :data-counter="poseData.counter"
        >
          <p>Part: {{ poseData.part }}</p>
          <p>X: {{ poseData.position_x }}, Y: {{ poseData.position_y }}</p>
          <p>Score: {{ poseData.score }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import store from '@/store';

let beginTime = ( performance || Date ).now();
let prevTime = beginTime;
let frames = 0;
let fpsTracker = 0;
let poseCounter = 0;

export default {
  name: 'posenet-data',
  computed: {
    ...mapState([
      'activeState',
    ]),
  },
  data() {
    return {
      fpsNumber: '',
      poseHasData: false,
      poseDatas: [],
    };
  },
  mounted() {
  },
  methods: {
    startFPS() {
      const vm = this;
      beginTime = ( performance || Date ).now();
      frames ++;
      const time = ( performance || Date ).now();
      if ( time > prevTime + 1000 ) {
        fpsTracker = Math.round(( frames * 1000 ) / ( time - prevTime ));
        prevTime = time;
        frames = 0;

        vm.fpsNumber = fpsTracker;
      }
      if (frames % 15 === 0) {
        this.renderPosenetData();
      }
      vm.fpsTrackerId = requestAnimationFrame(this.startFPS);
    },
    renderPosenetData() {
      if (store.state.poseData) {
        const leftShoulder = store.state.poseData.leftShoulder;
        const rightShoulder = store.state.poseData.rightShoulder;
        const leftWrist = store.state.poseData.leftWrist;
        const rightWrist = store.state.poseData.rightWrist;
        if (leftShoulder) {
          this.formatPosenetData('left shoulder', leftShoulder);
        }
        if (rightShoulder) {
          this.formatPosenetData('right shoulder', rightShoulder);
        }
        if (leftWrist) {
          this.formatPosenetData('left wrist', leftWrist);
        }
        if (rightWrist) {
          this.formatPosenetData('right wrist', rightWrist);
        }
      }
    },
    formatPosenetData(part, joint) {
      if (joint.part) {
        poseCounter++;
        const poseData = {
          counter: poseCounter,
          part: part,
          position_x: joint.position.x,
          position_y: joint.position.y,
          score: joint.score,
        };

        this.poseDatas.push(poseData);

        if (this.poseDatas.length == 8) this.poseDatas.splice(0, 4);
        if (this.poseHasData === false) this.poseHasData = true;
      }
    },
  },
  watch: {
    activeState() {
      if (store.state.activeState == 'game') {
        this.fpsTrackerId = requestAnimationFrame( this.startFPS );
      } else {
        this.poseHasData = false;
        this.poseDatas = [];
        cancelAnimationFrame(this.fpsTrackerId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#posenet-data {
  bottom: 0;
  display: block;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
  width: 100%;

  .tensorflow-branding-wrapper {
    position: absolute;
    right: 2.0833333333333vw;
    text-align: right;
    top: 2.0833333333333vw;
    z-index: 10;

    p {
      color: $white;
      font-size: .8333333333333vw;
      line-height: 1.25vw;
      text-transform: uppercase;
    }
  }

  .posenet-stream {
    bottom: 2.0833333333333vw;
    height: 13.0208333333333vw;
    left: 2.0833333333333vw;
    overflow: hidden;
    position: absolute;
    transform: rotate(180deg);
    width: 27.0833333333333vw;
    z-index: 0;

    .text {
      height: 100%;
      position: absolute;
      transform: rotate(180deg);
      vertical-align: middle;
      width: 100%;
      z-index: 0;
    }

    .posenet-text {
      margin-top: .7291666666667vw;

      &:first-child {
        opacity: .25;
      }

      &:nth-child(2) {
        opacity: .5;
      }

      &:nth-child(3) {
        opacity: .75;
      }

      &:nth-child(n+5) {
        opacity: 0;
      }
    }

    .posenet-text p {
      font-size: .7291666666667vw;
      line-height: .8333333333333vw;
      margin: 0;
      text-transform: uppercase;
    }
  }
}
</style>
