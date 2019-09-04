<template>
  <div id="game-canvas-shields"
    :zoneDetectedOne="zoneDetectedOne"
    :zoneDetectedTwo="zoneDetectedTwo"
    :zoneDetectedThree="zoneDetectedThree"
    :zoneDetectedFour="zoneDetectedFour"
    :zoneDetectedFive="zoneDetectedFive"
    :zoneDetectedSix="zoneDetectedSix"
    :zoneDetectedSeven="zoneDetectedSeven"
  >
    <shields />
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import shields from '@/assets/svgs/shields-off.svg';

export default {
  name: 'game-canvas',
  components: {
    shields,
  },
  computed: mapState([
    'zoneDetectedOne',
    'zoneDetectedTwo',
    'zoneDetectedThree',
    'zoneDetectedFour',
    'zoneDetectedFive',
    'zoneDetectedSix',
    'zoneDetectedSeven',
  ]),
};
</script>

<style lang="scss" scoped>

#game-canvas-shields {
  display: block;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;

  #shields {
    height: 29.21875vw;
    left: 0;
    margin: 0 auto;
    position: absolute;
    right: 0;
    top: 19.6875vw;
    width: 24.5833vw;

    #Shields,
    #Shields image {
      opacity: 1;
    }

    .cls-1 {
      isolation: isolate;
    }

    .cls-2,
    .cls-3 {
      opacity: 1;
    }

    .cls-3 {
      mix-blend-mode: screen;
    }

    .cls-4 {
      fill: $shields-light-orange;
      opacity: .25;
      transition: opacity .25s cubic-bezier(.7, 0, .3, 1) 0s;
    }

    .cls-5 {
      fill: $shields-dark-orange;
    }
  }

  &[zoneDetectedOne='true'] {
    #Left_3 {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedTwo='true'] {
    #Left_2 {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedThree='true'] {
    #Left_1 {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedFour='true'] {
    #Top {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedFive='true'] {
    #Right_1 {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedSix='true'] {
    #Right_2 {
      .cls-4 {
        opacity: 1;
      }
    }
  }

  &[zoneDetectedSeven='true'] {
    #Right_3 {
      .cls-4 {
        opacity: 1;
      }
    }
  }
}
</style>
