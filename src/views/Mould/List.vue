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
        <div class="search-item">
          <label for="">模具状态：</label>
          <a-select
            placeholder="请选择"
            :defaultValue="defaultStatus"
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
          >添加模具</a-button
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
      :scroll="{ x: 1350 }"
      @change="handleTableChange"
      :rowClassName="rowClassName"
    >
      <template slot="num" slot-scope="record">
        <span class="cus-link" @click="goPage(record)">{{ record.num }}</span>
      </template>
      <template slot="status" slot-scope="status">
        {{ statusDict[status] }}
      </template>
      <template slot="small_limit" slot-scope="record">
        {{ record.small_sum }}/{{ record.small_limit }}
      </template>
      <template slot="big_limit" slot-scope="record">
        {{ record.big_sum === 0.01 ? 0 : record.big_sum }}/{{
          record.big_limit
        }}
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
            title="闲置后，您可在闲置列表中查看，确定闲置？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmIdle(record.id)"
          >
            <a href="#">闲置</a></a-popconfirm
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
    <!-- 新增编辑模具弹窗 -->
    <mould-modal
      ref="mouldModal"
      :title="modalTitle"
      :cateId="cateId"
      :form="defaultForm"
      :defaultValue="defaultValue"
      @handleOk="mouldOk"
    />
    <!-- 开始保养 -->
    <start-maintain-modal
      ref="startMaintainModal"
      :samllMaintain="smallMaintain"
      @handleOk="startMaintainOk"
    />
    <!-- 结束保养 -->
    <stop-maintain-modal
      ref="stopMaintainModal"
      :samllMaintain="smallMaintain"
      :cateId="cateId"
      :startInfo="startInfo"
      @handleOk="stopMaintainOk"
    />
  </div>
</template>

<script>
import { dateChangeFormat, statusDict } from "../../utils/tools";
import MouldModal from "../../components/MouldModal.vue";
import StartMaintainModal from "../../components/StartMaintainModal.vue";
import StopMaintainModal from "../../components/StopMaintainModal.vue";

