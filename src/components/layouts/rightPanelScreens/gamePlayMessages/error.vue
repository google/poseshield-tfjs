<template>
  <div id="error" class="game-messages message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('error.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('error.body')"></p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'error',
};
</script>

<style lang="scss" scoped>
</style>
