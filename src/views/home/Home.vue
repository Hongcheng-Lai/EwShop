<template>
<div id="home">
  <nav-bar>
    <template #default>首页</template>
  </nav-bar>

  <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

  <div class="wrapper">
    <div class="content">
      <div ref="banref">
        <home-swiper :banners="banners" ></home-swiper>

        <recommend-view :recommends="recommends"></recommend-view>
      </div>

      <tab-control @tabClick="tabClick" :titles="['畅销', '新书', '精选']"></tab-control>

      <goods-list :goods="showGoods"></goods-list>
    </div>
  </div>

  <back-top v-show="isBackTopShow" @backTop="backTop"></back-top>

</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import {getHomeAllData, getHomeGoods} from "../../network/home";
import {onMounted, computed, ref, reactive, nextTick, watchEffect} from "vue";
import TabControl from "../../components/content/tabControl/TabControl";
import GoodsList from "../../components/content/goods/GoodsList";
import BScroll from 'better-scroll'
import BackTop from "../../components/common/backtop/BackTop";
// import PullUp from '@better-scroll/pull-up'

// BScroll.use(PullUp)

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    TabControl,
    GoodsList,
    BackTop,
  },
  setup() {
    let isTabFixed = ref(false)
    let isBackTopShow = ref(false)
    let banref = ref(null)
    const recommends = ref([])
    // 商品列表数据模型
    const goods = reactive({
      sales: {page: 0, list: []},
      recommend: {page: 0, list: []},
      new: {page: 0, list: []}
    })
    let currentType = ref('sales')
    const showGoods = computed(() => goods[currentType.value].list)
    let bscroll = reactive({})
    let banners = ref([])

    const tabClick = (index) => {
      let types = ['sales', 'new', 'recommend']
      currentType.value = types[index]

      nextTick(() => {
        bscroll && bscroll.refresh()
      })
    }

    // 获取首页推荐商品的数据
    onMounted(() => {
      getHomeAllData().then(res => {
        recommends.value = res.goods.data
        banners.value = res.slides
        // console.log(res.slides)
      })

      getHomeGoods('sales').then(res => {
        goods.sales.list = res.goods.data
      })
      getHomeGoods('recommend').then(res => {
        goods.recommend.list = res.goods.data
      })
      getHomeGoods('new').then(res => {
        goods.new.list = res.goods.data
      })

      bscroll = new BScroll(document.querySelector('.wrapper'),{
        // scrollY: true,
        click: true,
        probeType: 3,
        pullUpLoad: true,
      })

      // console.log(banref.value)
      // 触发滚动事件
      bscroll.on('scroll', (position) => {
        // console.log(banref.value.offsetHeight)
        // console.log(position.y)
        isBackTopShow.value = isTabFixed.value = -position.y > banref.value.offsetHeight
      })

      // 上拉加载数据，触发 pullingup 事件
      bscroll.on('pullingUp', () => {
        const page = goods[currentType.value].page + 1

        getHomeGoods(currentType.value, page).then( res => {
          goods[currentType.value].list.push(...res.goods.data)
          goods[currentType.value].page++
        })

        bscroll.finishPullUp()

        // 重新计算高度
        bscroll.refresh()
        // console.log('contentHeight: '+document.querySelector('.content').clientHeight)
        // console.log('当前类型：'+ currentType.value + ' 当前页：' + page)
      })
    })

    const backTop = () => {
      bscroll.scrollTo(0, 0, 500)
    }

    // 监听 任何一个变量有变动
    watchEffect(()=>{
      nextTick(()=>{
        // 重新计算高度
        bscroll &&  bscroll.refresh();
      })
    })

    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isTabFixed,
      isBackTopShow,
      banref,
      backTop,
      banners,
    }
  },
}
</script>

<style scoped>
.banners img {
  width: 100%;
  height: auto;
  /*margin-top: 45px;*/
}

#home {
  position: relative;
  height: 100vh;
}

.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
}
</style>