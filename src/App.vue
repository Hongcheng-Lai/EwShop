<template>
<!--  <router-view></router-view>-->

  <router-view v-slot="{ Component }">
      <keep-alive :include="keepAliveComponents">
        <component :is="Component"/>
      </keep-alive>
  </router-view>

  <div id="nav">
    <router-link to="/" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-shouyeshouye"></i></div>
      <div>首页</div>
    </router-link>

    <router-link to="/category" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-fenlei"></i></div>
      <div>分类</div>
    </router-link>

    <router-link to="/shopcart" class="tab-bar-item">
      <div class="icon">
        <van-badge :content="$store.state.cartCount" max="9">
          <i class="iconfont icon-gouwuche"></i>
        </van-badge>
      </div>
      <div>购物车</div>
    </router-link>

    <router-link to="/profile" class="tab-bar-item">
      <div class="icon"><i class="iconfont icon-wode"></i></div>
      <div>我的</div>
    </router-link>
  </div>
</template>

<script>
import {onMounted} from "vue";
import {useStore} from "vuex";

export default {
  components: {

  },
  setup() {
    const store = useStore()
    const keepAliveComponents = ['Home', 'Category', 'Profile']

    onMounted(() => {
      store.dispatch('updataCart')
    })

    return {
      keepAliveComponents
    }
  }
}
</script>

<style lang="scss">
@import "assets/css/base.css";
@import "assets/css/iconfont.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#nav {
  background-color: #f6f6f6;
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -3px 3px rgb(100, 100, 100, 0.1);

  a {
    color: var(--color-text);

    &.router-link-exact-active {
      color: #42b983;
    }
  }

  .tab-bar-item {
    flex: 1;
    height: 50px;
    font-size: var(--font-size);

    .icon {
      display: inline-block;
      height: 24px;
      margin-top: 6px;
      vertical-align: center;
    }
  }
}
</style>
