<template>
  <div class="list">
    <div class="top-wrapper">
      <div class="search-wrapper">
        <div class="search-item">
          <label for="">设备编码：</label>
          <a-input
            placeholder="请输入设备编号"
            v-model="machineNum"
            size="small"
          />
        </div>
        <!-- <div class="search-item">
          <label for="">设备名称：</label>
          <a-input
            placeholder="请输入设备名称"
            v-model="machineName"
            size="small"
          />
        </div> -->

        <div class="search-item">
          <label for="">触发报警：</label>
          <a-select
            default-value=""
            style="width: 80px"
            size="small"
            :allowClear="true"
            @change="alertStatusChange"
          >
            <a-select-option
              v-for="(value, key) in alertFlag"
              :value="key"
              :key="key"
            >
              {{ value }}</a-select-option
            >
          </a-select>
        </div>
        <div class="search-item">
          <label for="">报警结果：</label>
          <a-select
            default-value=""
            style="width: 80px"
            size="small"
            :allowClear="true"
            @change="alertResultChange"
          >
            <a-select-option
              v-for="(value, key) in alertStatus"
              :value="key"
              :key="key"
            >
              {{ value }}</a-select-option
            >
          </a-select>
        </div>
        <div class="search-item">
          <label for="">日期：</label>
          <a-range-picker size="small" @change="dateChange" width="180px" />
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
      :scroll="{ x: 1200 }"
      @change="handleTableChange"
    >
      <template slot="alert_flag" slot-scope="record">
        {{ alertFlag[record.alert_flag] }}
      </template>
      <template slot="alert_status" slot-scope="record">
        {{ alertStatus[record.alert_status] }}
      </template>
      <template slot="receipt_time" slot-scope="record">
        {{ dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.receipt_time) }}
      </template>
    </a-table>
  </div>
</template>

<script>
import { dateChangeFormat, alertFlag, alertStatus } from "../../utils/tools";

const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
    width: 60,
    fixed: "left",
  },
  {
    title: "报文信息",
    dataIndex: "info",
    key: "info",
  },
  {
    title: "接收时间",
    key: "receipt_time",
    width: 180,
    scopedSlots: { customRender: "receipt_time" },
  },
  {
    title: "是否触发报警",
    key: "alert_flag",
    width: 120,
    scopedSlots: { customRender: "alert_flag" },
  },
  {
    title: "报警结果",
    key: "alert_status",
    width: 100,
    scopedSlots: { customRender: "alert_status" },
  },
  {
    title: "接收人工号",
    dataIndex: "alert_send_staff_no",
    key: "alert_send_staff_no",
    width: 100,
  },
  {
    title: "发送内容",
    dataIndex: "alert_msg",
    key: "alert_msg",
  },
];
export default {
  data() {
    return {
      alertFlag,
      alertStatus,
      columns,
      data: [],
      loading: false,
      machineNum: "",
      machineName: "",
      beginDate: "",
      endDate: "",
      flag: "",
      alert_status: "",
      pagination: { current: 1, results: 10 },
    };
  },
  mounted() {
    this.fetch(1);
  },
  methods: {
    dateChangeFormat,
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
      this.loading = true;
      const queryData = {
        machineNum: this.machineNum,
        machineName: this.machineName,
        beginDate: this.beginDate,
        endDate: this.endDate,
        alert_flag: this.flag,
        alert_status: this.alert_status,
        pageNum: this.pagination.current,
        pageSize: this.pagination.results,
      };
      this.$api.GET_MESSAGE_RECORDS(queryData).then((res) => {
        this.loading = false;
        this.data = res.data.content;
        const pagination = { ...this.pagination };
        pagination.total = res.data.totalSize;
        this.pagination = pagination;
      });
    },
    dateChange(date, dateString) {
      console.log(dateString);
      this.beginDate = dateString[0] ? dateString[0] + " 00:00:00" : "";
      this.endDate = dateString[1] ? dateString[1] + " 23:59:59" : "";
    },
    alertStatusChange(val) {
      this.flag = val;
    },
    alertResultChange(val) {
      this.alert_status = val;
    },
  },
};
</script>
