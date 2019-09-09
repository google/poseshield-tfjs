<template>
  <div id="message-screen"
    :activeState="activeState"
    :gameState="gameState"
  >
    <div class="message-wrapper">
      <attract></attract>
      <calibration></calibration>
      <error></error>
      <posenet-data></posenet-data>
      <share></share>
      <no-video></no-video>
      <generic-error></generic-error>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import error from
  '@/components/layouts/rightPanelScreens/gamePlayMessages/error.vue';
import posenetData from
  '@/components/layouts/rightPanelScreens/gamePlayMessages/posenetData.vue';
import share from
  '@/components/layouts/rightPanelScreens/stateMessages/share.vue';
import calibration from
  '@/components/layouts/rightPanelScreens/stateMessages/calibration.vue';
import attract from
  '@/components/layouts/rightPanelScreens/stateMessages/attract.vue';
import noVideo from
  '@/components/layouts/rightPanelScreens/stateMessages/noVideo.vue';
import genericError from
  '@/components/layouts/rightPanelScreens/stateMessages/genericError.vue';

export default {
  name: 'message-screen',
  components: {
    calibration,
    attract,
    error,
    posenetData,
    share,
    noVideo,
    genericError,
  },
  computed: {
    ...mapState(['activeState', 'gameState']),
  },
  mounted() {
  },
  watch: {
  },
};
</script>

<style lang="scss">
#message-screen {
  height: 40.75%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;

  .message-wrapper {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 100%;
  }

  div.debugger-data {
    bottom: 0;
    display: block;
    height: auto;
    left: 0;
    position: absolute;
  }

  .title-wrapper {
    display: inline-block;
    position: relative;
    width: auto;

    h1 {
      display: inline-block;
    }
  }

  .underline-wrapper {
    bottom: .8335vw;
    height: .2604166666667vw;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  }

  .underline {
    background: $shields-dark-orange;
    bottom: 0;
    height: .2604166666667vw;
    opacity: 0;
    position: absolute;
    transform: translateX(-100%);
    width: 100%;
  }

  &[activestate='attract'] {
    div#attract {
      opacity: 1;

      .underline {
        animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
        animation-delay: .5s;
        opacity: 1;
      }
    }
  }

  &[activestate='calibration'] {
    div#calibration {
      opacity: 1;

      .underline {
        animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
        animation-delay: .5s;
        opacity: 1;
      }
    }
  }

  &[activestate='share'] {
    div#share {
      opacity: 1;

      .underline {
        animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
        animation-delay: .5s;
        opacity: 1;
      }
    }
  }

  &[activestate='game'] {
    &[gamestate='playing'],
    &[gamestate='countdown'] {
      div#posenet-data {
        opacity: 1;
      }
    }

    &[gamestate='error'] {
      div#error {
        opacity: 1;

        .underline {
          animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
          animation-delay: .5s;
          opacity: 1;
        }
      }
    }
  }

  &[activestate='no-video'] {
    div#no-video {
      opacity: 1;

      .underline {
        animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
        animation-delay: .5s;
        opacity: 1;
      }
    }
  }

  &[activestate='generic-error'] {
    div#generic-error {
      opacity: 1;

      .underline {
        animation: lineInOut .4s cubic-bezier(.4, 0, .4, 1) forwards 1;
        animation-delay: .5s;
        opacity: 1;
      }
    }
  }
}

@keyframes lineInOut {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
