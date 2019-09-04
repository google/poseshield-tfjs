<template>
  <div id="game-canvas-countdown">
    <span>{{ gameCountDownToPlay }}</span>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';

export default {
  name: 'game-canvas-countdown',
  computed: {
    ...mapState([
      'gameCountDownToPlay',
    ]),
  },
  mounted() {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-countdown {
  align-content: center;
  background-image: url('~@/assets/images/countdown-background-2x.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  height: 8.4375vw;
  justify-content: center;
  left: 0;
  margin: 0 auto;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 35.3645833333333vw;
  width: 8.4375vw;
  z-index: 100;

  span {
    font-size: 6.25vw;
    font-weight: 400;
    line-height: 8.4375vw;
    margin: 0;
  }
}
</style>
