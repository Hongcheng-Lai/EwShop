<template>
<div class="address">
  <NavBar>
    <template #default>地址管理</template>
  </NavBar>

  <div class="address-item">
    <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
    />
  </div>
</div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import {onMounted, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getAddressList} from "../../network/address";

export default {
  name: "Address",
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      chosenAddressId: '1',
      list: []
    })

    const onAdd = () => {
      router.push({
        path: '/addressedit',
        query: { type: 'add'}
      })
    }
    const onEdit = (item) => {
      router.push({
        path: '/addressedit',
        query: { type: 'edit', addressId: item.id }
      })
    }

    onMounted(() => {
      getAddressList().then(res => {
        console.log(res)
        state.list = res.data.length ? res.data.map(item => {
          return {
            id: item.id,
            name: item.name,
            tel: item.phone,
            address: `${item.province}${item.city}${item.county}${item.address}`,
            isDefault: !!item.is_default
          }
        }) : []
      })
    })

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
    };
  }
}
</script>

<style scoped lang="scss">
.address {
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;

  .address-item {
    margin-top: 47px;
    margin-bottom: 50px;
  }
}

::v-deep .van-address-list__bottom {
  bottom: 53px;
  background-color: #f7f8fa;

  .van-button {
    background-color: var(--color-tint);
    border: none;
  }
}
</style>