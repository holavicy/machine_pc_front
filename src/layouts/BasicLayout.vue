<template>
  <a-layout id="basic-layout" style="min-height: 100vh">
    <a-layout-header class="header">
      <div>设备管理系统</div>
      <div>{{ name }}</div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider theme="light" v-model="collapsed" collapsible>
        <a-affix :offset-top="top">
          <SiderMenu />
        </a-affix>
      </a-layout-sider>
      <a-layout>
        <a-layout-content class="content">
          <a-affix :offset-top="top">
            <BreadCrumb />
            <a-divider />
          </a-affix>

          <div class="router-view">
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer
          style="
            text-align: center;
            background-color: #ffffff;
            padding: 10px;
            font-size: 12px;
            color: #b2b2b2;
          "
        >
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import SiderMenu from "./SiderMenu";
import BreadCrumb from "./BreadCrumb.vue";
export default {
  components: {
    SiderMenu,
    BreadCrumb,
  },
  computed: {
    name() {
      return this.$store.state.user.name;
    },
  },
  data() {
    return {
      top: 0,
      collapsed: false,
    };
  },
};
</script>

<style>
#basic-layout .header {
  color: #ffffff;
  background-color: #003d74;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 16px;
}

#basic-layout .content {
  margin: 0;
  padding: 0 20px;
  background-color: #ffffff;
}

#basic-layout .content .router-view {
  padding: 20px 0;
  min-height: 1000px;
  background-color: #ffffff;
}

#basic-layout .bread-crumb {
  height: auto;
  line-height: normal;
  padding: 10px 0;
}

#basic-layout .ant-divider-horizontal {
  margin: 0;
}

.ant-table-thead > tr > th {
  background-color: #f2f4f5;
}
</style>
