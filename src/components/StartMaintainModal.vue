<template>
  <a-modal
    :visible="visible"
    title="开始保养"
    destroyOnClose
    cancelText="取消"
    okText="确定"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form-model
      ref="startMaintain"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item
        ref="staff_name"
        label="保养人员："
        prop="staff_name"
        class="form-item-admin"
        v-if="samllMaintain"
      >
        <a-input
          v-model="form.staff_name"
          placeholder="请选择人员"
          :disabled="disabled"
        />
        <a-icon type="user-add" class="append-right" @click="chooseStaff" />
      </a-form-model-item>
      <a-form-model-item ref="startTime" label="开始时间：" prop="startTime">
        <a-date-picker
          show-time
          placeholder="请选择时间"
          @change="startTimeChange"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import * as dd from "dingtalk-jsapi";
import { domain } from "../utils/tools";

export default {
  name: "StartMaintainModal",
  props: {
    samllMaintain: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: "",
    },
  },
  computed: {
    currentUrl() {
      return this.domain + "/machine/";
    },
  },
  data() {
    return {
      domain,
      visible: false,
      disabled: true,
      form: {
        staff_name: "", // 保养人员姓名
        staff_no: "", // 保养人员工号
        startTime: "", // 开始保养时间
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      rules: {
        staff_name: [
          {
            required: true,
            message: "请选择保养人员",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    startTimeChange(time, timeString) {
      console.log(time, timeString);
      this.form.startTime = timeString;
    },
    chooseStaff() {
      this.$api
        .JASPI_CONFIG({ url: this.currentUrl })
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
                console.log("result");
                console.log(result);
                this.$api.GET_USER_INFO(result[0].emplId).then((userInfo) => {
                  console.log("userInfo");
                  console.log(userInfo);
                  if (userInfo.data && userInfo.data.jobNumber) {
                    console.log("1");
                    this.form.staff_name = userInfo.data.name;
                    this.form.staff_no = userInfo.data.jobNumber;
                    console.log(this.form);
                  } else {
                    console.log("2");
                    this.form.staff_name = "";
                    this.form.staff_no = "";
                  }
                });
              },
              onFail: (err) => {
                console.log("通讯录组件调用失败");
                console.log(err);
                this.form.staff_name = "";
                this.form.staff_no = "";
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
        alert("dd error: " + JSON.stringify(error));
      });
    },
    cancel() {
      this.visible = false;
      this.form = {
        staff_name: "",
        staff_no: "",
        startTime: "",
      };
    },
    ok() {
      this.$refs.startMaintain.validate((valid) => {
        if (valid) {
          this.visible = false;
          this.$emit("handleOk", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.form-item-admin .ant-form-item-children .append-right {
  width: 100px;
  font-size: 24px;
  margin-left: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: left;
  color: #40a9ff;
}
</style>
