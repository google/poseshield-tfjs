<template>
  <div id="share-link">
    <div class="share-code"
      v-if="share_qr === true"
    ></div>
    <div class="share-text"
      :share_qr="share_qr"
      v-if="share_link === true || share_qr === true"
    >
      <div class="share-text-wrapper">
        <p class="tiny">{{ $t('share.share-text') }}</p>
        <a v-if="share_link === true" :href="$t('share.share-url')"
          target="_blank"
          :alt="$t('share.share-link')"
          class="tiny">
          {{ $t('share.share-link') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import {mapState} from 'vuex';
import QRCode from 'qrcode';
import store from '@/store';
import * as textData from '@/locales/en.json';

export default {
  name: 'share-link',
  computed: {
    ...mapState([
      'activeState',
      'gameScore',
      'gameCompleted',
      'asteroidHits',
      'asteroidCounter',
      'share_qr',
      'share_link',
    ]),
  },
  watch: {
    activeState() {
      if (store.state.gameCompleted && store.state.share_qr) {
        const qrCodeDiv = document.querySelector('.share-code');
        const url = this.createTweetURL();
        this.createQRCode(qrCodeDiv, url);
      }
    },
  },
  methods: {
    createTweetText() {
      const tweetText = 'web-text';
      let text = textData.share[tweetText];
      text = text.replace(/<score>/g, store.state.asteroidBlocksText);
      const rank = textData.ranks[store.state.gameRank];
      text = text.replace(/<rank>/g, rank);
      return text;
    },
    createTweetURL() {
      // create text
      let text = encodeURIComponent(this.createTweetText());
      text = '?text='.concat(text);
      // create hashtags
      let hashtag = textData.share['tweet-hashtag'];
      hashtag = encodeURIComponent(hashtag);
      hashtag = '&hashtags='.concat(hashtag);
      const baseURL = 'https://twitter.com/intent/tweet';

      return baseURL.concat(text, hashtag);
    },
    createQRCode(selector, url) {
      QRCode.toDataURL(url, (err, url) => {
        selector.style.background =
          ('url('.concat(url)).concat(')');
        selector.style.backgroundSize = 'contain';
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#share-link {
  align-content: center;
  bottom: 0;
  display: flex;
  height: 8.0208vw;
  justify-content: space-between;
  left: 0;
  margin: 0 2.083vw 2.083vw;
  position: absolute;
  width: 100%;

  .share-code {
    display: block;
    height: 8.0208vw;
    position: relative;
    width: 8.0208vw;
    z-index: 0;
  }

  .share-text {
    display: flex;
    flex-direction: column;
    height: inherit;
    margin-left: -2.083vw;
    position: relative;
    text-align: center;
    width: 100%;
    z-index: 1;

    .share-text-wrapper {
      margin: auto 0;

      p,
      a {
        text-transform: uppercase;
      }

      a {
        color: $white;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &[share_qr='true'] {
      margin-left: 0;
      text-align: left;
      width: 23.6448216666667vw;
    }
  }
}
</style>
