<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  /*  背景*/
  #app{
    background-image: url("../public/bg.jpeg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
</style>
