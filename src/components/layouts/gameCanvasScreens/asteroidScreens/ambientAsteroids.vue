<template>
  <div id="ambient-asteroids">
    <div id="ambient-asteroids-container">
      <div id="ambient-asteroid-1" class="asteroid-wrapper">
        <asteroid1 class="asteroid" />
      </div>
      <div id="ambient-asteroid-2" class="asteroid-wrapper">
        <asteroid2 class="asteroid" />
      </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import store from '@/store';
import asteroid1 from '@/assets/svgs/asteroid1.svg';
import asteroid2 from '@/assets/svgs/asteroid2.svg';
import {TimelineLite, Linear} from 'gsap';

let ambientAsteroid1;
let ambientAsteroid2;
let ambientAsteroidContainer;

let asteroidTopOffset;
let asteroidTopOffsetPercentage;

const asteroidHeight = 112;
const canvasHeight = 1080;

const ambientTimeline =
  new TimelineLite({onComplete: function() {
    this.restart();
  }});

export default {
  name: 'ambient-asteroids',
  components: {
    asteroid1,
    asteroid2,
  },
  computed: {
    ...mapState(['activeState', 'gameState']),
  },
  mounted() {
    ambientAsteroid1 = document.getElementById('ambient-asteroid-1');
    ambientAsteroid2 = document.getElementById('ambient-asteroid-2');
    ambientAsteroidContainer =
      document.getElementById('ambient-asteroids-container');

    this.calculateSizes();
    this.ambientTimelineBuilder();
  },
  methods: {
    calculateSizes() {
      asteroidTopOffset = ((asteroidHeight/canvasHeight ) * 100) * -1;
      asteroidTopOffsetPercentage = asteroidTopOffset.toString()+'%';
    },
    ambientTimelineBuilder() {
      ambientTimeline
          .fromTo(
              ambientAsteroid1,
              10,
              {
                rotation: 0,
                top: asteroidTopOffsetPercentage,
                left: '15%',
              },
              {
                rotation: 360,
                top: '100%',
                left: '16%',
                ease: Linear.easeInOut,
                delay: 3,
                immediateRender: false,
              }
          )
          .fromTo(
              ambientAsteroid2,
              8,
              {
                rotation: 0,
                top: asteroidTopOffsetPercentage,
                left: '76%',
              },
              {
                rotation: -360,
                top: '100%',
                left: '77%',
                ease: Linear.easeInOut,
                delay: 2,
                immediateRender: false,
              }
          )
          .fromTo(
              ambientAsteroid1,
              13,
              {
                rotation: 0,
                top: asteroidTopOffsetPercentage,
                left: '85%',
              },
              {
                rotation: -720,
                top: '100%',
                left: '83%',
                ease: Linear.easeInOut,
                delay: 7,
                immediateRender: false,
              }
          )
          .fromTo(
              ambientAsteroid2,
              6,
              {
                rotation: 0,
                top: asteroidTopOffsetPercentage,
                left: '7%',
              },
              {
                rotation: 720,
                top: '100%',
                left: '10%',
                ease: Linear.easeInOut,
                delay: 2,
                immediateRender: false,
              }
          );
    },
  },
  watch: {
    activeState() {
      if (store.state.activeState == 'game') {
        ambientTimeline.pause();
        ambientAsteroidContainer.classList.add('hide');
      } else {
        ambientAsteroidContainer.classList.remove('hide');
        ambientTimeline.restart();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#ambient-asteroids {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 30;

  #ambient-asteroids-container {
    opacity: 1;
    transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;

    &.hide {
      opacity: 0;
      transition: opacity 0s cubic-bezier(.7, 0, .3, 1) 0s;
    }
  }
}
</style>
