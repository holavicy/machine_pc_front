<template>
  <a-breadcrumb class="bread-crumb">
    <a-breadcrumb-item
      v-for="item in breadCrumb"
      :key="item.path"
      :href="item.path"
      ><span @click="handlerClick(item.path)">{{
        item.title
      }}</span></a-breadcrumb-item
    >
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      breadCrumb: [],
    };
  },
  // 修改写法
  watch: {
    "$route.path": {
      immediate: true,
      handler() {
        this.getBreadCrumbData();
      },
    },
  },
  methods: {
    getBreadCrumbData() {
      let breadCrumb = [];
      let meta = this.$route.meta;

      if (meta.breadCrumb) {
        breadCrumb = meta.breadCrumb;
      } else {
        const paths = this.$route.matched;
        paths.forEach((element) => {
          if (element.meta.title) {
            const newItem = {
              title: element.meta.title,
              path: element.redirect ? element.redirect : element.path,
            };
            breadCrumb.push(newItem);
          }
        });
      }
      this.breadCrumb = breadCrumb;
    },
    handlerClick(path) {
      console.log(path);
      this.$router.push(path);
    },
  },
};
</script>
<style scoped>
.bread-crumb {
  height: 40px;
  line-height: 40px;
  background-color: #ffffff;
}
</style>
