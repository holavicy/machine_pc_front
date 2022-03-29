<template>
  <a-modal
    :visible="visible"
    title="开关记录"
    destroyOnClose
    cancelText="取消"
    okText="确定"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form-model
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      ref="openRecord"
      :rules="rules"
    >
      <a-form-model-item label="开机时间：" ref="startTime" prop="startTime">
        <a-date-picker
          v-model="form.startTime"
          show-time
          placeholder="请选择开机时间"
          @change="startTimeChange"
        />
      </a-form-model-item>
      <a-form-model-item ref="endTime" label="关机时间：" prop="endTime">
        <a-date-picker
          v-model="form.endTime"
          show-time
          placeholder="请选择关机时间"
          @change="endTimeChange"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import moment from "moment";
export default {
  name: "OpenRecordModal",
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      moment: moment,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      rules: {
        startTime: [
          { required: true, message: "开机时间不能为空", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "关机时间不能为空", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    startTimeChange(time, timeString) {
      this.form.startTime = timeString;
    },
    endTimeChange(time, timeString) {
      this.form.endTime = timeString;
    },
    cancel() {
      this.visible = false;
      this.form = this.$form.createForm(this, { name: "openRecord" });
    },
    ok() {
      this.$refs.openRecord.validate((valid) => {
        if (valid) {
          console.log(this.form);
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
