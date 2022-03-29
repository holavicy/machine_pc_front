<template>
  <div class="epc-list">
    <div class="top">
      <h2>{{ supplierName }}</h2>
      <a-button
        style="margin-bottom: 20px"
        type="primary"
        @click="showModal('new')"
        >新增EPC</a-button
      >
    </div>

    <a-table bordered :data-source="dataSource" :columns="columns">
      <template slot="action" slot-scope="record">
        <div class="actions">
          <a @click="showModal('edit', record)">编辑</a>
          <a-popconfirm
            title="确定删除？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmDelete(record.id)"
          >
            <a href="#" class="danger">删除</a></a-popconfirm
          >
        </div>
      </template>
    </a-table>
    <EPCModal ref="EPCModal" :form="defaultForm" @handleOk="handleOk" />
  </div>
</template>

<script>
import EPCModal from "../../components/EPCModal.vue";
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "EPC编号",
    dataIndex: "epc_num",
    key: "epc_num",
  },
  {
    title: "模具名称",
    dataIndex: "epc_name",
    key: "epc_name",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { EPCModal },
  data() {
    return {
      columns,
      dataSource: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      loading: false,
      defaultForm: {},
      supplierId: "",
      supplierName: "",
    };
  },
  mounted() {
    this.fetch(1);
  },
  created() {
    const supplierId = this.$route.params.supplyId;
    const supplierName = this.$route.params.supplyName;
    this.supplierId = supplierId;
    this.supplierName = supplierName;
  },
  methods: {
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      pager.results = pagination.results;
      this.pagination = pager;
      this.fetch();
    },

    fetch(page) {
      if (page) {
        this.pagination.current = page;
      }
      const queryData = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        supplierId: this.supplierId,
      };
      this.loading = true;
      this.$api.GET_EPC_LIST(queryData).then((res) => {
        this.loading = false;
        this.dataSource = res.data.content;
        const pagination = { ...this.pagination };
        pagination.total = res.data.totalSize;
        this.pagination = pagination;
      });
    },
    showModal(type, record) {
      console.log(type);
      if (type === "new") {
        this.defaultForm = {};
        this.editId = "";
      }

      if (type === "edit") {
        this.defaultForm = {
          epcNum: record.epc_num,
          epcName: record.epc_name,
        };
        this.editId = record.id;
      }
      this.$refs.EPCModal.visible = true;
    },
    handleOk(record) {
      console.log(record);
      if (this.editId) {
        record.epcId = this.editId;
        this.$api.UPDATE_EPC(record).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("编辑成功成功");
            this.fetch();
            this.$refs.EPCModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "编辑失败，请联系管理员");
          }
        });
      } else {
        record.supplierId = this.supplierId;
        this.$api.ADD_EPC(record).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("新增成功");
            this.fetch(1);
            this.$refs.EPCModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "新增失败，请联系管理员");
          }
        });
      }
    },
    confirmDelete(id) {
      console.log(id);
      const data = {
        id: id,
      };
      this.$api.DEL_EPC(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.fetch(1);
        } else {
          this.$$message.error(res.data.errMsg || "删除失败");
        }
      });
    },
  },
};
</script>

<style scoped>
.epc-list .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
