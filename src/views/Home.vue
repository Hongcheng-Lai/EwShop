<template>
  <div class="home">
  </div>
</template>

<script>
import {getHomeAllData} from "../network/home";
import {onMounted} from "vue";

export default {
  setup() {
    onMounted(()=>{
      getHomeAllData().then((res)=>{
        console.log(res.slides)
      }).catch((err)=>{

      })
    })
  },
  name: 'Home',
  components: {
  }
}
</script>
