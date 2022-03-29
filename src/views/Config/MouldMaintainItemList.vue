<template>
  <div class="mould-maintain-item-list">
    <!-- <a-button class="editable-add-btn" @click="handleAdd"> Add </a-button> -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="小保养">
        <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="smallData"
          :pagination="false"
        >
          <template slot="action" slot-scope="record">
            <div class="actions">
              <a @click="handleUpdate(record)">编辑</a>
              <a-popconfirm
                title="确定删除？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="del(record.id)"
              >
                <a href="#" class="danger">删除</a></a-popconfirm
              >
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" tab="大保养" force-render>
        <a-table
          :columns="columns"
          :row-key="(record) => record.id"
          :data-source="bigData"
          :pagination="false"
        >
          <template slot="action" slot-scope="record">
            <div class="actions">
              <a @click="handleUpdate(record)">编辑</a>
              <a-popconfirm
                title="确定删除？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="del(record.id)"
              >
                <a href="#" class="danger">删除</a></a-popconfirm
              >
            </div>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <MaintainItemModal
      ref="MaintainItemModal"
      :form="form"
      @handleOk="maintianItemOk"
    />
  </div>
</template>

<script>
import MaintainItemModal from "../../components/MaintainItemModal.vue";
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "名称",
    dataIndex: "item_name",
    key: "item_name",
    ellipsis: true,
  },
  // {
  //   title: "操作",
  //   key: "operation",
  //   width: "140px",
  //   scopedSlots: { customRender: "action" },
  // },
];
export default {
  components: { MaintainItemModal },
  data() {
    return {
      columns,
      loading: false,
      form: {},
      smallData: [],
      bigData: [],
    };
  },
  mounted() {
    this.fetchSamll();
    this.fetchBig();
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      pager.results = pagination.results;
      this.pagination = pager;
      this.fetch();
    },

    fetchSamll(page) {
      // if (page) {
      //   this.pagination.current = page;
      // }
      const queryData = {
        cate_id: 1,
        type: 1,
        pageNum: 1,
        pageSize: 1000,
      };
      this.loading = true;
      this.$api.GET_MAINTAIN_ITEM(queryData).then((res) => {
        this.loading = false;
        this.smallData = res.data.content;
        // const pagination = { ...this.pagination };
        // pagination.total = res.data.totalSize;
        // this.pagination = pagination;
      });
    },

    fetchBig(page) {
      // if (page) {
      //   this.pagination.current = page;
      // }
      const queryData = {
        cate_id: 1,
        type: 2,
        pageNum: 1,
        pageSize: 1000,
      };
      this.loading = true;
      this.$api.GET_MAINTAIN_ITEM(queryData).then((res) => {
        this.loading = false;
        this.bigData = res.data.content;
        // const pagination = { ...this.pagination };
        // pagination.total = res.data.totalSize;
        // this.pagination = pagination;
      });
    },

    confirmDelete(record) {
      const data = {
        id: record.id,
      };
      this.$api.DEL_ADMIN(data).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.fetch(1);
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },

    handleAdd() {
      this.form = {};
      this.$refs.MaintainItemModal.visible = true;
    },
    callback() {
      console.log("callback");
    },
    maintianItemOk(form) {
      console.log(form);
    },
    handleUpdate(item) {
      console.log(item);
      this.form = { type: item.type + "", name: item.item_name };
      this.$refs.MaintainItemModal.visible = true;
    },
  },
};
</script>

<style scoped>
.editable-add-btn {
  margin-bottom: 10px;
}
</style>
