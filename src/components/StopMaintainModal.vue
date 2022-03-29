<template>
  <a-modal
    :visible="visible"
    title="保养结束"
    destroyOnClose
    cancelText="取消"
    okText="确定"
    @ok="ok"
    @cancel="cancel"
  >
    <div class="info-wrapper">
      <div class="info-item" v-if="samllMaintain">
        <div class="left">保养人员：</div>
        <div class="right">{{ startInfo.staff_name }}</div>
      </div>
      <div class="info-item">
        <div class="left">开始时间：</div>
        <div class="right">
          {{ dateChangeFormat("YYYY-mm-dd HH:MM:SS", startInfo.start_time) }}
        </div>
      </div>
    </div>

    <a-divider />

    <a-form-model
      ref="stopMaintain"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item ref="stopTime" label="结束时间：" prop="endTime">
        <a-date-picker
          show-time
          placeholder="请选择时间"
          @change="endTimeChange"
        />
      </a-form-model-item>

      <a-form-model-item
        ref="remark"
        label="备注："
        prop="remark"
        v-if="cateId === 2"
      >
        <a-input v-model="form.remark" placeholder="请输入保养内容" />
      </a-form-model-item>

      <a-form-model-item
        ref="remark"
        label="保养项目："
        prop="remark"
        v-if="cateId === 1"
      >
        <a-select
          mode="multiple"
          multiple="multiple"
          style="width: 100%"
          placeholder="请选择"
          v-model="form.remark"
        >
          <a-select-option v-for="item in maintainItem" :key="item.item_name">
            {{ item.item_name }}
          </a-select-option></a-select
        >
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { dateChangeFormat } from "../utils/tools";
export default {
  name: "StopMaintainModal",
  props: {
    samllMaintain: {
      type: Boolean,
      default: true,
    },
    startInfo: {
      type: Object,
      default: () => ({}),
    },
    cateId: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      visible: false,
      form: {
        maintainId: "",
        endTime: "", // 开始保养时间
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
        endTime: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: "请维护保养内容",
            trigger: "blur",
          },
        ],
      },
      maintainItem: [],
    };
  },

  methods: {
    dateChangeFormat,
    endTimeChange(time, timeString) {
      this.form.endTime = timeString;
    },
    cancel() {
      this.visible = false;
      this.form = {
        maintainId: "",
        endTime: "",
        remark: "",
      };
    },
    ok() {
      this.$refs.stopMaintain.validate((valid) => {
        if (valid) {
          this.visible = false;
          this.form.maintainId = this.startInfo.id;
          if (this.cateId === 1) {
            this.form.remark = this.form.remark.join(",");
          }
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
  font-size: 18px;
  margin-left: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: left;
}
.info-wrapper .info-item {
  display: flex;
  color: #222222;
  margin-bottom: 8px;
}
.info-wrapper .info-item .left {
  width: 100px;
  text-align: right;
}

.tips-wrapper {
  color: #b8bcc5;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.tips-wrapper .warning-icon {
  color: #f1df50;
  font-size: 24px;
  margin-right: 16px;
}
</style>
