<template>
<div class="goods-item" @click="itemClick">
  <img v-lazy="product.cover_url" alt="">
  <div class="goods-info">
    <p>{{ product.title }}</p>
    <span class="price"><small>￥{{ product.price }}</small></span>
    <span class="collect">{{ product.collects_count}}</span>
  </div>
</div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "GoodsListItem",
  props: {
    product: {
      product: Object,
      default() {
        return {}
      }
    }
  },
  setup(props) {
    const router = useRouter()

    return {
      itemClick: () => {
        console.log(props.product.id)
        router.push({path: '/detail', query: {id: props.product.id}})
      }
    }
  }
}
</script>

<style scoped lang="scss">
.goods-item {
  width: 46%;
  padding-bottom: 40px;
  position: relative;
  img {
    width: 100%;
    border-radius: 5px;
  }
  .goods-info {
    font-size: var(--font-size);
    position: absolute;
    left: 0;
    right: 0;
    overflow: hidden;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;  /* 规定段落中的文本不进行换行 */
      margin-bottom: 2px;
    }
    .price {
      color: red;
      margin-right: 20px;
    }
    .collect {
      position: relative;
    }
    .collect::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 14px;
      height: 14px;
      background: url('~assets/images/collection.png') 0 0 /14px 14px;
    }
  }
}
</style>