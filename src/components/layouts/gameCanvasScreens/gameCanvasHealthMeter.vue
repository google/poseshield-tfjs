<template>
  <div id="game-canvas-health-meter">
    <healthMeter/>
  </div>
</template>

<script>

let healthScore = 100;
let healthScoreText;
let healthScoreBar;
let healthScoreBarWidth;
const healthScoreBarWidthMax = 218;

// @ is an alias to /src
import {mapState} from 'vuex';
import store from '@/store';
import healthMeter from '@/assets/svgs/health-meter.svg';

export default {
  name: 'game-canvas-health-meter',
  components: {
    healthMeter,
  },
  mounted() {
    healthScoreText = document.getElementById('health-percentage');
    healthScoreText.textContent = healthScore + '%';

    healthScoreBar = document.getElementById('hm-clip-path');
  },
  computed: mapState([
    'gameScore',
  ]),
  watch: {
    gameScore: () => {
      healthScore = Math.round(store.state.gameScore * 100);
      healthScoreText.textContent = healthScore + '%';

      healthScoreBarWidth = store.state.gameScore * healthScoreBarWidthMax;
      healthScoreBar.style.width = healthScoreBarWidth;
    },
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-health-meter {
  bottom: 1.354166667vw;
  left: 0;
  position: absolute;

  #health-meter {
    height: 3.6802083333333vw;
    width: 15.8520833333333vw;

    #hm-clip-path {
      height: 38px;
      transform: skewX(-15.55deg);
      transition: width .2s cubic-bezier(.7, 0, .3, 1) 0s;
      width: 218px;
      x: 87px;
      y: 13px;
    }

    #health-percentage {
      fill: $navy;
      font-family: 'Roboto Mono', monospace;
      font-style: italic;
      font-weight: 500;
      text-align: right;
      width: 2.4479166666667vw;
    }

    #health-title {
      fill: $white;
      font-family: 'Roboto Mono', monospace;
      font-style: italic;
      font-weight: 700;
      letter-spacing: .1em;
    }

    .cls-1 {
      fill: none;
    }

    .cls-2 {
      fill: url('#Gradient_Orange');
    }

    .cls-3 {
      fill: $navy;
      font-size: 1.0416666666667vw;
      font-style: italic;
      font-weight: 500;
    }

    .cls-3,
    .cls-4 {
      font-style: italic;
    }

    .cls-4 {
      font-size: .7526041666667vw;
      font-weight: 700;
      letter-spacing: .1em;
    }

    .cls-4,
    .cls-7,
    .cls-9 {
      fill: $white;
    }

    .cls-5 {
      letter-spacing: -.02em;
    }

    .cls-6 {
      letter-spacing: .1em;
    }

    .cls-7 {
      opacity: .25;
    }
  }
}
</style>
