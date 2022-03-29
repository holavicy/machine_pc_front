<template>
  <div class="machine-detail">
    <div class="title">基本信息</div>
    <div class="info">
      <div class="info-group">
        <div class="info-item">模具编号：{{ info.name }}</div>
        <div class="info-item">小保养上限：{{ info.name }}</div>
        <div class="info-item">管理员：{{ info.name }}</div>
      </div>
      <div class="info-group">
        <div class="info-item">模具名称：{{ info.name }}</div>
        <div class="info-item">大保养上限：{{ info.name }}</div>
      </div>
    </div>
    <div class="status normal">正常</div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
