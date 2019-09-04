<template>
  <div id="share-panel">
    <badge></badge>
    <share-link></share-link>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import badge from
  '@/components/layouts/rightPanelScreens/sharePanels/badge.vue';
import shareLink from
  '@/components/layouts/rightPanelScreens/sharePanels/shareLink.vue';

export default {
  name: 'share-panel',
  components: {
    badge,
    shareLink,
  },
  computed: {
    ...mapState([
      'gameScore',
      'asteroidHits',
      'asteroidCounter',
    ]),
  },
};
</script>

<style lang="scss">
#share-panel {
  bottom: 0;
  display: block;
  height: 59.25%;
  left: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
  width: 100%;
  z-index: 0;
}
</style>
