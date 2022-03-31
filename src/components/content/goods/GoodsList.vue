<template>
<div class="goods">
  <goods-list-item v-for="item in goods" :key="item" :product="item"></goods-list-item>

</div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";

export default {
  name: "GoodsList",
  components: {
    GoodsListItem,
  },
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap; /* 让弹性盒元素在必要的时候拆行 */
  justify-content: space-around;
  padding: 5px;
}
</style>