<template>
  <div class="container">
    <VirtualList :listData="articles" :size='200'>

    </VirtualList>
  </div>
</template>

<script>
import VirtualList from '~/components/VirtualList.vue'
export default {
  data() {
    return {
      articles: []
    }
  },
  async mounted() {
    let ret = await this.$http.get('/article')
    if (ret.code == 0) {
      this.articles = ret.data
    }
  },
  components: {
    VirtualList
  }
}
</script>
