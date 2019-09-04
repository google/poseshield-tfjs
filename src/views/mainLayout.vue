<template>
  <div id="main" v-bind="{ activeState }">
    <right-panel></right-panel>
    <game-canvas></game-canvas>
  </div>
</template>

<script>

// @ is an alias to /src
import {mapState} from 'vuex';
import rightPanel from '@/components/layouts/rightPanel.vue';
import gameCanvas from '@/components/layouts/gameCanvas.vue';

export default {
  name: 'main-layout',
  components: {
    rightPanel,
    gameCanvas,
  },
  computed: mapState(['activeState']),
};

</script>

<style lang="scss">
#main {
  display: block;
  height: 100%;
  left: 0;
  pointer-events: all;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
}
</style>
