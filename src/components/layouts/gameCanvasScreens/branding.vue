<template>
  <div id="branding">
    <poseshieldLogo id="poseshield-logo" />
    <div class="tensorflow-wrapper">
      <div class="tf-logo-wrapper">
        <a :href="$t('links.tensorflow.url')"
          target="_blank"
          :alt="$t('links.tensorflow.link')"
        ><tensorflowLogo /></a>
      </div>
      <p class="tiny">Built with
        <a :href="$t('links.tensorflow.url')"
          target="_blank"
          :alt="$t('links.tensorflow.link')"
        >{{ $t('links.tensorflow.link') }}</a>
        <span class="plus"> + </span>
        <a :href="$t('links.posenet.url')"
          target="_blank"
          :alt="$t('links.posenet.link')"
        >{{ $t('links.posenet.link') }}</a>
       </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import poseshieldLogo from '@/assets/svgs/logo.svg';
import tensorflowLogo from '@/assets/svgs/tensorflow-logo.svg';

export default {
  name: 'branding',
  components: {
    poseshieldLogo,
    tensorflowLogo,
  },
};
</script>

<style lang="scss" >
#branding {
  #poseshield-logo {
    left: -.6vw;
    position: absolute;
    top: 1.2vw;
    width: 16.9791666666667vw;

    .cls-1 {
      isolation: isolate;
    }

    .cls-2 {
      fill: $white;
    }

    .cls-3 {
      fill: url('#linear-gradient');
    }

    .cls-4 {
      fill: url('#linear-gradient-2');
    }

    .cls-5 {
      fill: url('#linear-gradient-3');
    }

    .cls-6 {
      fill: url('#linear-gradient-4');
    }

    .cls-7 {
      fill: url('#linear-gradient-5');
    }

    .cls-8 {
      fill: url('#linear-gradient-6');
    }

    .cls-9 {
      fill: url('#linear-gradient-7');
    }

    .cls-10 {
      fill: url('#linear-gradient-8');
    }

    .cls-11 {
      fill: url('#linear-gradient-9');
    }

    .cls-12 {
      fill: url('#linear-gradient-10');
    }

    .cls-13 {
      mix-blend-mode: screen;
    }

    .cls-14 {
      fill: none;
      stroke: url('#Gradient_Orange');
      stroke-miterlimit: 10;
    }

  }

  .tensorflow-wrapper {
    bottom: 2.0833333333333vw;
    left: 0;
    position: absolute;

    p {
      margin-top: .5208333333333vw;

      a,
      span {
        line-height: 1.376vw;
      }

      a {
        color: $white;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .tf-logo-wrapper {
      height: 2.1975vw;
      width: 11.3541666666667vw;
    }

    #tensorflow-logo {
      .cls-1 {
        fill: none;
      }

      .cls-2 {
        clip-path: url('#clip-path');
      }

      .cls-3 {
        fill: $white;
      }

      .cls-4 {
        clip-path: url('#clip-path-2');
      }
    }
  }
}
</style>
