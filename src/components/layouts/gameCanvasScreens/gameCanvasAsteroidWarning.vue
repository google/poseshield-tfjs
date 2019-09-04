<template>
  <div id="game-canvas-asteroid-warning">
    <asteroidWarning />
  </div>
</template>

<script>
// @ is an alias to /src
import asteroidWarning from '@/assets/svgs/asteroid-warning.svg';

export default {
  name: 'game-canvas-asteroid-warning',
  components: {
    asteroidWarning,
  },
  mounted() {
  },
  watch: {
  },
};
</script>

<style lang="scss" scoped>
#game-canvas-asteroid-warning {
  left: 0;
  position: absolute;
  top: 2.08333vw;

  svg {
    height: 2.65625vw;
    width: 12.5692708333333vw;

    .cls-1 {
      font-family: 'Roboto Mono', monospace;
      font-weight: 700;
      letter-spacing: .1em;
    }

    .cls-1,
    .cls-2 {
      fill: $white;
    }
  }

  &.incoming {
    .exclamation {
      fill: $shields-light-orange;
    }
  }
}
</style>