const columns = [
  {
    title: "模具编号",
    key: "num",
    width: 120,
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
    title: "模具状态",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    width: 100,
    scopedSlots: { customRender: "status" },
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
    width: 170,
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
    width: 140,
  },
  {
    title: "添加时间",
    key: "create_time",
    ellipsis: true,
    width: 160,
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
    MouldModal,
    StartMaintainModal,
    StopMaintainModal,
  },
  data() {
    return {
      statusDict,
      cateId: 1,
      columns,
      data: [],
      pagination: { current: 1, results: 10 },
      loading: false,
      machineNum: "",
      deviceNum: "",
      status: null,
      modalTitle: "",
      editId: "",
      smallMaintain: false,
      defaultForm: {},
      defaultValue: "",
      defaultStatus: "",
      startInfo: {},
    };
  },
  created() {
    const status = this.$route.query ? this.$route.query.status : "";
    this.status = status;
    this.defaultStatus = status || "";
    this.fetch(1);
  },
  methods: {
    dateChangeFormat,
    // 搜索状态改变
    handleChange(value) {
      console.log(value);
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
    // 显示新增编辑模具弹窗
    showMouldModal(type, record) {
      const promise_get_samll_maintain_item = new Promise((resolve, reject) => {
        const data = {
          type: 1,
          cate_id: this.cateId,
          pageSize: 1000,
          pageNum: 1,
        };
        this.$api.GET_MAINTAIN_ITEM(data).then((res) => {
          const resData = [...res.data.content];
          this.$refs.mouldModal.smallMaintainItem = [...resData];
          resolve();
        });
      });

      const promise_get_big_maintain_item = new Promise((resolve, reject) => {
        const data = {
          type: 2,
          cate_id: this.cateId,
          pageSize: 1000,
          pageNum: 1,
        };
        this.$api.GET_MAINTAIN_ITEM(data).then((res) => {
          const resData = [...res.data.content];
          this.$refs.mouldModal.bigMaintainItem = resData;
          resolve();
        });
      });

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
          this.$refs.mouldModal.adminList = data;
          resolve();
        });
      });

      const promise_get_selected_admin_list = new Promise((resolve, reject) => {
        const data = {
          name: record.temp_2 || "",
          pageNum: 1,
          pageSize: 1000,
        };
        this.$api.GET_ADMIN_LIST(data).then((res) => {
          const data = res.data.content.map((user) => ({
            text: user.staff_name,
            value: user.id,
          }));
          this.defaultForm.adminId = res.data.content[0].id;
          resolve();
        });
      });

      const promise_get_selected_small_item_list = new Promise(
        (resolve, reject) => {
          const data = {
            machineId: record.id,
            type: 1,
            pageNum: 1,
            pageSize: 1000,
          };
          this.$api.GET_ITEM_BY_ID(data).then((res) => {
            const data = [...res.data.content];
            let small_maintain_item = data.map(function (item) {
              return item.id;
            });
            console.log(data);
            this.defaultForm.small_maintain_item = small_maintain_item;
            resolve();
          });
        }
      );

      const promise_get_selected_big_item_list = new Promise(
        (resolve, reject) => {
          const data = {
            machineId: record.id,
            type: 2,
            pageNum: 1,
            pageSize: 1000,
          };
          this.$api.GET_ITEM_BY_ID(data).then((res) => {
            const data = [...res.data.content];
            let big_maintain_item = data.map(function (item) {
              return item.id;
            });
            this.defaultForm.big_maintain_item = big_maintain_item;
            resolve();
          });
        }
      );

      if (type === "new") {
        this.defaultForm = { adminId: "" };
        this.defaultValue = "";
        this.modalTitle = "添加模具";
        this.editId = "";
        console.log(this.defaultForm);
        Promise.all([
          promise_get_samll_maintain_item,
          promise_get_big_maintain_item,
        ]).then((res) => {
          this.$refs.mouldModal.visible = true;
        });
      }
      if (type === "edit") {
        record.deviceNum = record.device_num;
        this.defaultForm = { ...record };
        this.defaultForm.num = this.defaultForm.num + "";
        this.defaultForm.big_limit = this.defaultForm.big_limit / 1000;
        this.editId = record.id;
        this.modalTitle = "编辑";

        Promise.all([
          promise_get_samll_maintain_item,
          promise_get_big_maintain_item,
          promise_get_admin_list,
          promise_get_selected_small_item_list,
          promise_get_selected_big_item_list,
          promise_get_selected_admin_list,
        ]).then((res) => {
          this.$refs.mouldModal.visible = true;
        });
      }
    },

    // 新增编辑模具提交
    mouldOk(form) {
      let data = {
        num: form.num,
        deviceNum: form.deviceNum,
        small_limit: form.small_limit,
        big_limit: form.big_limit,
        adminId: form.adminId,
        cateId: this.cateId,
        smallStr: form.small_maintain_item.join(","),
        bigStr: form.big_maintain_item.join(","),
      };
      console.log(data);

      if (this.editId) {
        data.id = this.editId;
        this.$api.EDIT_MOULD(data).then((res) => {
          if (res.data.code === 0) {
            this.$refs.mouldModal.visible = false;
            this.$message.success("编辑成功");
            this.fetch();
          } else {
            this.$message.error(res.data.errMsg);
          }
        });
      } else {
        this.$api.SET_MOULD(data).then((res) => {
          if (res.data.code === 0) {
            this.$refs.mouldModal.visible = false;
            this.$message.success("添加成功");
            this.fetch(1);
          } else {
            this.$message.error(res.data.errMsg);
          }
        });
      }
    },
    // 确定停用模具
    confirmShutdown(id) {
      const data = {
        id: id,
        status: 3,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message.success("停用成功，可在停用列表里查看此设备");
          this.fetch(1);
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
    // 确定闲置模具
    confirmIdle(id) {
      const data = {
        id: id,
        status: 6,
      };
      this.$api.UPDATE_STATUS(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("操作成功，可在闲置列表里查看此设备");
          this.fetch(1);
        } else {
          this.$message.error(res.data.errMsg);
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
      // 获取最近一次开始保养记录
      this.$api
        .GET_LATEST_START_RECOR({ machineId: this.editId })
        .then((res) => {
          if (res.data.content.length > 0) {
            this.startInfo = res.data.content[0];
            const item_query_data = {
              machineId: this.editId,
              type: record.status == 1 ? 1 : 2,
              pageSize: 1000,
              pageNum: 1,
            };
            this.$api.GET_ITEM_BY_ID(item_query_data).then((item_res) => {
              let maintainItem = [...item_res.data.content];
              console.log(maintainItem);
              this.$refs.stopMaintainModal.maintainItem = maintainItem;

              this.$refs.stopMaintainModal.form = {
                maintainId: "",
                endTime: "", // 开始保养时间
              };
              this.$refs.stopMaintainModal.visible = true;
            });
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
@keyframes myAnimation {
  0% {
    opacity: 0;
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
