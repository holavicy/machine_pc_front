<template>
  <div class="supply-list">
    <a-button
      type="primary"
      style="margin-bottom: 20px"
      @click="showModal('new')"
      >新增供应商</a-button
    >
    <a-table bordered :data-source="dataSource" :columns="columns">
      <template slot="action" slot-scope="record">
        <div class="actions">
          <span
            class="cus-link"
            style="margin-right: 10px"
            @click="goPage(record)"
            >EPC列表</span
          >
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
    <SupplyModal ref="SupplyModal" :form="defaultForm" @handleOk="handleOk" />
  </div>
</template>

<script>
import SupplyModal from "../../components/SupplyModal.vue";
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "供应商编号",
    dataIndex: "supplier_num",
    key: "supplier_num",
  },
  {
    title: "供应商名称",
    dataIndex: "supplier_name",
    key: "supplier_name",
    ellipsis: true,
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { SupplyModal },
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
      editId: "",
    };
  },
  mounted() {
    this.fetch(1);
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
      };
      this.loading = true;
      this.$api.GET_SUPPLY_LIST(queryData).then((res) => {
        this.loading = false;
        this.dataSource = res.data.content;
        const pagination = { ...this.pagination };
        pagination.total = res.data.totalSize;
        this.pagination = pagination;
      });
    },
    goPage(record) {
      this.$router.push(`/config/epc/${record.id}/${record.supplier_name}`);
    },
    showModal(type, record) {
      if (type == "new") {
        this.defaultForm = {};
        this.$refs.SupplyModal.visible = true;
        this.editId = "";
      }
      if (type == "edit") {
        this.editId = record.id;
        this.defaultForm = {
          name: record.supplier_name,
          num: record.supplier_num,
          remark: record.remark,
        };
        this.$refs.SupplyModal.visible = true;
      }
    },
    handleOk(record) {
      console.log(record);
      if (this.editId) {
        record.id = this.editId;
        this.$api.UPDATE_SUPPLY(record).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("编辑成功");
            this.fetch(1);
            this.$refs.SupplyModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "编辑失败，请联系管理员");
          }
        });
      } else {
        this.$api.ADD_SUPPLY(record).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("新增成功");
            this.fetch(1);
            this.$refs.SupplyModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "新增失败，请联系管理员");
          }
        });
      }
    },

    confirmDelete(id) {
      const data = {
        id: id,
      };
      this.$api.DEL_SUPPLY(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.fetch(1);
        } else {
          this.$message.error(res.data.errMsg || "删除失败");
        }
      });
    },
  },
};
</script>
