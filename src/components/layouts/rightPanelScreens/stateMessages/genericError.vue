<template>
  <div id="generic-error" class="message message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('generic-error.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('generic-error.body')"></p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'generic-error',
};
</script>

<style lang="scss" scoped>
</style>
