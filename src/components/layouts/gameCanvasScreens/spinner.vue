<template>
  <div id="spinner" :activeState="activeState" :gameState="gameState">
    <div class="pause-block">
      <div class="bar one"></div>
      <div class="bar two"></div>
    </div>
    <spinnerSVG />
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import store from '@/store';
import spinnerSVG from '@/assets/svgs/spinner.svg';

export default {
  name: 'spinner',
  components: {
    spinnerSVG,
  },
  computed: {
    ...mapState(['activeState', 'gameState']),
  },
  mounted() {
    const rootSelector = document.querySelector(':root');
    const timeoutAsSeconds = (store.state.globalTimeout/1000);

    rootSelector.style.setProperty('--timeout', timeoutAsSeconds+'s');
  },
};
</script>

<style lang="scss">
@mixin root-prop($prop: null, $value: null) {
  @if ($prop and $value) {
    #{$prop}: $value;
  }
}

:root {
  @include root-prop(--timeout, 15s);
}

#spinner {
  align-items: center;
  background-color: $rbga-navy-mostly;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;

  .pause-block {
    height: 2.34375vw;
    opacity: 0;
    position: absolute;
    width: 1.875vw;
    z-index: 100;

    .bar {
      background: $white;
      height: 100%;
      position: absolute;
      width: .6770833333333vw;
    }

    .one {
      left: 0;
    }

    .two {
      right: 0;
    }
  }

  svg {
    height: 5.8333333333333vw;
    transform: rotate(-90deg);
    width: 5.8333333333333vw;
    z-index: 0;

    .progress-meter,
    .progress-value {
      fill: none;
      stroke: $white;
      stroke-miterlimit: 10;
      stroke-width: 12px;
    }

    .progress-meter {
      opacity: .25;
    }

    .progress-value {
      stroke-dasharray: 316.673;
      stroke-dashoffset: -316.673;
    }
  }

  &[activeState='share'],
  &[gameState='error'] {
    .progress-value {
      animation: dash var(--timeout) linear forwards;
      animation-delay: 0s;
    }
  }

  &[gameState='error'] {
    .pause-block {
      opacity: 1;
    }
  }
}

@keyframes dash {
  from {
    stroke-dashoffset: 316.673;
  }

  to {
    stroke-dashoffset: 0;
  }
}
</style>
