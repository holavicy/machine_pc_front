<template>
  <a-modal
    v-model="visible"
    title="管理员列表"
    destroyOnClose
    cancelText="取消"
    okText="确定"
    @ok="handleOk"
  >
    <a-table
      :row-selection="{ type: type, onSelect: onSelect }"
      :columns="columns"
      :data-source="data"
    />
  </a-modal>
</template>

<script>
export default {
  name: "AdminModal",
  props: {
    data: Array,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      type: "radio",
      admin: {},
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: "100px",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "管理员姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "工号",
          dataIndex: "staff_no",
          key: "staff_no",
          ellipsis: true,
        },
      ],
    };
  },

  methods: {
    onSelect(record) {
      this.admin = record;
    },

    handleOk() {
      if (this.admin.id) {
        this.$emit("handleOk", this.admin);
      } else {
        this.$message.error("请选择管理员");
      }
    },
  },
};
</script>
