<template>
  <div id="no-video" class="message message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('no-video.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('no-video.body')"></p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'no-video',
};
</script>

<style lang="scss" scoped>
</style>
