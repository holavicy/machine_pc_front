<template>
  <div class="machine-modal">
    <a-modal
      :visible="visible"
      :title="title"
      destroyOnClose
      :footer="null"
      width="800px"
      @cancel="cancel"
    >
      <!-- <div class="top-wrapper">
        <div class="search-wrapper">
          <div class="search-item">
            <label for="">设备名称：</label>
            <a-input
              placeholder="请输入设备名称"
              size="small"
              v-model="staffName"
            />
          </div>
          <div class="search-item">
            <label for="">设备编号：</label>
            <a-input
              placeholder="请输入设备编号"
              size="small"
              v-model="staffNo"
            />
          </div>
        </div>
        <div class="top-actions">
          <a-button class="button-cus" size="small" @click="search"
            >查询</a-button
          >
        </div>
      </div> -->
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="data"
        :scroll="{ y: 200 }"
        :pagination="false"
        class="mini-table"
      >
        <template slot="cate" slot-scope="record">
          {{ cateIdDict[record.cate_id] }}
        </template>
        <template slot="action" slot-scope="record">
          <div class="actions">
            <a-popconfirm
              title="确定移除此设备？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="remove(record)"
              v-if="type == 1"
            >
              <a href="#" class="danger">移除</a></a-popconfirm
            >
            <a-popconfirm
              title="确定加入管理此设备？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="add(record)"
              v-if="type == 2"
            >
              <a href="#">加入</a></a-popconfirm
            >
          </div>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { cateIdDict } from "../utils/tools";
export default {
  name: "MachineModal",
  props: {
    type: {
      type: Number,
      default: 1,
    },
    data: Array,
  },
  computed: {
    title() {
      return this.type == 1 ? "已管理设备列表" : "分配设备";
    },
  },
  data() {
    return {
      visible: false,
      cateIdDict,
      columns: [
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          width: "100px",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "类别",
          key: "cate",
          scopedSlots: { customRender: "cate" },
        },
        {
          title: "名称",
          dataIndex: "name",
          key: "name",
          ellipsis: true,
        },
        {
          title: "编号",
          dataIndex: "num",
          key: "num",
          ellipsis: true,
        },
        {
          title: "操作",
          key: "operation",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },

  methods: {
    cancel() {
      this.visible = false;
    },
    remove(record) {
      this.$emit("remove", record.id);
    },
    add(record) {
      const data = {
        name: record.name,
        num: record.num,
      };
      this.$emit("add", data);
    },
  },
};
</script>

<style>
.ant-col-sm-12 {
  width: 66%;
}
.mini-table /deep/ .ant-table {
  font-size: 12px;
}
</style>
