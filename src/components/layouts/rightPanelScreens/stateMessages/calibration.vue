<template>
  <div id="calibration" class="message message-block">
    <div class="title-wrapper">
      <h1 v-html="$t('calibration.title')"></h1>
      <div class="underline-wrapper">
        <div class="underline"></div>
      </div>
    </div>
    <p v-html="$t('calibration.body')"></p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'calibration',
};
</script>

<style lang="scss" scoped>
</style>
