<template>
<div class="nav-bar">
  <div class="left" @click="goback">
      <img src="~assets/images/left.png" alt="">
  </div>
  <div class="center"><slot>EwShop</slot></div>
  <div class="right"><slot name="right"></slot></div>
</div>
</template>

<script>
import {useRouter} from 'vue-router'

export default {
  name: "NavBar",
  setup() {
    const router = useRouter();

    const goback = () => {
      router.go(-1);
    }

    return {
      goback
    }
  },
}
</script>

<style scoped lang="scss">
.nav-bar {
  display: flex;
  background-color: var(--color-tint);
  color: #ffffff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
  height: 45px;
  width: 100%;
  line-height: 45px;
  box-shadow: 0 3px 3px rgba(100, 100, 100, 0.4);

  .left, .right {
    width: 60px;
  }
  .center { flex: 1 }

  .left img {
    width: 45px;
    padding: 12px;
  }
}
</style>