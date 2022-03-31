<template>
<div>
  <nav-bar>
    <template #default>商品详情:{{ id }}</template>
  </nav-bar>

  <van-image
      style="margin-top: 45px"
      width="90%"
      :src="detail.cover_url"
      lazy-load
  />

  <van-card
      style="text-align: left"
      :num="detail.stock"
      :price="detail.price+'.00'"
      :desc="detail.description"
      :title="detail.title"
  >
    <template #tags>
      <van-tag plain type="danger">新书</van-tag>
      <van-tag plain type="danger">推荐</van-tag>
    </template>
    <template #footer>
      <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
      <van-button type="danger" @click="goToCart">立即购买</van-button>
    </template>
  </van-card>

  <van-tabs v-model:active="active" sticky offset-top="45px">
    <van-tab title="概述">
      <div class="content" v-html="detail.details" style="width: 100vw; height: auto"></div>
    </van-tab>
    <van-tab title="热评">
      <div v-for="item in detail.comments" :key="item">{{ item }}</div>
    </van-tab>
    <van-tab title="相关图书">
      <goods-list :goods="like_goods"></goods-list>
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import { useRoute, useRouter } from 'vue-router'
import {onMounted, reactive, ref, toRefs} from "vue";
import {getDetail} from "../../network/detail";
import GoodsList from "../../components/content/goods/GoodsList";
import {addCart} from "../../network/cart";
import {Toast} from "vant";
import {useStore} from "vuex";

export default {
  name: "Detail",
  components: {
    NavBar,
    GoodsList,
  },
  setup() {
    const active = ref(0);
    const route = useRoute();
    const router = useRouter();
    const store = useStore()

    let id = ref(0)
    let book = reactive({
      detail: {},
      like_goods: []
    })

    onMounted(() => {
      id.value = route.query.id
      getDetail(id.value).then(res => {
        book.detail = res.goods
        book.like_goods = res.like_goods
        console.log(res)
      })
    })

    // 添加购物车
    const handleAddCart = () => {
      addCart({
        goods_id: book.detail.id,
        num: 1
      }).then(res => {
        console.log(res.status)
        if (res.status == 201 || res.status == 204) {
          Toast.success('添加成功~~~')
          // 设置store中 cartCount
          store.dispatch('updataCart')
        }
      })
    }

    // 立即购买
    const goToCart = () => {
      addCart({
        goods_id: book.detail.id,
        num: 1
      }).then(res => {
        console.log(res.status)
        if (res.status == 201 || res.status == 204) {
          Toast.success('添加成功，转到购物车~~~')
          // 设置store中 cartCount
          store.dispatch('updataCart')
          router.push('/shopcart')
        }
      })
    }
    return {
      id,
      ...toRefs(book),
      active,
      handleAddCart,
      goToCart,
    }
  }
}
</script>

<style scoped lang="scss">
.van-tabs {
  margin-bottom: 50px;
}

::v-deep .content img {
  width: 100%;
  height: auto;
}
</style>