<template>
<div>
  <nav-bar>
    <template #default>购物车(<span>{{$store.state.cartCount}}</span>)</template>
  </nav-bar>
  <div class="cart-box">
    <div class="cart-body">
      <van-checkbox-group ref="checkboxGroup" v-model="result" @change="groupChange">
        <van-swipe-cell :right-width="50"
          v-for="(item, index) in list" :key="index"
        >
          <div class="good-item">
            <van-checkbox :name="item.id"></van-checkbox>
            <div class="good-des">
              <img :src="item.goods.cover_url" alt="">
              <div class="good-title">{{ item.goods.title }}</div>
              <div class="good-price">￥{{item.goods.price + '.00'}}</div>
              <div class="good-num">x{{item.goods.stock}}</div>
              <div class="good-btn">
                <van-stepper min="0" :max="item.goods.stock" :model-value="item.num"
                  :name="item.id" async-change @change="onChange"
                />
              </div>
            </div>
          </div>
          <template #right>
            <van-button square type="danger" text="删除"
                        class="delete-button" @click="deleteGood(item.id)"/>
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar :price="total * 100" button-text="提交订单" @submit="onSubmit">
      <van-checkbox v-model:checked="checkAll" @click="allCheck">全选</van-checkbox>
    </van-submit-bar>
  </div>

  <div class="empty" v-if="!list.length">
    <img src="~assets/images/empty-car.png" alt="空购物车·">
    <div>购物车空空如也</div>
    <van-button round type="primary" @click="goTo">前往选购</van-button>
  </div>
</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {ref, reactive, toRefs, onMounted, computed} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {Toast} from "vant";
import {getCart, deleteCartItem, checkedCard, modifyCart} from "../../network/cart";

export default {
  name: "ShopCart",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      list: [],
      result: [],
      checkAll: true,
    })

    // 初始化购物车
    const init = () => {
      Toast.loading({
        message: '加载中。。。',
        forbidClick: true,
      })

      getCart('include=goods').then(res => {
        state.list = res.data;
        // console.log(res.data);

        state.result = res.data.filter(item => item.is_checked == 1).map(item => item.id);
        Toast.clear();
      })
    }

    onMounted(() => {
      init();
    })

    // 异步改变购物车数量
    const onChange = (value, detail) => {
      Toast.loading({message: '修改中。。。', forbidClick: true});
      modifyCart(detail.name, {num: value}).then(res => {
        // 服务器修改完，客户端也要修改
        state.list.forEach(item => {
          if (item.id == detail.name) {
            item.num = value;
          }
        })
        Toast.clear();
      })
    }

    // 复选框改变处理
    const groupChange = (result) => {
      // 根据选中商品数量来判断全选按钮是否选中
      if (result.length == state.list.length) {
        state.checkAll = true
      } else {
        state.checkAll = false
      }
      // console.log(result);
      // 改变客户端的数据
      state.result = result;
      // 改变服务端的数据
      checkedCard({cart_ids: result})
    }

    // 全选处理
    const allCheck = () => {
      if (!state.checkAll) {
        state.checkAll = true
        state.result = state.list.map(item => item.id)

      } else {
        state.result = []
        state.checkAll = false
      }
    }

    // 删除商品
    const deleteGood = (id) => {
      deleteCartItem(id).then(res => {
        init(); // 重新初始化数据
        store.dispatch('updataCart') // 改变 vuex 中的状态数量
      })
    }

    // 通过计算属性 计算总价
    const total = computed(() => {
      let sum = 0

      state.list.filter(item => state.result.includes(item.id))
            .forEach(item => {
              sum += parseInt(item.num) * parseFloat(item.goods.price)
            })

      return sum
    })

    // 创建订单
    const onSubmit = () => {
      if (state.result.length == 0) {
        Toast.fail('请选择商品进行结算！')
        return
      } else {
        router.push('/createorder')
      }
    }
    // 购物车为空处理
    const goTo = () => {
      router.push('/home')
    }

    return {
      ...toRefs(state),
      goTo,
      onChange,
      groupChange,
      allCheck,
      deleteGood,
      total,
      onSubmit
    }
  }
}
</script>

<style scoped lang="scss">
.cart-box {
  margin-top: 48px;

  .van-submit-bar {
    margin-bottom: 53px;
  }

  .van-swipe-cell {
    .good-item {
      width: 100%;
      height: 90px;
      //background-color: greenyellow;
      position: relative;

      .van-checkbox {
        position: absolute;
        left: 0;
        display: inline-block;
        width: 10%;
        height: 100%;
        padding-top: 40px;
        padding-left: 2%;
      }

      .good-des {
        position: absolute;
        left: 38px;
        display: inline-block;
        width: 90%;
        height: 100%;

        img {
          height: 100%;
          padding: 5px 0;
          position: absolute;
          left: 0;
        }

        .good-title {
          display: inline-block;
          position: absolute;
          top: 10px;
          left: 100px;
          color: var(--color-text);
        }

        .good-price {
          display: inline-block;
          position: absolute;
          left: 100px;
          bottom: 10px;
          color: red;
        }

        .good-num {
          display: inline-block;
          position: absolute;
          right: 10px;
          top: 10px;
          color: var(--color-text);
        }

        .good-btn {
          position: absolute;
          right: 10px;
          bottom: 10px;
        }
      }
    }

    .delete-button {
      height: 100%;
      margin-left: 1px;
    }
  }
}

.empty {
  img {
    width: 200px;
  }
}
</style>