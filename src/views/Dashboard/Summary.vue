<template>
  <div class="summary">
    <div class="summary-item-wrapper">
      <div class="title">机床概览</div>
      <div class="data">
        <div class="data-item total" @click="toList('machineTool-list')">
          <div class="num">{{ machineSummary["总数量"] || 0 }}</div>
          <div class="name">总数量</div>
        </div>
        <div class="data-item used" @click="toList('machineTool-list', '0')">
          <div class="num">{{ machineSummary["正常使用"] || 0 }}</div>
          <div class="name">正常使用</div>
        </div>
        <div class="data-item error" @click="toList('machineTool-list', '4')">
          <div class="num">{{ machineSummary["待小保养"] || 0 }}</div>
          <div class="name">待小保养</div>
        </div>
        <div class="data-item error" @click="toList('machineTool-list', '5')">
          <div class="num">{{ machineSummary["待大保养"] || 0 }}</div>
          <div class="name">待大保养</div>
        </div>
        <div class="data-item warning" @click="toList('machineTool-list', '1')">
          <div class="num">{{ machineSummary["小保养中"] || 0 }}</div>
          <div class="name">小保养中</div>
        </div>
        <div class="data-item warning" @click="toList('machineTool-list', '2')">
          <div class="num">{{ machineSummary["大保养中"] || 0 }}</div>
          <div class="name">大保养中</div>
        </div>
        <div
          class="data-item stopped"
          @click="toList('machineTool-shutdownList')"
        >
          <div class="num">{{ machineSummary["已停用"] || 0 }}</div>
          <div class="name">已停用</div>
        </div>
      </div>
    </div>

    <div class="summary-item-wrapper">
      <div class="title">模具概览</div>
      <div class="data">
        <div class="data-item total" @click="toList('mould-list')">
          <div class="num">{{ mouldSummary["总数量"] || 0 }}</div>
          <div class="name">总数量</div>
        </div>
        <div class="data-item used" @click="toList('mould-list', '0')">
          <div class="num">{{ mouldSummary["正常使用"] || 0 }}</div>
          <div class="name">正常使用</div>
        </div>
        <div class="data-item error" @click="toList('mould-list', '4')">
          <div class="num">{{ mouldSummary["待小保养"] || 0 }}</div>
          <div class="name">待小保养</div>
        </div>
        <div class="data-item error" @click="toList('mould-list', '5')">
          <div class="num">{{ mouldSummary["待大保养"] || 0 }}</div>
          <div class="name">待大保养</div>
        </div>
        <div class="data-item warning" @click="toList('mould-list', '1')">
          <div class="num">{{ mouldSummary["小保养中"] || 0 }}</div>
          <div class="name">小保养中</div>
        </div>
        <div class="data-item warning" @click="toList('mould-list', '2')">
          <div class="num">{{ mouldSummary["大保养中"] || 0 }}</div>
          <div class="name">大保养中</div>
        </div>
        <div class="data-item stopped" @click="toList('mould-idleList')">
          <div class="num">{{ mouldSummary["已闲置"] || 0 }}</div>
          <div class="name">已闲置</div>
        </div>
        <div class="data-item stopped" @click="toList('mould-shutdownList')">
          <div class="num">{{ mouldSummary["已停用"] || 0 }}</div>
          <div class="name">已停用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      staffNo: "",
      isSuperAdmin: false,
      machineSummary: {},
      mouldSummary: {},
    };
  },
  created() {
    // 获取当前登录人的工号
    // 获取当前登录人的角色
    const user = this.$store.state.user;
    this.staffNo = user.staffNo;
    this.isSuperAdmin = user.isSuperAdmin;
    this.getMachineData();
    this.getMouldData();
  },
  methods: {
    toList(name, status) {
      this.$router.push({
        name: name,
        query: {
          status: status,
        },
      });
    },
    getMachineData() {
      const data = {};
      // 若不是超级管理员，则只查询自己管理的设备；是超级管理员，则查询所有的
      if (!this.isSuperAdmin) {
        data.staffNo = this.staffNo;
      }
      this.$api.GET_MACHINE_TOTAL(data).then((res) => {
        this.machineSummary = res.data.content[0];
      });
    },
    getMouldData() {
      const data = {};
      // 若不是超级管理员，则只查询自己管理的设备；是超级管理员，则查询所有的
      if (!this.isSuperAdmin) {
        data.staffNo = this.staffNo;
      }
      this.$api.GET_MOULD_TOTAL(data).then((res) => {
        this.mouldSummary = res.data.content[0];
      });
    },
  },
};
</script>

<style scoped>
.summary .summary-item-wrapper {
  margin-bottom: 80px;
}
.summary .summary-item-wrapper .title {
  height: 68px;
  line-height: 68px;
  border-left: 6px #003d74 solid;
  padding-left: 20px;
  font-size: 32px;
  color: #003d74;
  border-bottom: 1px #f0f0f2 solid;
  margin-bottom: 40px;
}

.summary .summary-item-wrapper .data {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary .summary-item-wrapper .data .data-item {
  width: 136px;
  height: 76px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  font-size: 16px;
  margin-left: 8px;
}
.summary .summary-item-wrapper .data .data-item:first-child {
  margin-left: 0;
}
.summary .summary-item-wrapper .data .data-item:hover {
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.summary .summary-item-wrapper .data .data-item .num {
  font-size: 24px;
}

.summary .summary-item-wrapper .data .data-item.total {
  background-color: #8ba3c7;
  color: #192847;
}
.summary .summary-item-wrapper .data .data-item.total:hover {
  color: #8ba3c7;
  background-color: #192847;
}

.summary .summary-item-wrapper .data .data-item.used {
  background-color: #003d74;
  color: #89a3c5;
}
.summary .summary-item-wrapper .data .data-item.used:hover {
  color: #003d74;
  background-color: #89a3c5;
}

.summary .summary-item-wrapper .data .data-item.error {
  background-color: #cd7372;
  color: #8b4b4f;
}
.summary .summary-item-wrapper .data .data-item.error:hover {
  color: #cd7372;
  background-color: #8b4b4f;
}

.summary .summary-item-wrapper .data .data-item.warning {
  background-color: #ebe172;
  color: #c3923b;
}
.summary .summary-item-wrapper .data .data-item.warning:hover {
  color: #ebe172;
  background-color: #c3923b;
}

.summary .summary-item-wrapper .data .data-item.stopped {
  background-color: #7d929f;
  color: #2f3b48;
}

.summary .summary-item-wrapper .data .data-item.stopped:hover {
  color: #7d929f;
  background-color: #2f3b48;
}
</style>
