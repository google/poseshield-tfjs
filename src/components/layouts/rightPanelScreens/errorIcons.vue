<template>
  <div id="error-icons" :noVideo="noVideo">
    <noVid id="no-video-icon" v-if="noVideo === true"></noVid>
    <genericError
      id="generic-error-icon"
      v-if="errorState === true"
    ></genericError>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import noVid from '@/assets/svgs/no-video-icon.svg';
import genericError from '@/assets/svgs/generic-error-icon.svg';

export default {
  name: 'error-icons',
  components: {
    noVid,
    genericError,
  },
  computed: {
    ...mapState([
      'noVideo',
      'errorState',
    ]),
  },
};
</script>

<style lang="scss">
#error-icons {
  align-content: center;
  border-top: 1px solid $dark-blue;
  bottom: 0;
  display: flex;
  height: 59.25%;
  justify-content: center;
  left: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  transition: opacity .5s cubic-bezier(.7, 0, .3, 1) 0s;
  width: 100%;
  z-index: 0;

  #no-video-icon,
  #generic-error-icon {
    bottom: 0;
    display: block;
    height: 5.18125vw;
    margin: auto 0;
    position: absolute;
    top: 0;
    width: 5.18125vw;

    .cls-1 {
      fill: none;
      stroke: $white;
      stroke-width: 2.43px;
    }

    .cls-2 {
      fill: $white;
    }
  }
}
</style>
