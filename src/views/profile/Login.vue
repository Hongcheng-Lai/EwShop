<template>
<div>
  <nav-bar>
    <template v-slot:default>用户登录</template>
  </nav-bar>

  <div class="content">
    <van-image
        width="70%"
        height="autp"
        src="https://www.capturingreality.com/img/logo.png"
    />
  </div>

  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="email"
          name="电子邮箱"
          label="电子邮箱"
          placeholder="电子邮箱"
          :rules="[{ required: true, message: '请填写电子邮箱' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />

    </van-cell-group>
    <div style="margin: 16px;">
      <div class="link-register" @click="$router.push({path:'/register'})">没有账号，立即注册</div>
      <van-button round block type="primary" native-type="submit" color="#44b883">
        提交
      </van-button>
    </div>
  </van-form>
</div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import {reactive, ref, toRefs} from "vue";
import {login} from "../../network/user";
import { Notify, Toast } from 'vant';
import { useRouter } from "vue-router";
import {useStore} from 'vuex'

export default {
  name: "Login",
  components: {
    NavBar,
  },
  setup() {
    const userinfo = reactive({
      email: '',
      password: '',
    })
    const router = useRouter()
    const store = useStore()

    const onSubmit = (values) => {
      login(userinfo).then(res => {
        console.log(123)
        // 将token保存到本地，window.localStorage  setItem(key, value)  getItem(key)
        window.localStorage.setItem('token', res.access_token)
        // 在vuex中设置isLogin
        store.commit('setIsLogin', true)

        Toast.success('登录成功~~~')
        userinfo.email = ''
        userinfo.password = ''

        setTimeout(() => {
          router.go(-1)
        }, 300)
      })
    };

    return {
      ...toRefs(userinfo),
      onSubmit,
    };
  }
}
</script>

<style scoped>
.content {
  margin-top: 100px;
  margin-bottom: 30px;
}

.link-register {
  margin-bottom: 10px;
  color: var(--color-tint);
}
</style>