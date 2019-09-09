<template>
  <div id="app" :mode="mode" :hideCursor="hideCursor">
    <div class="app-container">
      <main-layout></main-layout>
      <bg></bg>
      <debug-bar></debug-bar>
    </div>
    <video id="hidden" autoplay></video>
  </div>
</template>

<script>

import {mapState} from 'vuex';
import store from './store';
import ZoneDetector from './components/ZoneDetector.vue';
import mainLayout from '@/views/mainLayout.vue';
import bg from '@/components/layouts/bg.vue';
import debugBar from '@/components/screens/debugBar.vue';
import getSettings from './settings';

const settings = getSettings();

document.addEventListener('keydown', keyDownTextField, false);

/**
 * Handler for keyboard events
 * @param {Event} e - event resulting from a keydown
 */
function keyDownTextField(e) {
  // keys codes
  const keys = {
    'a': 65, 'c': 67, 'd': 68, 'e': 69, 'g': 71, 'p': 80,
    's': 83, 'v': 86, 'z': 90, '1': 49, '2': 50, '3': 51,
    '4': 52, '5': 53, '6': 54, '7': 55, 'space': 32,
  };
  const keyCode = e.keyCode;

  // toggle video
  if (keyCode === keys['v']) {
    store.state.videoToggle?
      store.state.videoToggle = false :
      store.state.videoToggle = true;
  }

  // toggle debug mode
  if (keyCode === keys['d']) {
    store.state.debugBar?
      store.state.debugBar = false :
      store.state.debugBar = true;
  }

  // toggle zone display
  if (keyCode === keys['z']) {
    store.state.displayZones?
      store.state.displayZones = false :
      store.state.displayZones = true;
  }

  if (store.state.debugBar) {
    // get to error state
    if (keyCode === keys['e']) {
      store.state.poseActivated = true;
      store.state.calibrated = true;
      store.state.hasPerson = false;
      store.state.gameState = 'error';
      store.state.activeState = 'game';
    }

    // toggle demo
    if (keyCode === keys['space']) {
      store.state.demoMode?
        store.state.demoMode = false :
        store.state.demoMode = true;
    }

    // get to share screen
    if (keyCode === keys['s']) {
      store.state.hasPerson = true;
      store.state.poseActivated = true;
      store.state.calibrated = true;
      store.state.activeState = 'game';
      store.state.gameCompleted = true;
    }

    // get to attract screen
    if (keyCode === keys['a']) {
      store.state.hasPerson = false;
      store.state.poseActivated = false;
      store.state.calibrated = false;
      store.state.activeState = 'attract';
    }

    // get to pose activate screen
    if (keyCode === keys['p']) {
      store.state.hasPerson = true;
      store.state.poseActivated = false;
      store.state.activeState = 'attract';
    }

    // get to calibrate screen
    if (keyCode === keys['c']) {
      store.state.hasPerson = true;
      store.state.poseActivated = true;
      store.state.calibrated = false;
    }

    // get to game mode
    if (keyCode === keys['g']) {
      store.state.hasPerson = true;
      store.state.poseActivated = true;
      store.state.calibrated = true;
    }

    // toggle individual zones using the 1-7
    if (keyCode === keys['1']) {
      store.state.zoneDetectedOne?
      store.state.zoneDetectedOne = false :
      store.state.zoneDetectedOne= true;
    }
    if (keyCode === keys['2']) {
      store.state.zoneDetectedTwo?
      store.state.zoneDetectedTwo = false :
      store.state.zoneDetectedTwo = true;
    }
    if (keyCode === keys['3']) {
      store.state.zoneDetectedThree?
      store.state.zoneDetectedThree = false :
      store.state.zoneDetectedThree = true;
    }
    if (keyCode === keys['4']) {
      store.state.zoneDetectedFour?
        store.state.zoneDetectedFour = false :
        store.state.zoneDetectedFour = true;
    }
    if (keyCode === keys['5']) {
      store.state.zoneDetectedFive?
      store.state.zoneDetectedFive = false :
      store.state.zoneDetectedFive = true;
    }
    if (keyCode === keys['6']) {
      store.state.zoneDetectedSix?
      store.state.zoneDetectedSix = false :
      store.state.zoneDetectedSix = true;
    }
    if (keyCode === keys['7']) {
      store.state.zoneDetectedSeven?
      store.state.zoneDetectedSeven = false :
      store.state.zoneDetectedSeven = true;
    }
  }
}

