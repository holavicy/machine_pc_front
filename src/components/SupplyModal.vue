<template>
  <a-modal
    :visible="visible"
    title="供应商"
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
      ref="SupplyModal"
      :rules="rules"
    >
      <a-form-model-item label="编号：" ref="num" prop="num">
        <a-input v-model="form.num" placeholder="请输入2-30个字符" />
      </a-form-model-item>
      <a-form-model-item ref="name" label="名称：" prop="name">
        <a-input v-model="form.name" placeholder="请输入2-30个字符" />
      </a-form-model-item>
      <a-form-model-item ref="remark" label="备注：" prop="remark">
        <a-input v-model="form.remark" placeholder="请输入2-30个字符" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "SupplyModal",
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
        num: [{ required: true, message: "EPC编码不能为空" }],
        name: [{ required: true, message: "模具名称不能为空" }],
      },
    };
  },

  methods: {
    cancel() {
      this.visible = false;
    },
    ok() {
      this.$refs.SupplyModal.validate((valid) => {
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
