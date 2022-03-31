<template>
<div class="create-order">
  <NavBar>
    <template #default>订单预览</template>
  </NavBar>

  <div class="address-box">
    <div class="address">
      <div class="name-phone">{{ address.name }}&nbsp;{{ address.phone }}</div>
      <div class="address-detail">{{address.province}} {{address.city}} {{address.county}} {{address.address}}</div>
    </div>
    <div class="left" @click="goTo">
      <van-icon name="arrow"></van-icon>
    </div>
  </div>

  <div class="good-box" >
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <img v-lazy="item.goods.cover_url" alt="">
        <div class="title">{{item.goods.title}}</div>
        <div class="num">x{{item.num}}</div>
        <div class="price">￥{{item.goods.price + '.00'}}</div>
      </div>
  </div>

  <van-submit-bar :price="total * 100" button-text="生成订单" @submit="handleCreateOrder">
    商品金额
  </van-submit-bar>

  <van-popup
      v-model:show="showPay"
      position="bottom"
      closeable
      @close="close"
  >
    <van-grid :border="false" :column-num="2">
      <van-grid-item>
        支付宝二维码 <br>
        <van-image :src="aliyun" width="120"/>
      </van-grid-item>
      <van-grid-item>
        微信二维码 <br>
        <van-image :src="wechat" width="120"/>
      </van-grid-item>

    </van-grid>
<!--    <div class="pay">-->
<!--      <van-button class="aLiPay" type="primary" block>支付宝支付</van-button>-->
<!--      <van-button class="weChatPay" type="primary" block>微信支付</van-button>-->
<!--    </div>-->
  </van-popup>
</div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import {getOrderPreview, createOrder, payOrder, orderStatus} from "../../network/order";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, toRefs} from "vue";
import {Toast} from "vant";
import {useStore} from "vuex";

export default {
  name: "CreateOrder",
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      cartList: [],
      address: {},
      showPay: false,
      orderId: '',
      aliyun: '',
      wechat: '',
    })

    const init = () => {
      Toast.loading({message: '加载中。。。', forbidClick: true});

      getOrderPreview().then(res => {
        let address = res.address.filter(n => n.is_default == 1)
        console.log(res)

        if (address.length == 0) {
          state.address = {
            address: '还没设置默认地址，请选择或者填写地址信息'
          }
        } else {
          state.address = address[0]
        }

        state.cartList = res.carts

        Toast.clear()
      })
    }

    const goTo = () => {
      router.push('/address')
    }

    const handleCreateOrder = () => {
      const params = {
        address_id: state.address.id
      }

      createOrder(params).then(res => {
        Toast('创建订单成功')
        store.dispatch('updataCart')
        state.showPay = true
        state.orderId = res.id

        payOrder(state.orderId, {type: 'aliyun'}).then(res => {
          state.aliyun = res.qr_code_url
          state.wechat = res.qr_code_url
        })
        console.log(res)
      })
    }

    const total = computed(() => {
      let sum = 0
      state.cartList.forEach(item =>
          sum += parseInt(item.num) * parseFloat(item.goods.price)
      )

      return sum
    })

    const close = () => {

    }

    // 轮循查看订单状态
    const timer = setInterval(() => {
      orderStatus(state.orderId).then(res => {
        console.log(res)
        if (res == 2) {
          clearInterval(timer)
          router.push({path: '/order', query: {status: 2}})
        }
      })
    }, 2000)

    onMounted(() => {
      init()
    })

    return {
      ...toRefs(state),
      goTo,
      total,
      handleCreateOrder,
      close
    }
  }
}
</script>

<style scoped lang="scss">
.create-order {
  margin-top: 47px;
  margin-bottom: 53px;
  //background-color: #f7f8fa;
  width: 100%;
  height: 100%;

  .address-box {
    height: 90px;
    //background-color: greenyellow;
    position: relative;
    border-bottom: 2px solid skyblue;

    .address {
      display: inline-block;
      width: 90%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      font-size: var(--font-size);

      .name-phone {
        position: absolute;
        top: 24px;
        left: 12px;
        text-align: left;
      }
      .address-detail {
        position: absolute;
        top: 44px;
        left: 12px;
        text-align: left;
      }
    }

    .left {
      display: inline-block;
      width: 10%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;

      .van-icon {
        position: absolute;
        right: 12px;
        top: 36px;
      }
    }
  }

  .good-box {
    margin-top: 30px;

    .good-item {
      height: 120px;
      position: relative;

      img {
        display: inline-block;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      .title {
        display: inline-block;
        position: absolute;
        left: 130px;
        top: 20px;
      }

      .num {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 20px;
      }

      .price {
        display: inline-block;
        position: absolute;
        left: 130px;
        bottom: 20px;
        color: red;
      }
    }

  }

  .van-submit-bar {
    margin-bottom: 53px;
  }

  .pay {
    width: 90%;
    margin: 0 auto;
    padding: 50px 0;

    .weChatPay {
      margin-top: 10px;
      background-color: #4fc08d;
    }
  }
}
</style>