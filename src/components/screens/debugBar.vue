<template>
  <div id="debug-bar"
    :debugBar="debugBar"
  >
    <div>
      <h3>Application State: {{ activeState }}</h3>
      <h3>Game State: {{ gameState }}</h3>
    </div>
    <div>
      <h3>Has Person: {{ hasPerson }}</h3>
      <h3>Pose Activated: {{ poseActivated }}</h3>
      <h3>Calibrated: {{ calibrated }}</h3>
    </div>
    <div>
      <h3>Game Completed: {{ gameCompleted }}</h3>
      <h3>Game Rank {{ gameRank }}</h3>
      <h3>Game Score {{ gameScore }}</h3>
    </div>
    <div>
      <h3>Asteroid Counter {{ asteroidCounter }}</h3>
      <h3>Asteroid Hits {{ asteroidHits }}</h3>
      <h3>Asteroid Blocks {{ asteroidBlocks }}</h3>
    </div>
    <div>
      <h3>Zone One {{ zoneDetectedOne }}</h3>
      <h3>Zone Two {{ zoneDetectedTwo }}</h3>
      <h3>Zone Three {{ zoneDetectedThree }}</h3>
      <h3>Zone Four {{ zoneDetectedFour }}</h3>
    </div>
    <div>
      <h3>Zone Five {{ zoneDetectedFive }}</h3>
      <h3>Zone Six {{ zoneDetectedSix }}</h3>
      <h3>Zone Seven {{ zoneDetectedSeven }}</h3>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import Stats from 'stats.js';
const stats = new Stats();
stats.showPanel( 0 );

export default {
  name: 'debug-bar',
  computed: {
    ...mapState(
        [
          'activeState',
          'gameState',
          'hasPerson',
          'poseActivated',
          'calibrated',
          'gameCompleted',
          'videoFeed',
          'debugBar',
          'zoneDetectedOne',
          'zoneDetectedTwo',
          'zoneDetectedThree',
          'zoneDetectedFour',
          'zoneDetectedFive',
          'zoneDetectedSix',
          'zoneDetectedSeven',
          'gameRank',
          'gameScore',
          'asteroidCounter',
          'asteroidHits',
          'asteroidBlocks',
        ]),
  },
  mounted() {
    document.getElementById('debug-bar').appendChild( stats.dom );

    /**
     * Setting up the stats animation loop to update FPS Panel and calculate FPS
     */
    function animate() {
      stats.begin();
      stats.end();
      requestAnimationFrame( animate );
    }
    requestAnimationFrame( animate );
  },
};
</script>

<!-- eslint-disable max-len -->
<style lang="scss">
#debug-bar {
  align-content: center;
  background-color: $white;
  bottom: -.9259259259259vh;
  color: $black;
  display: flex;
  height: 5.2083333333333vw;
  justify-content: space-around;
  left: 0;
  opacity: 0;
  padding: .5208333333333vw;
  pointer-events: none;
  position: absolute;
  transition: opacity .75s cubic-bezier(.7, 0, .3, 1) 0s, bottom .75s cubic-bezier(.7, 0, .3, 1) 0s;
  width: 100%;
  z-index: 1000;

  h3 {
    font-size: .625vw;
    margin: 0 0 .2604166666667vw;
    padding: 0;
  }

  &[debugBar='true'] {
    bottom: 0;
    opacity: 1;
  }
}
</style>
