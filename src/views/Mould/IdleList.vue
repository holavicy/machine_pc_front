<template>
  <div class="list">
    <!-- 搜索 -->
    <div class="top-wrapper">
      <div class="search-wrapper">
        <div class="search-item">
          <label for="">模具编号：</label>
          <a-input
            placeholder="请输入模具编号"
            size="small"
            v-model="machineNum"
          />
        </div>
        <div class="search-item">
          <label for="">控制箱编号：</label>
          <a-input
            placeholder="请输入控制箱编号"
            size="small"
            v-model="deviceNum"
          />
        </div>
      </div>
      <div class="top-actions">
        <a-button class="button-cus" size="small" @click="fetch(1)"
          >查询</a-button
        >
      </div>
    </div>

    <a-table
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 1460 }"
      @change="handleTableChange"
    >
      <template slot="num" slot-scope="record">
        <span class="cus-link" @click="goPage(record)">{{ record.num }}</span>
      </template>
      <template slot="status" slot-scope="status">
        {{ machineStatus[status] }}
      </template>
      <template slot="small_limit" slot-scope="record">
        {{ record.small_sum }}/{{ record.small_limit }}
      </template>
      <template slot="big_limit" slot-scope="record">
        {{ record.big_sum }}/{{ record.big_limit }}
      </template>
      <template slot="create_time" slot-scope="record">
        {{ dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.create_time) }}
      </template>
      <template slot="action" slot-scope="record">
        <div class="actions">
          <a-popconfirm
            title="确定重新启用此设备？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmRestart(record)"
          >
            <a href="#">重新启用</a></a-popconfirm
          >
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
  </div>
</template>

<script>
import { dateChangeFormat } from "../../utils/tools";
const columns = [
  {
    title: "模具编号",
    key: "num",
    width: 100,
    fixed: "left",
    scopedSlots: { customRender: "num" },
  },
  {
    title: "模具名称",
    key: "epc_name",
    dataIndex: "epc_name",
    width: 140,
    fixed: "left",
  },
  {
    title: "供应商名称",
    dataIndex: "supplier_name",
    key: "supplier_name",
    width: 200,
    ellipsis: true,
  },
  {
    title: "历史冲压次数",
    dataIndex: "total_sum",
    key: "total_sum",
    width: 120,
    ellipsis: true,
  },
  {
    title: "小保养--累计/上限（次）",
    key: "small_limit",
    width: 180,
    ellipsis: true,
    scopedSlots: { customRender: "small_limit" },
  },
  {
    title: "大保养--累计/上限（次）",
    key: "big_limit",
    width: 180,
    ellipsis: true,
    scopedSlots: { customRender: "big_limit" },
  },
  // {
  //   title: "利用率",
  //   dataIndex: "temp_5",
  //   key: "temp_5",
  //   ellipsis: true,
  // },
  {
    title: "管理员姓名",
    dataIndex: "temp_2",
    key: "temp_2",
    width: 100,
    ellipsis: true,
  },
  {
    title: "控制箱编号",
    key: "device_num",
    dataIndex: "device_num",
    width: 160,
  },
  {
    title: "添加时间",
    key: "create_time",
    ellipsis: true,
    width: 180,
    scopedSlots: { customRender: "create_time" },
  },
  {
    title: "操作",
    key: "operation",
    fixed: "right",
    width: 160,
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      cateId: 1,
      columns,
      data: [],
      pagination: { current: 1, results: 10 },
      loading: false,
      machineNum: "",
      deviceNum: "",
    };
  },
  mounted() {
    this.fetch(1);
  },
  methods: {
    dateChangeFormat,
    // 分页变化
    handleTableChange(pagination) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      pager.results = pagination.results;
      this.pagination = pager;
      this.fetch();
    },
    // 查询列表
    fetch(page) {
      if (page) {
        this.pagination.current = page;
      }
      this.loading = true;
      const queryData = {
        cateId: this.cateId,
        num: this.machineNum,
        deviceNum: this.deviceNum,
        status: 6,
        pageNum: this.pagination.current,
        pageSize: this.pagination.results,
      };
      if (!this.$store.state.user.isSuperAdmin) {
        queryData.staff_no = this.$store.state.user.job_number;
      }
      this.$api.GET_MOULD_LIST(queryData).then((res) => {
        this.loading = false;
        this.data = res.data.content;
        const pagination = { ...this.pagination };
        pagination.total = res.data.totalSize;
        this.pagination = pagination;
      });
    },

    // 确定重启模具
    confirmRestart(record) {
      const data = {
        id: record.id,
        status: 0,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("已重启，可在模具列表中查看该设备");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg || "操作失败，请稍后重试");
        }
      });
    },
    goPage(record) {
      this.$router.push(`/mould/detail/${record.id}/${record.num}`);
    },
    confirmDelete(id) {
      const data = {
        id: id,
        status: 7,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("已删除");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg || "操作失败，请稍后重试");
        }
      });
    },
  },
};
</script>
<style scoped>
.cus-link {
  display: inline-block;
  color: #1890ff;
}
.cus-link:hover {
  cursor: pointer;
}
</style>
