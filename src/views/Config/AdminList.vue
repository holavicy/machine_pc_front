<template>
  <div class="admin-list">
    <div class="top-wrapper">
      <div class="search-wrapper">
        <div class="search-item">
          <label for="">姓名：</label>
          <a-input placeholder="请输入姓名" size="small" v-model="staffName" />
        </div>
        <div class="search-item">
          <label for="">工号：</label>
          <a-input placeholder="请输入工号" size="small" v-model="staffNo" />
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
          @click="addAdmin"
          >添加管理员</a-button
        >
      </div>
    </div>

    <a-table
      :columns="columns"
      :row-key="(record) => record.num"
      :data-source="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template slot="action" slot-scope="record">
        <div class="actions">
          <a-popconfirm
            title="确定删除此管理员？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="confirmDelete(record)"
          >
            <a href="#" class="danger">删除</a></a-popconfirm
          >
          <!-- <a @click="showModalOne(record)">已管理设备</a>
          <a @click="showModalTwo(record)">分配设备</a> -->
        </div>
      </template>
    </a-table>

    <machine-modal
      ref="machineModal"
      :data="machineData"
      :type="type"
      @remove="remove"
      @add="add"
    />
  </div>
</template>

<script>
import MachineModal from "../../components/MachineModal.vue";
import * as dd from "dingtalk-jsapi";
import { domain } from "../../utils/tools";

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    width: "100px",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "管理员姓名",
    dataIndex: "staff_name",
    key: "staff_name",
  },
  {
    title: "工号",
    dataIndex: "staff_no",
    key: "staff_no",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { MachineModal },
  data() {
    return {
      domain,
      columns,
      data: [],
      machineData: [],
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
      loading: false,
      staffName: "",
      staffNo: "",
      type: 1, //标志弹窗类型
      addForm: {},
      adminId: "",
      visible: false,
      condition: false,
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
        name: this.staffName,
        staff_no: this.staffNo,
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
      };
      this.loading = true;
      this.$api.GET_ADMIN_LIST(queryData).then((res) => {
        this.loading = false;
        this.data = res.data.content;
        const pagination = { ...this.pagination };
        pagination.total = res.data.totalSize;
        this.pagination = pagination;
      });
    },
    showModalOne(record) {
      const data = {
        adminId: record.id,
        pageNum: 1,
        pageSize: 10000,
      };
      this.adminId = record.id;
      this.$api.GET_ADMIN_MACHINE_LIST(data).then((res) => {
        this.machineData = res.data.content;
        this.type = 1;
        this.$refs.machineModal.visible = true;
      });
    },
    showModalTwo(record) {
      const data = {
        pageNum: 1,
        pageSize: 10000,
      };
      this.addForm.staff_no = record.staff_no;
      this.addForm.staff_name = record.staff_name;
      this.$api.GET_ADMIN_NO_MACHINE_LIST(data).then((res) => {
        this.machineData = res.data.content;
        this.type = 2;
        this.$refs.machineModal.visible = true;
        this.addForm.staff_name = record.staff_name;
        this.addForm.staff_no = record.staff_no;
      });
    },
    addAdmin() {
      const url = this.domain + "/machine/";
      console.log("999999999999999999");
      console.log(url);
      this.$api
        .JASPI_CONFIG({ url: url })
        .then((res) => {
          dd.config({
            agentId: res.data.agentId,
            corpId: res.data.corpId, //必填，企业ID
            timeStamp: res.data.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名
            jsApiList: ["biz.contact.choose"], // 必填，需要使用的jsapi列表，注意：不要带dd。
          });
          dd.ready(() => {
            dd.biz.contact.choose({
              corpId: res.data.corpId,
              multiple: false,
              onSuccess: (result) => {
                console.log(result);
                this.$api.GET_USER_INFO(result[0].emplId).then((userInfo) => {
                  console.log(userInfo);
                  const data = {
                    name: "'" + userInfo.data.name + "'",
                    staff_no: Number(userInfo.data.jobNumber),
                    staff_user_id_dd: "'" + result[0].emplId + "'",
                    create_by: "'" + this.$store.state.user.job_number + "'",
                  };
                  this.$api.ADD_ADMIN(data).then((addRes) => {
                    console.log(addRes);
                    if (addRes.data.code === 0) {
                      console.log(addRes);
                      this.$message.success("新增管理员成功！");
                      this.fetch(1);
                    }
                  });
                });
              },
              onFail: (err) => {
                console.log("通讯录组件调用失败");
                console.log(err);
              },
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });

      dd.error(function (error) {
        /**
        {
           errorMessage:"错误信息",// errorMessage 信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
           errorCode: "错误码"
        }
       **/
        alert(JSON.stringify(error));
      });
    },
    handleVisibleChange(visible) {
      console.log(visible);
      console.log(this.visible);
    },
    confirmDelete(record) {
      const data = {
        id: record.id,
      };
      this.$api.DEL_ADMIN(data).then((res) => {
        if (res.data.code === 0) {
          this.$message.success("删除成功");
          this.fetch(1);
        } else {
          this.$message.error(res.data.errMsg);
        }
      });
    },
    remove(id) {
      this.$api.DEL_ADMIN_RELATION({ machineId: id }).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message.success("移除成功");
          const data = {
            adminId: this.adminId,
            pageNum: 1,
            pageSize: 10000,
          };
          this.$api.GET_ADMIN_MACHINE_LIST(data).then((res) => {
            this.machineData = res.data.content;
          });
        }
      });
    },
    add(data) {
      console.log(data);
      this.addForm.machine_num = data.num;
      this.addForm.machine_name = data.name;
      this.$api.ADD_ADMIN_RELATION(this.addForm).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>
