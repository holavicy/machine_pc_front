<template>
  <a-modal
    title="新增保养项目"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="保养类别" prop="type">
        <a-select style="width: 160px" v-model="form.type" placeholder="请选择">
          <a-select-option value="1"> 小保养 </a-select-option>
          <a-select-option value="2"> 大保养 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="名称" prop="name">
        <a-input placeholder="最多输入30个字符" v-model="form.name" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "MaintainItemModal",
  props: {
    form: {
      type: Object,
      default: () => ({
        type: "",
        name: "",
      }),
    },
  },
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      rules: {
        type: [{ required: true, message: "请选择保养类型" }],
        name: [
          { required: true, message: "请输入名称" },
          { min: 2, max: 30, message: "请输入2至30个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("handleOk", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      console.log("cancel");
      this.visible = false;
    },
  },
};
</script>
