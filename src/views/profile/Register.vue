<template>
<div>
  <nav-bar>
    <template v-slot:default>用户注册</template>
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
          v-model="name"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
          v-model="password_confirmation"
          type="password"
          name="确认密码"
          label="确认密码"
          placeholder="确认密码"
          :rules="[{ required: true, message: '请确认密码' }]"
      />
      <van-field
          v-model="email"
          name="电子邮箱"
          label="电子邮箱"
          placeholder="电子邮箱"
          :rules="[{ required: true, message: '请填写电子邮箱' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <div class="link-login" @click="$router.push({path:'/login'})">已有账号，立即登录</div>
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
import {register} from "../../network/user";
import { Notify, Toast } from 'vant';
import { useRouter } from "vue-router";

export default {
  name: "Register",
  components: {
    NavBar,
  },
  setup() {
    const userinfo = reactive({
      name: '',
      password: '',
      password_confirmation: '',
      email: ''
    })
    const router = useRouter()

    const onSubmit = (values) => {
      if (userinfo.password != userinfo.password_confirmation) {
        console.log(values)
        Notify('两次密码不一致！')
      } else {
        register(userinfo).then(res => {
          /*lhc
          123456
          lhc1@qq.com*/
          if (res.status == '201') {
            Toast.success('注册成功~~~')

            setTimeout(() => {
              router.push({ path: '/login'})
            }, 1000)

            userinfo.password = ''
            userinfo.password_confirmation = ''
          }
        })
      }
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

.link-login {
  margin-bottom: 10px;
  color: var(--color-tint);
}
</style>