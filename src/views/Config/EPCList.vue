<template>
  <div class="epc-list">
    <div class="top">
      <h2>{{ supplierName }}</h2>
    </div>

    <a-table bordered :data-source="dataSource" :columns="columns"></a-table>
  </div>
</template>

<script>
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
];
export default {
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
  },
};
</script>

<style scoped>
.epc-list .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.epc-list .top h2 {
  color: #003d74;
  margin-bottom: 20px;
}
</style>
