<template>
  <div id="skeletal-tracking-canvas-screen"
    :debugBar="debugBar" :videoToggle="videoToggle">
    <transition name="fade" mode="out-in">
      <div class="loading-text" v-show="zoneDetectedLoaded === false">
        <p v-html="$t('loading-pose-model')"></p>
      </div>
    </transition>
    <div class="canvas-screen-wrapper">
      <video ref="video" id="video" autoplay></video>
      <canvas ref="canvas" id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import store from '../../../store';

export default {
  name: 'skeletal-tracking-canvas-screen',
  computed: {
    ...mapState([
      'debugBar',
      'videoFeed',
      'zoneDetectedInstance',
      'zoneDetectedLoaded',
      'videoToggle',
    ]),
  },
  data() {
    return {
      video: {},
      canvas: {},
    };
  },
  mounted() {
    this.video = this.$refs.video;
    this.canvas = this.$refs.canvas;
    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();
  },
  watch: {
    videoFeed() {
      this.video.srcObject = store.state.videoFeed;
      this.video.play();
    },
    zoneDetectedInstance() {
      this.canvas.width = window.innerWidth / 3;
      this.canvas.height = this.canvas.width;
      store.state.zoneDetectedInstance.methods.
          drawSkeleton(this.canvas);
    },
  },
  methods: {
    resizeCanvas() {
      this.canvas.width = window.innerWidth / 3;
      this.canvas.height = this.canvas.width;
    },
  },
};
</script>

<style lang="scss">
#skeletal-tracking-canvas-screen {
  border-top: 1px solid $dark-blue;
  bottom: 0;
  display: block;
  height: 59.25%;
  left: 0;
  opacity: 1;
  overflow: hidden;
  pointer-events: auto;
  position: absolute;
  transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
  width: 100%;
  z-index: 100;

  .canvas-screen-wrapper {
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .loading-text {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;

    p {
      color: $white;
      font-size: .8333333333333vw;
      line-height: 1.25vw;
      text-align: center;
      text-transform: uppercase;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  video,
  canvas {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  video {
    display: none;
    transform: rotateY(180deg);
    z-index: 0;
  }

  canvas {
    z-index: 1;
  }

  &[debugBar='true'] {
    video {
      display: block;
    }
  }

  &[videoToggle='true'] {
    video {
      display: block;
    }
  }
}
</style>
