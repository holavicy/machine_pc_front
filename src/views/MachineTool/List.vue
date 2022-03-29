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
        <div class="search-item">
          <label for="">机床状态：</label>
          <a-select
            placeholder="请选择"
            :defaultValue="defaultStatus"
            allowClear
            size="small"
            @change="handleChange"
          >
            <a-select-option
              v-for="(value, key) in statusDict"
              :value="key"
              :key="key"
            >
              {{ value }}</a-select-option
            >
          </a-select>
        </div>
      </div>
      <div class="top-actions">
        <a-button class="button-cus" size="small" @click="fetch(1)"
          >查询</a-button
        >
        <a-button
          type="primary"
          size="small"
          class="button-cus"
          @click="showMouldModal('new')"
          >添加机床</a-button
        >
      </div>
    </div>
    <!-- 列表 -->
    <a-table
      class="machine-list"
      :columns="columns"
      :row-key="(record) => record.id"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ x: 1500 }"
      @change="handleTableChange"
      :rowClassName="rowClassName"
    >
      <template slot="num" slot-scope="record">
        <span class="cus-link" @click="goPage(record)">{{ record.num }}</span>
      </template>
      <template slot="status" slot-scope="status">
        {{ statusDict[status] }}
      </template>
      <template slot="total_sum" slot-scope="record">
        {{ computeTimes(record.total_sum) }}
      </template>
      <template slot="small_limit" slot-scope="record">
        <span class="table-item-left">{{ computeTimes(record.small_sum) }}</span
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
          <a @click="showMouldModal('edit', record)">编辑</a>
          <a
            v-if="record.status === 4 || record.status === 5"
            @click="showStartMaintainModal(record)"
            >开始保养</a
          >
          <a
            class="warning"
            v-if="record.status === 1 || record.status === 2"
            @click="showStopMaintainModal(record)"
            >保养结束</a
          >
          <!-- <a class="warning" @click="showStopMaintainModal(record)">保养结束</a> -->

          <a-popconfirm
            title="停用后，您可在停用列表中查看，确定停用？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmShutdown(record.id)"
          >
            <a href="#">停用</a></a-popconfirm
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
    <!-- 新增/编辑机床弹窗 -->
    <machine-modal
      ref="machineModal"
      :title="modalTitle"
      :cateId="cateId"
      :form="defaultForm"
      :defaultValue="defaultValue"
      @handleOk="machineOk"
    />
    <!-- 开始保养 -->
    <start-maintain-modal
      ref="startMaintainModal"
      :samllMaintain="smallMaintain"
      :url="url"
      @handleOk="startMaintainOk"
    />
    <!-- 结束保养 -->
    <stop-maintain-modal
      ref="stopMaintainModal"
      :samllMaintain="smallMaintain"
      :startInfo="startInfo"
      :cateId="cateId"
      @handleOk="stopMaintainOk"
    />
  </div>
</template>

<script>
import { dateChangeFormat, statusDict, computeTimes } from "../../utils/tools";
import MachineModal from "../../components/MouldModal.vue";
import StartMaintainModal from "../../components/StartMaintainModal.vue";
import StopMaintainModal from "../../components/StopMaintainModal.vue";

