<template>
  <div id="game-asteroids">
    <div id="game-asteroids-container">
      <div
        class="asteroid-wrapper"
        v-for="n in asteroidCount"
        v-bind:key="n"
        :id="'asteroid-' + n"
      >
        <asteroid1 :id="'asteroid1-svg-' + n" class="asteroid show" />
        <asteroid2 :id="'asteroid2-svg-' + n" class="asteroid" />
      </div>
    </div>
    <div id="game-collisions">
      <div
        class="collision-wrapper"
        v-for="i in shieldCount"
        v-bind:key="i"
        :id="'shield-' + i"
      >
        <div :id="'collision-hit-' + i" class="hit-wrapper">
          <lottie
            :data-id="i"
            data-type="hit"
            :options="hitOptions"
            class="collision"
            v-on:animCreated="collisionAnimation"/>
        </div>
        <div :id="'collision-block-' + i" class="block-wrapper">
          <lottie
            :data-id="i"
            data-type="block"
            :options="blockOptions"
            class="collision"
            v-on:animCreated="collisionAnimation"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import store from '@/store';
import lottie from '@/lottie.vue';
import hitData from '@/assets/json/collision-hit.json';
import blockData from '@/assets/json/collision-block.json';
import flightPathData from '@/assets/json/flight-paths.json';

import asteroid1 from '@/assets/svgs/asteroid1.svg';
import asteroid2 from '@/assets/svgs/asteroid2.svg';
import {TimelineMax, Linear} from 'gsap';

import asteroidData1 from '@/assets/asteroids/asteroids_1.json';
import asteroidData2 from '@/assets/asteroids/asteroids_3.json';
import asteroidData3 from '@/assets/asteroids/asteroids_3.json';
import asteroidData4 from '@/assets/asteroids/asteroids_4.json';
import asteroidData5 from '@/assets/asteroids/asteroids_5.json';

const asteroidDataArray = {
  1: asteroidData1,
  2: asteroidData2,
  3: asteroidData3,
  4: asteroidData4,
  5: asteroidData5,
};

let gameAsteroidContainer;

const baseCanvasHeight = 1080;
const baseCanvasWidth = 1280;

let asteroidTotalTime = 2;
const flightPaths = flightPathData;
const asteroids = [];
const shields = [];
const shieldCount = 7;

let gameTimeline = [];
let masterTimeline = new TimelineMax({
  autoRemoveChildren: true,
  smoothChildTiming: true,
});
masterTimeline.pause(null, false);

let asteroidData;

