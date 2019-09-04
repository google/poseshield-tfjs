<template>
  <div id="right-panel"
    :activeState="activeState"
    :gameState="gameState"
  >
    <message-screen></message-screen>
    <share-panel></share-panel>
    <error-icons></error-icons>
    <skeletal-tracking-canvas></skeletal-tracking-canvas>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import messageScreen from
  '@/components/layouts/rightPanelScreens/messageScreen.vue';
import sharePanel from
  '@/components/layouts/rightPanelScreens/sharePanel.vue';
import errorIcons from
  '@/components/layouts/rightPanelScreens/errorIcons.vue';
import skeletalTrackingCanvas from
  '@/components/layouts/rightPanelScreens/skeletalTrackingCanvas.vue';

export default {
  name: 'rightPanel',
  components: {
    messageScreen,
    sharePanel,
    errorIcons,
    skeletalTrackingCanvas,
  },
  computed: {
    ...mapState(['activeState', 'gameState']),
  },
  method: {
  },
};
</script>

<style lang="scss">
#right-panel {
  height: 100%;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  width: 33.333%;

  .message-block {
    bottom: 0;
    display: block;
    height: inherit;
    left: 0;
    margin: auto;
    opacity: 0;
    padding: 2.08vw 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    transition: opacity .4s cubic-bezier(.4, 0, .4, 1) 0s;
    width: 100%;
  }

  &[activestate='no-video'],
  &[activestate='generic-error'] {
    div#skeletal-tracking-canvas-screen {
      opacity: 0;
      pointer-events: none;
    }

    div#share-panel {
      opacity: 0;
      pointer-events: none;
    }

    div#error-icons {
      opacity: 1;
    }
  }

  &[activestate='share'] {
    div#skeletal-tracking-canvas-screen {
      opacity: 0;
      pointer-events: none;
    }

    div#share-panel {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
