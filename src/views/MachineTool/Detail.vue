<template>
  <div class="machine-detail">
    <div class="wrapper" id="basic-info">
      <div class="title">基本信息</div>
      <div class="info">
        <div class="info-group">
          <div class="info-item">机床编号：{{ baseInfo.num }}</div>
          <div class="info-item">
            小保养上限：{{ baseInfo.small_limit }}小时
          </div>
          <div class="info-item">管理员：{{ baseInfo.temp_2 || "" }}</div>
        </div>
        <div class="info-group">
          <div class="info-item">控制箱编号：{{ baseInfo.device_num }}</div>
          <div class="info-item">大保养上限：{{ baseInfo.big_limit }}小时</div>
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
              {{ maintainStatus[status] }}
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="wrapper" id="open-info">
      <div class="title">开关记录</div>
      <a-table
        :columns="openColumns"
        :row-key="(record) => record.id"
        :data-source="openList"
        :pagination="openPgt"
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
        <template slot="action" slot-scope="record">
          <div class="actions">
            <a @click="showModal('edit', record)">编辑</a>
            <a-popconfirm
              title="确定删除？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteOpenRecord(record.id)"
            >
              <a href="#" class="danger">删除</a></a-popconfirm
            >
          </div>
        </template>
      </a-table>
      <a-button type="primary" class="new-button" @click="showModal('new')"
        >新增开关记录</a-button
      >
    </div>
    <a-anchor class="anchor" :target-offset="targetOffset">
      <a-anchor-link href="#basic-info" title="基础信息" />
      <a-anchor-link href="#maintain-info" title="保养记录" />
      <a-anchor-link href="#open-info" title="开关纪录" />
    </a-anchor>

    <!-- 新增编辑开机记录弹窗 -->
    <open-record-modal
      ref="openRecordModal"
      :form="defaultValue"
      @handleOk="openRecordOk"
    ></open-record-modal>
  </div>
</template>

<script>
import { dateChangeFormat, statusAllDict } from "../../utils/tools";
import OpenRecordModal from "../../components/OpenRecordModal";
const smallColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "保养人员",
    dataIndex: "staff_name",
    key: "staff_name",
  },
  {
    title: "开始时间",
    key: "start_time",
    scopedSlots: { customRender: "start_time" },
  },
  {
    title: "结束时间",
    key: "end_time",
    scopedSlots: { customRender: "end_time" },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
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
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "开始时间",
    key: "start_time",
    scopedSlots: { customRender: "start_time" },
  },
  {
    title: "结束时间",
    key: "end_time",
    scopedSlots: { customRender: "end_time" },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "保养说明",
    dataIndex: "remark",
    key: "remark",
  },
];
const openColumns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "开机时间",
    scopedSlots: { customRender: "start_time" },
    key: "start_time",
  },
  {
    title: "关机时间",
    scopedSlots: { customRender: "end_time" },
    key: "end_time",
  },
  {
    title: "操作",
    key: "status",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: {
    OpenRecordModal,
  },
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
      openColumns,
      openList: [],
      openPgt: { results: 5, current: 1 },

      targetOffset: 60,

      maintainStatus: {
        0: "保养中",
        1: "保养结束",
      },
      modalTitle: "",
      openRecordId: "",
      defaultValue: {},
    };
  },
  created() {
    const machineId = this.$route.params.id;
    const machineNum = this.$route.params.num;
    const status = this.$route.params.status;
    this.machineId = machineId;
    if (machineId) {
      // 获取机床详情；
      this.fetchBaseInfo(machineNum, status);
      // 获取小保养记录;
      this.fetchSmallMaintain();
      // 获取大保养记录；
      this.fetchBigMaintain();
      //获取开关记录；
      this.fetchOpen();
    } else {
      this.$router.replace({
        path: "/machineTool/list",
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
        cateId: 2,
        num: num,
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
    fetchOpen() {
      const queryData = {
        machineId: this.machineId,
        pageNum: this.openPgt.current,
        pageSize: this.openPgt.results,
      };
      this.$api.GET_OPEN_RECORDS(queryData).then((res) => {
        this.openList = res.data.content;
        const openPgt = { ...this.openPgt };
        openPgt.total = res.data.totalSize;
        this.openPgt = openPgt;
      });
    },
    showModal(type, record) {
      if (type === "new") {
        this.openRecordId = "";
        this.defaultValue = {};
      }

      if (type === "edit") {
        console.log(record);
        this.openRecordId = record.id;
        this.defaultValue = {
          startTime: record.start_time
            ? dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.start_time)
            : "",
          endTime: record.end_time
            ? dateChangeFormat("YYYY-mm-dd HH:MM:SS", record.end_time)
            : "",
        };
      }
      this.$refs.openRecordModal.visible = true;
    },
    openRecordOk(form) {
      form.machineId = this.machineId;
      console.log(form);
      if (this.openRecordId) {
        form.id = this.openRecordId;
        this.$api.UPDATE_OPEN_RECORD(form).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("编辑成功");
            this.fetchOpen();
            this.$refs.openRecordModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "编辑失败");
          }
        });
      } else {
        this.$api.ADD_OPEN_RECORD(form).then((res) => {
          if (res.data.code === 0) {
            this.$message.success("新增成功");
            this.fetchOpen(1);
            this.$refs.openRecordModal.visible = false;
          } else {
            this.$message.error(res.data.errMsg || "新增失败");
          }
        });
      }
    },
    deleteOpenRecord(id) {
      this.$api.DEL_OPEN_RECORD({ id: id }).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.fetchOpen();
        } else {
          this.$message.error(res.data.errMsg || "删除失败，请联系管理员");
        }
        console.log(res);
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
