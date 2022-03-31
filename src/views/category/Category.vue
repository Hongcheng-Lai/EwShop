<template>
<div>
  <nav-bar>
    <template #default>商品分类</template>
  </nav-bar>

  <div id="mainbox">
    <div class="ordertab" >
      <van-tabs v-model:active="activeTab" @click-tab="tabClick">
        <van-tab title="销量排序"></van-tab>
        <van-tab title="价格排序"></van-tab>
        <van-tab title="评论排序"></van-tab>

      </van-tabs>
    </div>

    <van-sidebar class="leftmenu" v-model="active" >
      <van-collapse v-model="activeName" accordion>
          <van-collapse-item v-for="item in categories" :key="item.id" :title="item.name" :name="item.id">
            <van-sidebar-item v-for="sub in item.children" :key="sub.id"
                              :title="sub.name" @click="getGoods(sub.id)" />
          </van-collapse-item>
      </van-collapse>
    </van-sidebar>


    <div class="goodslist">
      <div class="content">
        <van-card v-for="item in showGoods" :key="item.id"
            :num="item.comments_count"
            :price="item.price"
            :desc="item.updated_at	"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load=true
            @click="itemClick(item.id)"
        />
      </div>
    </div>

    <back-top @backTop="backTop" v-show="isShowBackTop"></back-top>
  </div>
</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {ref, reactive, onMounted, computed, watchEffect, nextTick} from "vue";
import { getCategory, getCategoryGoods } from "../../network/category";
import BScroll from 'better-scroll';
import BackTop from "../../components/common/backtop/BackTop";
import { useRouter } from "vue-router";

export default {
  name: "Category",
  components: {
    NavBar,
    BackTop,
  },
  setup() {
    const router = useRouter()
    let isShowBackTop = ref(false)
    let active = ref(0)
    let activeName = ref(0)
    let activeTab = ref(0)
    let categories = ref([])
    let currentOrder = ref('sales')   // 当前排序的条件
    let currentCid = ref(0)     // 当前分类的ID
    // 数据模型
    const goods = reactive({
      sales: {page: 1, list: []},
      price: {page: 1, list: []},
      comments_count: {page: 1, list: []}
    })
    const showGoods = computed(() => {
      return goods[currentOrder.value].list
    })
    const init = () => {
      getCategoryGoods('sales', currentCid.value).then(res => {
        goods.sales.list = res.goods.data
      })
      getCategoryGoods('price', currentCid.value).then(res => {
        goods.price.list = res.goods.data
      })
      getCategoryGoods('comments_count', currentCid.value).then(res => {
        goods.comments_count.list = res.goods.data
      })
    }

    let bscroll = reactive({});
    onMounted(() => {
      getCategory().then((res) => {
        categories.value = res.categories
        // console.log(res)
      })

      getCategoryGoods('sales', currentCid.value).then(res => {
        goods.sales.list = res.goods.data
      })

      // 创建BetterScroll对象
      bscroll = new BScroll(document.querySelector('.goodslist'), {
        probeType: 3,  // 0, 1, 2, 3, 3 只要在运运就触发scroll事件
        click: true, // 是否允许点击
        pullUpLoad: true //上拉加载更多， 默认是false
      })

      bscroll.on('scroll', position => {
        isShowBackTop.value = -position.y > 300
      })

      bscroll.on("pullingUp", ()=>{
        // console.log('上拉加载更多。。。')
        const page = goods[currentOrder.value].page + 1
        getCategoryGoods(currentOrder.value, currentCid.value, page).then(res => {
          goods[currentOrder.value].list.push(...res.goods.data)
          goods[currentOrder.value].page++
        })

        // 完成上拉， 等数据请求完成， 要将新数据展示出来
        bscroll.finishPullUp();

        //重新计算高度
        nextTick(() => {
          // 重新计算高度
          bscroll && bscroll.refresh();
        })

        // console.log("contentheight:"+document.querySelector('.content').clientHeight);
        // console.log('当前类型：'+ currentOrder.value + ' 当前页：' + page)
      })
    })

    // 排序方式
    const tabClick = ({name}) => {
      let orders = ['sales', 'price', 'comments_count']
      currentOrder.value = orders[name]

      getCategoryGoods(currentOrder.value, currentCid.value).then(res => {
        goods[currentOrder.value].list = res.goods.data

        nextTick(() => {
          // 重新计算高度
          bscroll && bscroll.refresh();
        })
      })

      // console.log('当前分类id：'+currentCid.value)
      // console.log('排序的序号：'+currentOrder.value)
    }

    // 通过分类 get 商品
    const getGoods = (cid) => {
      currentCid.value = cid
      init()
      console.log('当前分类id：'+currentCid.value)
      console.log('排序的序号：'+currentOrder.value)
    }

    const backTop = () => {
      bscroll.scrollTo(0, 0, 500)
    }

    // 监听 任何一个变量有变动
    watchEffect(()=> {
      nextTick(() => {
        // 重新计算高度
        bscroll && bscroll.refresh();
      })
    })

    return {
      isShowBackTop,
      active,
      categories,
      activeName,
      activeTab,
      tabClick,
      currentOrder,
      currentCid,
      getGoods,
      showGoods,
      backTop,
      itemClick: id => {
        console.log(id)
        router.push({path: '/detail', query: {id}})
      }
    }
  }
}
</script>

<style scoped lang="scss">
#mainbox {
  position: relative;
  margin-top: 45px;
  .ordertab {
    position: fixed;
    top: 45px;
    left: 30vw;
    right: 0;
    height: 50px;
    z-index: 9;
    //background-color: skyblue;
  }

  .leftmenu {
    position: fixed;
    right: 70vw;
    left: 0;
    top: 95px;
    width: 30vw;
    //background-color: greenyellow;
  }

  .goodslist {
    position: absolute;
    top: 50px;
    left: 30vw;
    right: 0;
    height: 100vh;
    //background-color: gray;
    .content {

    }
  }
}

/*#mainbox {
  margin-top: 45px;
  display: flex;
  .ordertab {
    position: fixed;
    left: 33.33%;
    top: 45px;
    width: 66.66%;
    height: 50px;
    //background-color: red;
  }

  .leftmenu {
    margin-top: 50px;
    flex: 1;
    background-color: green;
  }

  .goodslist {
    margin-top: 50px;
    height: 100vh;
    flex: 2;
    //background-color: blue;
  }
}*/
</style>