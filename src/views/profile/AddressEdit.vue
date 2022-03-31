<template>
<div class="address-edit-box">
  <NavBar>
    <template #default>{{ title }}</template>
  </NavBar>

  <van-address-edit
      :area-list="areaList"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :address-info="addressInfo"
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
  />
</div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, toRefs} from "vue";
import {addAddress, editAddress, deleteAddress, getAddressDetail} from "../../network/address";
import {tdist} from "../../utils/address";
import {Toast} from "vant";

export default {
  name: "AddressEdit",
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const state = reactive({
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      searchResult: [],
      addressInfo: {},
      type: 'add',
      addressId: '',
      title: ''
    })

    onMounted(() => {
      // 省市区列表
      let _province_list = {}
      let _city_list = {}
      let _county_list = {}

      tdist.getLev1().forEach(p => {
        _province_list[p.id] = p.text
        tdist.getLev2(p.id).forEach(c => {
          _city_list[c.id] = c.text
          tdist.getLev3(c.id).forEach(y => {
            _county_list[y.id] = y.text
          })
        })
      })
      state.areaList.province_list = _province_list
      state.areaList.city_list = _city_list
      state.areaList.county_list = _county_list

      // 接收参数
      const {type, addressId} = route.query
      state.type = type
      state.addressId = addressId
      state.title = state.type == 'add' ? '新增地址' : '编辑地址'

      // 编辑内容
      if (type == 'edit') {
        getAddressDetail(addressId).then(res => {
          let _areaCode = ''
          const province = tdist.getLev1()

          Object.entries(state.areaList.county_list).forEach(([id, text]) => {
            // 先找出当前对应的区
            if (text == res.county) {
              // 找到区对应的几个省份
              const provinceIndex = province.findIndex(item => item.id.substr(0, 2) == id.substr(0, 2))
              // 找到区对应的几个市区
              // eslint-disable-next-line no-unused-vars
              const cityItem = Object.entries(state.areaList.city_list).filter(([cityId, city]) => cityId.substr(0, 4) == id.substr(0, 4))[0]
              // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
              if (province[provinceIndex].text == res.province && cityItem[1] == res.city) {
                _areaCode = id
              }
            }
          })
          state.addressInfo = {
            name: res.name,
            tel: res.phone,
            province: res.province,
            city: res.city,
            county: res.county,
            addressDetail: res.address,
            isDefault: !!res.is_default,
            areaCode: _areaCode
          }
        })
      }
    })

    // const title = computed(() => {
    //   return state.type == 'add' ? '新增地址' : '编辑地址'
    // })

    const onSave = (content) => {
      console.log(content)
      // 接口请求参数
      const params = {
        name: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0
      }

      // 调用接口
      if (state.type == 'edit') {
        // 修改地址
        editAddress(state.addressId, params)
      } else {
        // 保存地址
        addAddress(params)
      }

      // 提示保存成功，返回
      Toast('保存成功~~~')
      setTimeout(() => {
        router.back()

      }, 1000)
    }

    const onDelete = () => {
      deleteAddress(state.addressId).then(res => {
        Toast('删除成功~~~')
        setTimeout(() => {
          router.back()
        }, 1000)
      })
    }

    return {
      ...toRefs(state),
      onSave,
      onDelete,
    }
  }
}
</script>

<style scoped lang="scss">
.address-edit-box {
  margin-top: 45px;
  background-color: #f7f8fa;
  height: 100%;

  ::v-deep .van-button--danger {
    background-color: var(--color-tint);
    border: none;
  }
}
</style>