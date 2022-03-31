<template>
<!--  -->
  <van-swipe v-show="banners.length" class="my-swipe" :autoplay="3000" indicator-color="#42b983" lazy-render>
    <van-swipe-item v-for="(item, index) in banners" :key="index">
      <img :src="item.img_url" alt="">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>