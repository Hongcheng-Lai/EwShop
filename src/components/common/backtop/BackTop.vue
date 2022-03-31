<template>
<div class="backTop" @click="backTop"></div>
</template>

<script>
export default {
  name: "BackTop",
  setup(props, { emit }) {
    return {
      backTop: () => {
        emit('backTop')
      }
    }
  }
}
</script>

<style scoped>
.backTop {
  width: 40px;
  height: 40px;
  box-shadow: 5px 5px 5px #888888;
  border-radius: 50%;
  background: url('~assets/images/up.png') no-repeat center/100% #fafafa;
  position: fixed;
  right: 30px;
  bottom: 80px;
}
</style>