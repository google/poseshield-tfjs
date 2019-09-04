<template>
  <div id="badge" :gameRank="gameRank">
    <div class="badge-left">
      <div class="patch"></div>
    </div>
    <div class="badge-right">
      <div class="badge-dots">
        <rankBar id="rank-bar"/>
      </div>
      <div class="badge-rank">
        <h2>{{ $t('ranks.level') }}</h2>
        <h1 v-if="gameRank === 'first'">{{ $t('ranks.first') }}</h1>
        <h1 v-else-if="gameRank === 'second'">{{ $t('ranks.second') }}</h1>
        <h1 v-else-if="gameRank === 'third'">{{ $t('ranks.third') }}</h1>
        <h1 v-else-if="gameRank === 'fourth'">{{ $t('ranks.fourth') }}</h1>
      </div>
      <div class="asteroids-blocked">
        <h2>{{ $t('asteroids-blocked') }}</h2>
        <span class="blocked">{{ asteroidBlocksText }}</span>
        <span class="slash">/</span>
        <span class="total">{{ asteroidTotalCount }}</span>
      </div>
    </div>
    <scoreCard />
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import rankBar from '@/assets/svgs/rank-bar.svg';
import scoreCard from '@/assets/svgs/score-card-bg.svg';

export default {
  name: 'badge',
  components: {
    scoreCard,
    rankBar,
  },
  mounted() {
  },
  computed: {
    ...mapState([
      'gameScore',
      'gameRank',
      'asteroidBlocksText',
      'asteroidTotalCount',
    ]),
  },
};

</script>

<style lang="scss" scoped>
#badge {
  display: flex;
  height: 16.9270833333333vw;
  justify-content: space-between;
  left: 1.5625vw;
  position: absolute;
  top: 0;
  width: 29.583333vw;

  .badge-left {
    display: block;
    height: 16.9270833333333vw;
    width: 16.9270833333333vw;
    z-index: 10;

    .patch {
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      height: 16.9270833333333vw;
      width: 16.9270833333333vw;
    }
  }

  .badge-right {
    display: block;
    height: 16.9791vw;
    position: relative;
    width: 11.0416666666667vw;
    z-index: 10;

    h2 {
      color: $share-navy;
      font-size: .8135416666667vw;
      font-weight: 400;
      margin: 0;
      text-transform: uppercase;
    }

    .badge-dots {
      height: .8333333333333vw;
      margin: 2.0833333333333vw 0 2.0833333333333vw -.2083333333333vw;
      position: relative;
      width: 7.7083333333333vw;

      #rank-bar {
        height: .8333333333333vw;
        left: 0;
        position: absolute;
        top: 0;
        width: 7.7083333333333vw;
      }

      .node-center,
      .track {
        fill: $share-navy;
      }

      .node-active-indicator {
        opacity: 0;
        stroke: $share-navy;
      }
    }

    .badge-rank {
      h1 {
        color: $share-navy;
        font-size: 1.354vw;
        font-weight: 500;
        letter-spacing: -.02em;
        line-height: 2.509375vw;
        text-transform: uppercase;
      }
    }

    .asteroids-blocked {
      position: relative;

      span {
        color: $share-navy;
        font-size: 2.6432291666667vw;
        font-style: italic;
        font-weight: 500;
        letter-spacing: -.04em;
        position: absolute;
        text-transform: uppercase;

        &.blocked {
          left: 0;
          top: 1.0416666666667vw;
        }

        &.slash {
          font-size: 3.3890625vw;
          left: 2.2916666666667vw;
          top: 1.1458333333333vw;
        }

        &.total {
          left: 3.8541666666667vw;
          top: 2.0833333333333vw;

        }
      }
    }
  }

  svg {
    height: 16.9270833333333vw;
    position: absolute;
    right: 0;
    top: 0;
    width: 21.4208246415936vw;
    z-index: 0;

    .cls-1 {
      fill: url('#Gradient_Orange');
    }
  }

  &[gameRank='first'] {
    .node-active-indicator.first {
      opacity: 1;
    }

    .patch {
      background-image: url('~@/assets/images/badge-first.png');
    }
  }

  &[gameRank='second'] {
    .node-active-indicator.second {
      opacity: 1;
    }

    .patch {
      background-image: url('~@/assets/images/badge-second.png');
    }
  }

  &[gameRank='third'] {
    .node-active-indicator.third {
      opacity: 1;
    }

    .patch {
      background-image: url('~@/assets/images/badge-third.png');
    }
  }

  &[gameRank='fourth'] {
    .node-active-indicator.fourth {
      opacity: 1;
    }

    .patch {
      background-image: url('~@/assets/images/badge-fourth.png');
    }
  }
}
</style>
