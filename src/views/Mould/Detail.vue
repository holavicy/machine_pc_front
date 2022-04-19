<template>
  <div class="machine-detail">
    <div class="wrapper" id="basic-info">
      <div class="title">基本信息</div>
      <div class="info">
        <div class="info-group">
          <div class="info-item">EPC编号：{{ baseInfo.epc_num }}</div>
          <div class="info-item">小保养上限：{{ baseInfo.small_limit }}次</div>
          <!-- <div class="info-item">控制箱编号：{{ baseInfo.device_num }}</div> -->
        </div>
        <div class="info-group">
          <div class="info-item">模具名称：{{ baseInfo.name }}</div>
          <div class="info-item">大保养上限：{{ baseInfo.big_limit }}次</div>
        </div>
        <div class="info-group">
          <div class="info-item">供应商：{{ baseInfo.supplier_name }}次</div>
          <div class="info-item">管理员：{{ baseInfo.temp_2 || "" }}</div>
        </div>
      </div>
      <div class="status normal" v-if="baseInfo.status === 0">
        {{ statusAllDict[baseInfo.status] }}
      </div>
      <div
        class="status warning"
        v-if="baseInfo.status === 1 || baseInfo.status === 2"
      >
        {{ statusAllDict[baseInfo.status] }}
      </div>
      <div
        class="status danger"
        v-if="baseInfo.status === 4 || baseInfo.status === 5"
      >
        {{ statusAllDict[baseInfo.status] }}
      </div>
      <div
        class="status del"
        v-if="baseInfo.status === 3 || baseInfo.status === 6"
      >
        {{ statusAllDict[baseInfo.status] }}
      </div>
    </div>
    <div class="wrapper" id="maintain-info">
      <div class="title">保养记录</div>
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="小保养">
          <a-table
            :columns="smallColumns"
            :row-key="(record) => record.num"
            :data-source="smallMaintainList"
            :pagination="smallMaintainPgt"
          >
            <template slot="start_time" slot-scope="record">
              {{ dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.start_time) }}
            </template>
            <template slot="end_time" slot-scope="record">
              {{
                record.end_time
                  ? dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.end_time)
                  : ""
              }}
            </template>
            <template slot="status" slot-scope="status">
              {{ status === 0 ? "保养中" : "保养结束" }}
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="大保养">
          <a-table
            :columns="bigColumns"
            :row-key="(record) => record.num"
            :data-source="bigMaintainList"
            :pagination="bigMaintainPgt"
          >
            <template slot="start_time" slot-scope="record">
              {{ dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.start_time) }}
            </template>
            <template slot="end_time" slot-scope="record">
              {{
                record.end_time
                  ? dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.end_time)
                  : ""
              }}
            </template>
            <template slot="status" slot-scope="status">
              {{ status === 0 ? "保养中" : "保养结束" }}
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { dateChangeFormat, statusAllDict } from "../../utils/tools";
const smallColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "80px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "保养人员",
    dataIndex: "staff_name",
    key: "staff_name",
    width: "100px",
  },
  {
    title: "开始时间",
    key: "start_time",
    width: "160px",
    scopedSlots: { customRender: "start_time" },
  },
  {
    title: "结束时间",
    key: "end_time",
    width: "160px",
    scopedSlots: { customRender: "end_time" },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: "100px",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "保养说明",
    dataIndex: "remark",
    key: "remark",
  },
];
const bigColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "80px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "开始时间",
    key: "start_time",
    width: "160px",
    scopedSlots: { customRender: "start_time" },
  },
  {
    title: "结束时间",
    key: "end_time",
    width: "160px",
    scopedSlots: { customRender: "end_time" },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: "100px",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "保养说明",
    dataIndex: "remark",
    key: "remark",
  },
];
export default {
  data() {
    this.form = this.$form.createForm(this);
    return {
      statusAllDict,
      machineId: "",
      baseInfo: {},
      smallColumns,
      smallMaintainList: [],
      smallMaintainPgt: { results: 5, current: 1 },
      bigColumns,
      bigMaintainList: [],
      bigMaintainPgt: { results: 5, current: 1 },

      targetOffset: 60,

      maintainStatus: {
        1: "保养中",
        2: "保养结束",
      },
      modalTitle: "",
    };
  },
  created() {
    const machineId = this.$route.params.id;
    const machineNum = this.$route.params.num;
    const status = this.$route.params.status;
    this.machineId = machineId;
    if (machineId) {
      // 获取模具详情；
      this.fetchBaseInfo(machineNum, status);
      // 获取小保养记录;
      this.fetchSmallMaintain();
      // 获取大保养记录；
      this.fetchBigMaintain();
    } else {
      this.$router.replace({
        path: "/mould/list",
      });
    }
  },
  methods: {
    dateChangeFormat,
    callback(key) {
      console.log(key);
    },
    fetchBaseInfo(num, status) {
      const queryData = {
        cateId: 1,
        epcNum: num,
        status: status,
        pageNum: 1,
        pageSize: 1000,
      };
      this.$api.GET_MOULD_LIST(queryData).then((res) => {
        this.baseInfo = res.data.content[0] || {};
      });
    },
    fetchSmallMaintain() {
      const queryData = {
        machineId: this.machineId,
        flag: 1,
        pageSize: this.smallMaintainPgt.results,
        pageNum: this.smallMaintainPgt.current,
      };
      this.$api.GET_ALL_MAINTAIN_RECORDS(queryData).then((res) => {
        this.smallMaintainList = res.data.content || [];
        const smallMaintainPgt = { ...this.smallMaintainPgt };
        smallMaintainPgt.total = res.data.totalSize;
        this.smallMaintainPgt = smallMaintainPgt;
      });
    },
    fetchBigMaintain() {
      const queryData = {
        machineId: this.machineId,
        flag: 2,
        pageSize: this.bigMaintainPgt.results,
        pageNum: this.bigMaintainPgt.current,
      };
      this.$api.GET_ALL_MAINTAIN_RECORDS(queryData).then((res) => {
        this.bigMaintainList = res.data.content || [];
        const bigMaintainPgt = { ...this.bigMaintainPgt };
        bigMaintainPgt.total = res.data.totalSize;
        this.bigMaintainPgt = bigMaintainPgt;
      });
    },
  },
};
</script>

<style scoped>
.machine-detail .wrapper {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 20px;
  position: relative;
}

.machine-detail .wrapper .title {
  font-size: 24px;
  color: #2468a9;
  margin-bottom: 20px;
}
.machine-detail .wrapper .info {
  display: flex;
  font-size: 14px;
  color: #101010;
}

.machine-detail .wrapper .info .info-group {
  margin-right: 40px;
}

.machine-detail .wrapper .info .info-group .info-item {
  margin-bottom: 4px;
}

.machine-detail .wrapper .status {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #ffffff;
  font-size: 24px;
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -50px;
  border-radius: 50%;
}

.machine-detail .wrapper .status.normal {
  background-color: #192847;
}
.machine-detail .wrapper .status.warning {
  background-color: #c3923b;
}
.machine-detail .wrapper .status.danger {
  background-color: #8b4b4f;
}
.machine-detail .wrapper .status.del {
  background-color: #2f3b48;
}

.machine-detail .anchor {
  width: 150px;
  position: fixed;
  top: 100px;
  right: 10px;
  z-index: 1000;
}
.machine-detail /deep/ .ant-table-thead > tr > th {
  background-color: #ffffff;
}

.actions a {
  margin-right: 10px;
}
.actions a.danger {
  color: #ff4d4f;
}
.new-button {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
