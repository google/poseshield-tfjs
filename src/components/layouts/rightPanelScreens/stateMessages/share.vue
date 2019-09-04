<template>
  <div id="share" class="message message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('share.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('share.body')"></p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'share',
};
</script>

<style lang="scss" scoped>
</style>