export default {
  name: 'game-asteroids',
  components: {
    lottie,
    asteroid1,
    asteroid2,
  },
  data() {
    return {
      hitOptions: {
        animationData: hitData,
        autoplay: false,
        loop: false,
        renderer: 'canvas',
      },
      blockOptions: {
        animationData: blockData,
        autoplay: false,
        loop: false,
        renderer: 'canvas',
      },
      shieldCount: shieldCount,
    };
  },
  computed: {
    ...mapState([
      'activeState',
      'gameState',
      'speed',
    ]),
    asteroidCount() {
      return store.state.asteroidTotalCount;
    },
  },
  beforeCreate() {
    if (store.state.speed == 'frantic') {
      asteroidTotalTime = 1;
    } else if (store.state.speed == 'relaxed') {
      asteroidTotalTime = 4;
    }

    for (let i = 1; i <= store.state.asteroidTotalCount; i++ ) {
      let asteroidArray = {};
      asteroidArray = {
        id: i,
        container: false,
        asteroidOne: false,
        asteroidTwo: false,
      };
      asteroids.push(asteroidArray);
    }

    for (let j = 1; j <= shieldCount; j++ ) {
      let shieldArray = {};
      shieldArray = {
        zone: j,
        collisionHit: false,
        collisionHitAnim: false,
        collisionBlock: false,
        collisionBlockAnim: false,
      };
      shields.push(shieldArray);
    }
  },
  mounted() {
    gameAsteroidContainer = document.getElementById('game-asteroids-container');

    for (let i = 1; i <= store.state.asteroidTotalCount; i++ ) {
      const asteroidWrapper = document.getElementById('asteroid-'+i);
      const asteroidOne = document.getElementById('asteroid1-svg-'+i);
      const asteroidTwo = document.getElementById('asteroid2-svg-'+i);

      asteroids[i-1].container = asteroidWrapper;
      asteroids[i-1].asteroidOne = asteroidOne;
      asteroids[i-1].asteroidTwo = asteroidTwo;
    }

    for (let j= 1; j <= shieldCount; j++ ) {
      const asteroidHit = document.getElementById('collision-hit-'+j);
      const asteroidBlock = document.getElementById('collision-block-'+j);

      shields[j-1].collisionHit = asteroidHit;
      shields[j-1].collisionBlock = asteroidBlock;
    }
  },
  methods: {
    collisionAnimation(animationData) {
      const id = animationData.wrapper.getAttribute('data-id');
      const arrayId = id - 1;
      const type = animationData.wrapper.getAttribute('data-type');
      const anim = animationData;

      anim.setSpeed(1);

      if (type == 'hit') {
        shields[arrayId].collisionHitAnim = anim;
      } else {
        shields[arrayId].collisionBlockAnim = anim;
      }
    },
    gameAsteroidBuilder() {
      const vm = this;

      for (let i = 0; i < asteroids.length; i++ ) {
        gameTimeline[i] = new TimelineMax({
          autoRemoveChildren: true,
          smoothChildTiming: true,
        });

        // Set Asteroid data from asteroids array
        const asteroid = asteroids[i];
        const asteroidContainer = asteroid.container;
        const asteroidOne = asteroid.asteroidOne;
        const asteroidTwo = asteroid.asteroidTwo;

        // Set Asteroid Animation/Zone data from asteroid json file
        const asteroidAnimData = asteroidData[i];
        const zone = asteroidAnimData.hit_zone[0];
        const asteroidDesign = asteroidAnimData.design;
        let duration =
          (asteroidAnimData.duration >= 1) ? asteroidAnimData.duration : 1;

        if (store.state.speed == 'frantic') {
          duration = .5;
        } else if (store.state.speed == 'relaxed') {
          duration = 3;
        }

        const delay = asteroidTotalTime - duration;
        const rotation = asteroidAnimData.rotation;

        // Set asteroid flight data from flight
        // path json file per zone set from asteroid json

        const startLeft = flightPaths[zone]['paths'][0]['start']['left'];
        const startTop = flightPaths[zone]['paths'][0]['start']['top'];
        const endLeft = flightPaths[zone]['paths'][0]['end']['left'];
        const endTop = flightPaths[zone]['paths'][0]['end']['top'];
        const hitZoneLeft = flightPaths[zone]['paths'][0]['hitzone']['left'];
        const hitZoneTop = flightPaths[zone]['paths'][0]['hitzone']['top'];
        const percent = flightPaths[zone]['paths'][0]['hitzone']['percent'];

        const duration1 = duration * percent;
        const duration2 = duration * (1 - percent);
        const rotation1 = rotation * percent;

        const startLeftVal = (startLeft/baseCanvasWidth) * 100;
        const startTopVal = (startTop/baseCanvasHeight) * 100;
        const endLeftVal = (endLeft/baseCanvasWidth) * 100;
        const endTopVal = (endTop/baseCanvasHeight) * 100;

        const startLeftPerc= startLeftVal.toString()+'%';
        const startTopPerc = startTopVal.toString()+'%';
        const endLeftPerc = endLeftVal.toString()+'%';
        const endTopPerc = endTopVal.toString()+'%';

        const hitTop = (hitZoneTop/baseCanvasHeight) * 100;
        const hitLeft = (hitZoneLeft/baseCanvasWidth) * 100;
        const hitLeftPerc = hitLeft.toString()+'%';
        const hitTopPerc = hitTop.toString()+'%';

        if (asteroidDesign === 1) {
          asteroidOne.classList.add('show');
          asteroidTwo.classList.remove('show');
        } else {
          asteroidOne.classList.remove('show');
          asteroidTwo.classList.add('show');
        }

        gameTimeline[i].set(
            asteroidContainer,
            {
              left: startLeftPerc,
              top: startTopPerc,
              rotation: 1,
              delay: delay,
            },
            0
        );

        gameTimeline[i].to(
            asteroidContainer,
            duration1,
            {
              left: hitLeftPerc,
              top: hitTopPerc,
              rotation: rotation1,
              ease: Linear.easeNone,
              onComplete: vm.hitBlockChecker,
              onCompleteParams: [
                i,
                zone,
                gameTimeline[i],
                asteroidContainer,
                duration2,
                endLeftPerc,
                endTopPerc,
                rotation,
              ],
            }
        );

        masterTimeline.add(gameTimeline[i]);
      }
    },
    hitBlockChecker(i, zone, gtl, asteroidContainer,
        duration2, endLeftPerc, endTopPerc, rotation) {
      const self = this;
      let hitBlock = 'hit';

      if ((zone == 1 && store.state.zoneDetectedOne === true)
      || (zone == 2 && store.state.zoneDetectedTwo === true)
      || (zone == 3 && store.state.zoneDetectedThree === true)
      || (zone == 4 && store.state.zoneDetectedFour === true)
      || (zone == 5 && store.state.zoneDetectedFive === true)
      || (zone == 6 && store.state.zoneDetectedSix === true)
      || (zone == 7 && store.state.zoneDetectedSeven === true)) {
        hitBlock = 'block';
      }

      if (hitBlock == 'block') {
        self.sendCollision(i, zone, 'block');
      } else {
        gtl.to(
            asteroidContainer,
            duration2,
            {
              left: endLeftPerc,
              top: endTopPerc,
              rotation: rotation,
              ease: Linear.easeNone,
              onComplete: self.sendCollision,
              onCompleteParams: [i, zone, 'hit'],
            }
        );
      }
    },
    sendCollision(i, zone, data) {
      const shield = shields[zone-1];
      const anim = (data == 'hit') ?
        shield.collisionHitAnim :
        shield.collisionBlockAnim;

      asteroids[i].asteroidOne.classList.remove('show');
      asteroids[i].asteroidTwo.classList.remove('show');

      anim.goToAndPlay(0);
      store.commit('asteroidCollision', data);
    },
    cleanUpAsteroids() {
      masterTimeline.clear();
      masterTimeline = null;
      masterTimeline = new TimelineMax({
        autoRemoveChildren: true,
        smoothChildTiming: true,
      });

      masterTimeline.pause(null, false);

      gameTimeline = [];

      for (let i = 1; i <= store.state.asteroidTotalCount; i++ ) {
        const asteroid = asteroids[i-1];
        const asteroidWrapper = asteroid.container;
        const asteroidOne = asteroid.asteroidOne;
        const asteroidTwo = asteroid.asteroidTwo;

        asteroidWrapper.style.left = null;
        asteroidWrapper.style.top = null;
        asteroidOne.style.transform = null;
        asteroidTwo.style.transform = null;
        asteroidOne.classList.remove('show');
        asteroidTwo.classList.remove('show');
      }
    },
  },
  watch: {
    activeState() {
      if (store.state.activeState == 'game') {
        let asteroidDataNum;
        if (store.state.asteroidGroup === 0 || store.state.asteroidGroup > 5) {
          asteroidDataNum = Math.floor(Math.random() * 5) + 1;
        } else {
          asteroidDataNum = store.state.asteroidGroup;
        }
        asteroidData = asteroidDataArray[asteroidDataNum].asteroids;
        gameAsteroidContainer.classList.remove('hide');
      } else {
        if (gameTimeline.length > 0) {
          this.cleanUpAsteroids();
        }
        gameAsteroidContainer.classList.add('hide');
      }
    },
    gameState() {
      if (gameTimeline.length > 0 && store.state.gameState == 'playing') {
        masterTimeline.play(null, false);
      } else if (store.state.gameState == 'error') {
        if (!masterTimeline.paused()) {
          masterTimeline.pause(null, false);
        }
      } else {
        this.gameAsteroidBuilder();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#game-asteroids {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 30;

  #game-asteroids-container {
    height: 100%;
    opacity: 1;
    transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
    width: 100%;

    .asteroid {
      display: none;
    }

    .asteroid.show {
      display: block;
    }

    &.hide {
      opacity: 0;
      transition: opacity 0s cubic-bezier(.7, 0, .3, 1) 0s;
    }
  }

  #game-collisions {
    .block-wrapper {
      opacity: .75;
    }

    .hit-wrapper,
    .block-wrapper {
      height: 5.8333333333333vw;
      position: absolute;
      width: 5.8333333333333vw;

      svg {
        height: 5.8333333333333vw;
        width: 5.8333333333333vw;
      }
    }

    #collision-hit-1,
    #collision-block-1 {
      top: 41.6666666666667vw;
      transform: rotate(180deg);
    }

    #collision-hit-1 {
      left: 18.4375vw;
    }

    #collision-block-1 {
      left: 16.40625vw;
    }

    #collision-hit-2,
    #collision-block-2 {
      transform: rotate(197deg);
    }

    #collision-hit-2 {
      left: 24.0625vw;
      top: 34.1666666666667vw;
    }

    #collision-block-2 {
      left: 21.8229166666667vw;
      top: 33.28125vw;
    }

    #collision-hit-3,
    #collision-block-3 {
      transform: rotate(190deg);
    }

    #collision-hit-3 {
      left: 25.4166666666667vw;
      top: 26.25vw;
    }

    #collision-block-3 {
      left: 23.0208333333333vw;
      top: 26.1458333333333vw;
    }

    #collision-hit-4,
    #collision-block-4 {
      transform: rotate(-90deg);
    }

    #collision-hit-4 {
      left: 30.4166666666667vw;
      top: 18.1770833333333vw;
    }

    #collision-block-4 {
      left: 30.4166666666667vw;
      top: 15vw;
    }

    #collision-hit-5,
    #collision-block-5 {
      transform: rotate(-10deg);
    }

    #collision-hit-5 {
      left: 35.3645833333333vw;
      top: 26.25vw;
    }

    #collision-block-5 {
      left: 37.6041666666667vw;
      top: 26.1458333333333vw;
    }

    #collision-hit-6,
    #collision-block-6 {
      transform: rotate(-17deg);
    }

    #collision-hit-6 {
      left: 36.9791666666667vw;
      top: 34.1666666666667vw;
    }

    #collision-block-6 {
      left: 39.1145833333333vw;
      top: 33.28125vw;
    }

    #collision-hit-7,
    #collision-block-7 {
      top: 41.6666666666667vw;
    }

    #collision-hit-7 {
      left: 42.3958333333333vw;
    }

    #collision-block-7 {
      left: 44.375vw;
    }
  }
}
</style>
