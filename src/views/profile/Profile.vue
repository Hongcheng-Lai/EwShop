<template>
<div class="profile">
  <nav-bar>
    <template #default>个人中心</template>
  </nav-bar>

  <div class="user-box">
    <div class="user-info">
      <div class="info">
        <img :src="user.avatar_url" alt="">
        <div class="desc">
          <span>昵称：{{ user.name }}</span>
          <span>登录名：{{ user.email }}</span>
        </div>
      </div>
    </div>
    <div class="user-list">
      <van-cell title="我的收藏" is-link to="/collect" />
      <van-cell title="我的订单" is-link to="/order" />
      <van-cell title="账号管理" is-link to="/setting" />
      <van-cell title="地址管理" is-link to="/address" />
      <van-cell title="关于我们" is-link to="/about" />
    </div>
  </div>

  <div style="margin: 30px 10px 0">
    <van-button @click="tologout" round block color="#44ba80">退出登录</van-button>
  </div>
</div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import {logout, getUser} from "../../network/user";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "Profile",
  components: {
    NavBar,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      user: {}
    })

    onMounted(() => {
      getUser().then(res => {
        console.log(res)
        state.user = res
      })
    })

    const tologout = () => {
      logout().then(res => {
        if (res.status == 204) {
          Toast.success('退出成功~~~')

          // 清除token
          window.localStorage.setItem('token', '')
          store.commit('setIsLogin', false)

          setTimeout(() => {
            router.push('/login')
          },300)
        }
      })
    }

    return {
      tologout,
      ...toRefs(state)
    }
  }
}
</script>

<style scoped lang="scss">
.profile {
  background-color: #f7f8fa;
  height: 100%;
  .user-box {
    margin-top: 48px;

    .user-info {
      width: 90%;
      height: 120px;
      border-radius: 5px;
      background-color: #42B9B9;
      box-shadow: 3px 3px 2px #969896;
      margin: 0 auto 30px;
      position: relative;

      img {
        width: 80px;
        position: absolute;
        left: 20px;
        top: 20px;
      }

      .desc {
        position: absolute;
        left: 120px;
        top: 35px;
        color: #f7f8fa;

        span {
          display: block;
          margin-bottom: 10px;
          text-align: left;
        }
      }
    }

    .user-list {
      .van-cell {
        margin-bottom: 15px;
        color: var(--color-text);
      }
    }
  }
}

</style>