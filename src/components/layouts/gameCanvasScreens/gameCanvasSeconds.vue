<template>
  <div id="game-canvas-seconds">
    <div class="title">
      <p>Seconds to clear</p>
    </div>
    <div class="timer">
      <span v-if="gameTimeCountDown == 60">01:00</span>
      <span v-else-if="gameTimeCountDown >= 10">
        00:{{ gameTimeCountDown }}
      </span>
      <span v-else-if="gameTimeCountDown >= 0">
        00:0{{ gameTimeCountDown }}</span>
      <span v-else>00:00</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';

export default {
  name: 'game-canvas-seconds',
  computed: {
    ...mapState([
      'gameTimeCountDown',
    ]),
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-seconds {
  align-items: center;
  display: flex;
  justify-content: space-between;
  left: 0;
  position: absolute;
  top: 18.333333vw;
  width: 12.5vw;

  .title {
    width: 3.6458333333333vw;

    p {
      font-size: .625vw;
      font-weight: 700;
      letter-spacing: .01em;
      line-height: .75vw;
      text-transform: uppercase;
    }
  }

  .timer {
    font-size: 1.875vw;
    line-height: 2.25vw;
  }
}
</style>