const columns = [
  {
    title: "机床编号",
    key: "num",
    width: 120,
    fixed: "left",
    scopedSlots: { customRender: "num" },
  },
  {
    title: "控制箱编号",
    key: "device_num",
    fixed: "left",
    dataIndex: "device_num",
  },
  {
    title: "机床状态",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    width: 100,
    scopedSlots: { customRender: "status" },
  },
  {
    title: "历史使用时长",
    key: "total_sum",
    width: 140,
    ellipsis: true,
    scopedSlots: { customRender: "total_sum" },
  },
  {
    title: "小保养--累计/上限",
    key: "small_limit",
    width: 250,
    align: "center",
    scopedSlots: { customRender: "small_limit" },
  },
  {
    title: "大保养--累计/上限",
    key: "big_limit",
    width: 250,
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
  components: {
    MachineModal,
    StartMaintainModal,
    StopMaintainModal,
  },
  data() {
    return {
      url: "/machineTool/list",
      cateId: 2,
      columns,
      data: [],
      pagination: { current: 1, results: 10 },
      loading: false,
      statusDict,
      startInfo: {},
      machineNum: "",
      deviceNum: "",
      status: null,
      defaultStatus: "",
      modalTitle: "",
      editId: "",
      smallMaintain: false,
      defaultForm: {},
      defaultValue: "",
    };
  },
  created() {
    const status = this.$route.query ? this.$route.query.status : "";
    this.status = status || "";
    this.defaultStatus = status || "";
    this.fetch(1);
  },
  methods: {
    dateChangeFormat,
    computeTimes,
    // 搜索状态改变
    handleChange(value) {
      this.status = value;
    },
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
        status: this.status,
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
    // 列表底色根据状态不同显示不同的颜色
    rowClassName(record) {
      const status = record.status;
      let clasName = "";
      switch (status) {
        case 5:
          clasName = "danger-big-tr twinkle-fast";
          break;
        case 4:
          clasName = "danger-small-tr twinkle-fast";
          break;
        case 2:
          clasName = "warning-big-tr twinkle-slow";
          break;
        case 1:
          clasName = "warning-small-tr twinkle-slow";
          break;
        default:
          break;
      }
      return clasName;
    },
    // 显示新增编辑机床弹窗
    showMouldModal(type, record) {
      const promise_get_admin_list = new Promise((resolve, reject) => {
        const data = {
          pageNum: 1,
          pageSize: 1000,
        };
        this.$api.GET_ADMIN_LIST(data).then((res) => {
          const data = res.data.content.map((user) => ({
            text: user.staff_name,
            value: user.id,
          }));
          this.$refs.machineModal.adminList = data;
          resolve();
        });
      });
      Promise.all([promise_get_admin_list]).then(() => {
        if (type === "new") {
          this.defaultForm = {};
          this.modalTitle = "添加机床";
          this.editId = "";
          this.defaultValue = "";
          this.$refs.machineModal.visible = true;
        }
        if (type === "edit") {
          record.deviceNum = record.device_num;
          this.defaultForm = { ...record };
          this.defaultForm.num = this.defaultForm.num + "";
          this.defaultForm.big_limit = this.defaultForm.big_limit / 1000;
          this.defaultForm.deviceNum = this.defaultForm.device_num;
          this.editId = record.id;
          this.modalTitle = "编辑";
          if (record.temp_2) {
            const queryData = {
              name: record.temp_2,
              pageNum: 1,
              pageSize: 1000,
            };
            this.$api.GET_ADMIN_LIST(queryData).then((res) => {
              const data = res.data.content.map((user) => ({
                text: user.staff_name,
                value: user.id,
              }));
              this.defaultForm.adminId = res.data.content[0].id;
              this.$refs.machineModal.visible = true;
            });
          } else {
            this.defaultForm.adminId = "";
            this.$refs.machineModal.visible = true;
          }
        }
      });
    },
    // 新增编辑机床提交
    machineOk(form) {
      let data = {
        num: form.num,
        deviceNum: form.deviceNum,
        small_limit: form.small_limit,
        big_limit: form.big_limit,
        adminId: form.adminId,
        cateId: this.cateId,
      };
      if (this.editId) {
        data.id = this.editId;
        this.$api.EDIT_MOULD(data).then((res) => {
          if (res.data.code === 0) {
            this.$refs.machineModal.visible = false;
            this.$message.success("编辑成功");
            this.fetch();
          } else {
            this.$message.error(res.data.errMsg);
          }
        });
      } else {
        this.$api.SET_MOULD(data).then((res) => {
          if (res.data.code === 0) {
            this.$refs.machineModal.visible = false;
            this.$message.success("添加成功");
            this.fetch(1);
          } else {
            this.$message.error(res.data.errMsg);
          }
        });
      }
    },
    // 确定停用机床
    confirmShutdown(id) {
      const data = {
        id: id,
        status: 3,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("已停用，可在停用列表中查看该数据");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg || "操作失败，请稍后重试");
        }
      });
    },
    // 确定删除机床
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
    // 显示开始保养弹窗
    showStartMaintainModal(record) {
      this.editId = record.id;
      this.smallMaintain = record.status == 4 ? true : false;
      this.$refs.startMaintainModal.visible = true;
    },
    startMaintainOk(form) {
      form.machineId = this.editId;
      this.$api.ADD_START_RECORD(form).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("提交成功，设备正在小保养中！");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg);
        }
      });
    },
    // 显示结束保养弹框
    showStopMaintainModal(record) {
      this.editId = record.id;
      this.smallMaintain = record.status == 1 ? true : false;
      // this.$refs.stopMaintainModal.visible = true;
      // 获取最近一次开始保养记录
      this.$api
        .GET_LATEST_START_RECOR({ machineId: this.editId })
        .then((res) => {
          if (res.data.content.length > 0) {
            this.startInfo = res.data.content[0];
            this.$refs.stopMaintainModal.form = {
              maintainId: "",
              endTime: "", // 开始保养时间
            };
            this.$refs.stopMaintainModal.visible = true;
          } else {
            this.$message.error("数据错误，请联系管理员！");
          }
        });
    },
    stopMaintainOk(form) {
      form.machineId = this.editId;
      this.$api.ADD_STOP_RECORD(form).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("提交成功，设备已结束保养！");
          this.fetch();
        } else {
          this.$message.error(this.data.errMsg);
        }
      });
    },
    goPage(record) {
      this.$router.push(`/machineTool/detail/${record.id}/${record.num}`);
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
.ant-col-sm-12 {
  width: 66%;
}

.ant-form-item {
  margin-bottom: 10px;
}

.machine-list /deep/ .ant-spin-nested-loading .danger-big-tr {
  background-color: #cd7372;
}

.machine-list /deep/ .ant-spin-nested-loading .danger-small-tr {
  background-color: #f3c0c3;
}
.machine-list /deep/ .ant-spin-nested-loading .warning-big-tr {
  background-color: #ebe172;
}
.machine-list /deep/ .ant-spin-nested-loading .warning-small-tr {
  background-color: #f3ecc0;
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

@keyframes myAnimation {
  0% {
    background: none;
  }
  100% {
    opacity: 1;
  }
}
.machine-list /deep/ .ant-spin-nested-loading .twinkle-slow {
  animation: myAnimation 1s infinite;
}
.machine-list /deep/ .ant-spin-nested-loading .twinkle-fast {
  animation: myAnimation 0.5s infinite;
}
</style>
