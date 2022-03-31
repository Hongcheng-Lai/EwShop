<template>
<div class="tab-control">
  <div class="tab-control-item" v-for="(item, index) in titles" :key="index"
      @click="itemClick(index)" :class="{active: index == currentIndex}">
    <span>{{ item }}</span>
  </div>
</div>
</template>

<script>
import {ref} from "vue";
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, {emit}) {
    let currentIndex = ref(0)

    const itemClick = (index) => {
      emit('tabClick', index)
      currentIndex.value = index
    }

    return {
      currentIndex,
      itemClick,
    }
  }
}
</script>

<style scoped lang="scss">
.tab-control {
  display: flex;
  height: 40px;
  width: 100%;
  line-height: 40px;
  background-color: yellow;
  position: sticky;
  top: 45px;
  font-size: var(--font-size);
  z-index: 9;

  .tab-control-item {
    flex: 1;
    span {
      padding: 5px;
    }
  }

  .active {
    color: var(--color-tint);
    span {
      border-bottom: 3px solid var(--color-tint);
    }
  }
}
</style>