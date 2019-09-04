<template>
  <div id="attract" class="message message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('attract.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('attract.body')"></p>
  </div>
</template>

<script>

export default {
  name: 'attract',
};
</script>

<style lang="scss" scoped>
</style>
