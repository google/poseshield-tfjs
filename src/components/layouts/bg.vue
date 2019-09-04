<template>
  <div id="bg">
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'bg',
};
</script>

<style lang="scss">
#bg {
  background-image: url('../../assets/images/background-2x.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}
</style>
