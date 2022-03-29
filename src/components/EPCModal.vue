<template>
  <a-modal
    :visible="visible"
    title="EPC"
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
      ref="EPCModal"
      :rules="rules"
    >
      <a-form-model-item label="EPC编号：" ref="epcNum" prop="epcNum">
        <a-input v-model="form.epcNum" placeholder="请输入2-50个字符" />
      </a-form-model-item>
      <a-form-model-item ref="epcName" label="模具名称：" prop="epcName">
        <a-input v-model="form.epcName" placeholder="请输入2-50个字符" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "EPCModal",
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
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
        epcNum: [{ required: true, message: "EPC编码不能为空" }],
        epcName: [{ required: true, message: "模具名称不能为空" }],
      },
    };
  },

  methods: {
    cancel() {
      this.visible = false;
    },
    ok() {
      this.$refs.EPCModal.validate((valid) => {
        if (valid) {
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