let beginTime;
let prevTime;
let timeTrackerRafId;
let counter = 0;
const zd = ZoneDetector;

export default {
  components: {
    mainLayout,
    bg,
    debugBar,
  },

  computed: {
    ...mapState(['activeState', 'gameState', 'hasPerson',
      'poseActivated', 'calibrated', 'gameCompleted',
      'videoFeed', 'zoneDetectInstance', 'mode', 'hideCursor']),
  },

  watch: {
    activeState() {
      store.commit('setStates');
    },
    hasPerson() {
      store.commit('setStates');
      store.commit('setHasPerson');
    },
    poseActivated() {
      store.commit('setStates');
      store.state.zoneDetectedOne = false;
      store.state.zoneDetectedTwo = false;
      store.state.zoneDetectedThree = false;
      store.state.zoneDetectedFour = false;
      store.state.zoneDetectedFive = false;
      store.state.zoneDetectedSix = false;
      store.state.zoneDetectedSeven = false;
    },
    gameState() {
      if (store.state.gameState === 'playing') {
        if (timeTrackerRafId) cancelAnimationFrame(timeTrackerRafId);

        beginTime = ( performance || Date ).now();
        prevTime = beginTime;

        timeTrackerRafId = requestAnimationFrame( this.startGameTimer );
      } else if (store.state.gameState === 'countdown') {
        if (timeTrackerRafId) cancelAnimationFrame(timeTrackerRafId);

        beginTime = ( performance || Date ).now();
        prevTime = beginTime;

        timeTrackerRafId = requestAnimationFrame( this.startGameCountdown );
      } else {
        if (timeTrackerRafId) cancelAnimationFrame(timeTrackerRafId);
      }
    },
    calibrated() {
      store.commit('setStates');
    },
    gameCompleted() {
      store.commit('setStates');
      store.commit('setGameCompletedTimeout');
    },
  },
  methods: {
    startGameCountdown() {
      const time = ( performance || Date ).now();

      if ( time > prevTime + 200 && counter < 8) {
        counter++;
        prevTime = time;
        if (counter == 1) {
          store.state.zoneDetectedOne = true;
          store.state.zoneDetectedSeven = true;
        } else if (counter == 2) {
          store.state.zoneDetectedOne = false;
          store.state.zoneDetectedSeven = false;
          store.state.zoneDetectedTwo = true;
          store.state.zoneDetectedSix = true;
        } else if (counter == 3) {
          store.state.zoneDetectedTwo = false;
          store.state.zoneDetectedSix = false;
          store.state.zoneDetectedThree = true;
          store.state.zoneDetectedFive = true;
        } else if (counter == 4) {
          store.state.zoneDetectedThree = false;
          store.state.zoneDetectedFive = false;
          store.state.zoneDetectedFour = true;
        } else if (counter == 5) {
          store.state.zoneDetectedFour = false;
          store.state.zoneDetectedOne = true;
          store.state.zoneDetectedSeven = true;
        } else if (counter == 6) {
          store.state.zoneDetectedTwo = true;
          store.state.zoneDetectedSix = true;
        } else if (counter == 7) {
          store.state.zoneDetectedThree = true;
          store.state.zoneDetectedFive = true;
        } else if (counter == 8) {
          store.state.zoneDetectedFour = true;
        }
      }

      if ( time > prevTime + 1000 && counter === 8) {
        store.state.gameCountDownToPlay--;
        prevTime = time;
      }

      if (store.state.gameCountDownToPlay === 0) {
        store.commit('setStates');
        store.state.zoneDetectedOne = false;
        store.state.zoneDetectedTwo = false;
        store.state.zoneDetectedThree = false;
        store.state.zoneDetectedFour = false;
        store.state.zoneDetectedFive = false;
        store.state.zoneDetectedSix = false;
        store.state.zoneDetectedSeven = false;
      }

      timeTrackerRafId = requestAnimationFrame( this.startGameCountdown );
    },
    startGameTimer() {
      const time = ( performance || Date ).now();

      if ( time > prevTime + 1000) {
        store.state.gameTimeCountDown--;
        prevTime = time;
      }

      if (store.state.gameTimeCountDown === 0) {
        store.commit('setGameCompleted');
      }

      timeTrackerRafId = requestAnimationFrame( this.startGameTimer );
    },
    resizeVideo() {
      this.video.width = window.innerWidth / 3;
      this.video.height = this.video.width;
      zd.methods.updateDimensions(this.video.width, this.video.height);
    },
  },
  data() {
    return {
      video: {},
    };
  },
  created() {
    store.state.share_qr = settings['share-qr'];
    store.state.share_link = settings['share-link'];

    if (settings['sharing'] === false) {
      store.state.share_qr = false;
      store.state.share_link = false;
    }

    if (settings['timeout'] >= 10 && settings['timeout'] <= 120) {
      store.state.globalTimeout = settings['timeout'] * 1000;
    }

    store.state.asteroidGroup = settings['asteroid-group'];
    store.state.modelStride = settings['model-stride'];
    store.state.multiplier = settings['multiplier'];
    store.state.minPartConfidence = settings['min-part-conf'];
    store.state.minPoseConfidence = settings['min-pose-conf'];
    store.state.inputResolution = settings['input-res'];
    store.state.mode = settings['mode'];
    store.state.hideCursor = settings['hide-cursor'];

    store.state.speed = settings['speed'];
    if (store.state.speed == 'frantic') {
      store.state.asteroidCounter = 60;
      store.state.asteroidTotalCount = 60;
      store.state.asteroidBlocks = 60;
      store.state.asteroidBlocksText = '60';
    } else if (store.state.speed == 'relaxed') {
      store.state.asteroidCounter = 15;
      store.state.asteroidTotalCount = 15;
      store.state.asteroidBlocks = 15;
      store.state.asteroidBlocksText = '15';
    }
  },
  mounted() {
    this.video = document.getElementById('hidden');
    document.onreadystatechange = () => {
      if (document.readyState == 'complete') {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
            // Add video feed to the store
            store.commit('setVideoFeed', stream);
            // Initialize ZoneDetector and PoseNet
            stream.width = 500;
            stream.height = 400;

            this.video.srcObject = stream;
            this.video.width = window.innerWidth / 3;
            this.video.height = this.video.width;

            zd.methods.initialize(this.video, store);
            store.commit('setZoneDetectedInstance', zd);
          }).catch((err) => {
            store.state.noVideo = true;
            store.commit('setStates');
          });
        }
      }
    };
    window.addEventListener('resize', this.resizeVideo);
  },
};
</script>

<style lang="scss">
html,
body {
  align-content: center;
  background-attachment: fixed;
  background-image: url('~@/assets/images/bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  color: $white;
  display: flex;
  font-family: 'Roboto Mono', monospace;
  height: 100%;
  justify-content: center;
  margin: 0;
  width: 100%;

  h1 {
    font-size: 1.875vw;
    font-weight: 400;
    line-height: 2.5vw;
    margin: 0 0 1.667vw;
    text-transform: uppercase;
  }

  p {
    font-size: 1.354vw;
    line-height: 2.083vw;
    margin: 0;
  }

  .tiny {
    font-size: .729vw;
    line-height: 1.25vw;
    margin: 0;
  }
}

#app {
  bottom: 0;
  height: 0;
  left: 0;
  margin: auto;
  overflow: hidden;
  padding-top: 56.25%;
  position: relative;
  top: 0;
  width: 100%;

  .app-container {
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }

  video#hidden {
    display: none;
  }

  &[hideCursor='true'] {
    cursor: none;
  }
}
</style>
