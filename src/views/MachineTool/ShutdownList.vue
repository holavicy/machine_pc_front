<template>
  <div class="list">
    <!-- 搜索 -->
    <div class="top-wrapper">
      <div class="search-wrapper">
        <div class="search-item">
          <label for="">机床编号：</label>
          <a-input
            placeholder="请输入机床编号"
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
      class="machine-list"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 1400 }"
      @change="handleTableChange"
    >
      <template slot="num" slot-scope="record">
        <span class="cus-link" @click="goPage(record)">{{ record.num }}</span>
      </template>
      <template slot="status" slot-scope="status">
        {{ machineStatus[status] }}
      </template>
      <template slot="small_limit" slot-scope="record">
        <span class="table-item-left"
          >{{ computeTimes(record.small_sum) }} </span
        >/<span class="table-item-right">{{
          record.small_limit + "小时"
        }}</span>
      </template>
      <template slot="big_limit" slot-scope="record">
        <span class="table-item-left">{{ computeTimes(record.big_sum) }}</span
        >/<span class="table-item-right">{{ record.big_limit + "小时" }}</span>
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
import { dateChangeFormat, computeTimes } from "../../utils/tools";
const columns = [
  {
    title: "机床编号",
    key: "num",
    width: 100,
    fixed: "left",
    scopedSlots: { customRender: "num" },
  },
  {
    title: "控制箱编号",
    key: "device_num",
    dataIndex: "device_num",
    fixed: "left",
    width: 140,
  },
  {
    title: "历史使用时长",
    dataIndex: "total_sum",
    key: "total_sum",
    width: 140,
    ellipsis: true,
  },
  {
    title: "小保养--累计/上限",
    key: "small_limit",
    width: 250,
    ellipsis: true,
    align: "center",
    scopedSlots: { customRender: "small_limit" },
  },
  {
    title: "大保养--累计/上限",
    key: "big_limit",
    width: 250,
    ellipsis: true,
    align: "center",
    scopedSlots: { customRender: "big_limit" },
  },
  {
    title: "管理员姓名",
    dataIndex: "temp_2",
    key: "temp_2",
    width: 100,
    ellipsis: true,
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
      cateId: 2,
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
    computeTimes,
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
        status: 3,
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

    // 确定重启机床
    confirmRestart(record) {
      const data = {
        id: record.id,
        status: 0,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("已重启，可在机床列表中查看该设备");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg || "操作失败，请稍后重试");
        }
      });
    },
    goPage(record) {
      this.$router.push(`/machineTool/detail/${record.id}/${record.num}`);
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
.table-item-left {
  width: 130px;
  display: inline-block;
  text-align: right;
}
.table-item-right {
  width: 80px;
  display: inline-block;
  text-align: left;
}
.machine-list /deep/ .ant-table-thead > tr > th,
.machine-list /deep/ .ant-table-tbody > tr > td {
  padding: 16px 4px;
}
</style>
