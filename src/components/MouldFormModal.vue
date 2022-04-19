<template>
  <a-modal
    :visible="visible"
    :title="title"
    destroyOnClose
    cancelText="取消"
    okText="确定"
    width="640px"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form-model
      ref="module"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :model="form"
      :rules="rules"
    >
      <a-form-model-item ref="epcNum" label="EPC编号" prop="epcNum">
        <a-input
          v-model="form.epcNum"
          placeholder="EPC编号需唯一且最多可输入50个字符"
          allowClear
        />
      </a-form-model-item>
      <a-form-model-item ref="name" label="模具名称" prop="name">
        <a-input
          v-model="form.name"
          placeholder="请输入2至30个字符"
          allowClear
        />
      </a-form-model-item>
      <a-form-model-item ref="supplierId" prop="supplierId">
        <span slot="label"><i class="required">*</i>供应商</span>
        <a-select
          placeholder="请选择"
          style="width: 100%"
          v-model="form.supplierId"
          @change="supplyChange"
          allowClear
        >
          <a-select-option
            v-for="d in supplyList"
            :key="d.value"
            :value="d.value"
          >
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        ref="small_limit"
        label="小保养上限"
        prop="small_limit"
        class="form-item-admin"
      >
        <a-input
          v-model="form.small_limit"
          placeholder="请输入数字"
          allowClear
        />
        <span class="append-right">次</span>
      </a-form-model-item>
      <a-form-model-item
        ref="small_maintain_item"
        prop="small_maintain_item"
        class="form-item-admin"
      >
        <span slot="label"><i class="required">*</i>小保养项目</span>
        <a-select
          mode="multiple"
          style="width: 100%"
          placeholder="请选择"
          v-model="form.small_maintain_item"
          @change="smallChange"
          allowClear
        >
          <a-select-option v-for="item in smallMaintainItem" :key="item.id">
            {{ item.item_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        ref="big_limit"
        label="大保养上限："
        prop="big_limit"
        class="form-item-admin"
      >
        <a-input v-model="form.big_limit" placeholder="请输入数字" allowClear />
        <span class="append-right"><span class="danger">千</span>次</span>
      </a-form-model-item>
      <a-form-model-item
        ref="big_maintain_item"
        prop="big_maintain_item"
        class="form-item-admin"
      >
        <span slot="label"><i class="required">*</i>大保养项目</span>
        <a-select
          mode="multiple"
          style="width: 100%"
          placeholder="请选择"
          v-model="form.big_maintain_item"
          @change="bigChange"
          allowClear
        >
          <a-select-option v-for="item in bigMaintainItem" :key="item.id">
            {{ item.item_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="adminId" prop="adminId">
        <span slot="label"><i class="required">*</i>管理员</span>
        <a-select
          placeholder="请选择"
          style="width: 100%"
          v-model="form.adminId"
          @change="adminChange"
          allowClear
        >
          <a-select-option
            v-for="d in adminList"
            :key="d.value"
            :value="d.value"
          >
            {{ d.text }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: "MouldFormModal",
  props: {
    title: {
      type: String,
      default: "新增模具",
    },
    defaultValue: {
      type: String,
      default: "",
    },
    form: {
      type: Object,
      default: () => ({
        num: "",
        small_limit: "",
        big_limit: "",
        adminId: "",
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
        xs: { span: 12 },
        sm: { span: 18 },
      },
      rules: {
        epcNum: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          },
          {
            min: 2,
            max: 50,
            message: "长度需在2~50个字符之间",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入模具名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 50,
            message: "长度需在2~50个字符之间",
            trigger: "blur",
          },
        ],
        small_limit: [
          {
            required: true,
            message: "请输入小保养上限",
            trigger: "blur",
          },
        ],
        big_limit: [
          {
            required: true,
            message: "请输入大保养上限",
            trigger: "blur",
          },
        ],
      },
      adminList: [],
      supplyList: [],
      smallMaintainItem: [],
      bigMaintainItem: [],
    };
  },

  methods: {
    cancel() {
      this.visible = false;
    },
    ok() {
      console.log(this.form);
      this.$refs.module.validate((valid) => {
        if (valid) {
          if (!this.form.adminId) {
            this.$message.error("请选择管理员");
          } else if (!this.form.small_maintain_item) {
            this.$message.error("请选择小保养项目");
          } else if (!this.form.big_maintain_item) {
            this.$message.error("请选择大保养项目");
          } else {
            this.$emit("handleOk", this.form);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // adminChange
    adminChange(value) {
      this.form.adminId = value;
      this.$forceUpdate();
    },
    // supplyChange
    supplyChange(value) {
      this.form.supplierId = value;
      this.$forceUpdate();
    },
    smallChange(value) {
      this.form.small_maintain_item = value;
      this.$forceUpdate();
    },
    bigChange(value) {
      this.form.big_maintain_item = value;
      this.$forceUpdate();
    },
  },
};
</script>

<style>
.form-item-admin .ant-form-item-children .append-right {
  width: 100px;
  font-size: 12px;
  margin-left: 10px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.form-item-admin .ant-form-item-children .append-right .danger {
  color: #ff4d4f;
}
</style>
