<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">neOmega</div>
      </template>
      <div>
        <span style="display: inline-block">
          您可以通过申请地堡 (bunker) 服务来使用 neOmega
        </span>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">ToolDelta</div>
      </template>
      <div>
        <span style="display: inline-block">
          点击以下链接前往 ToolDelta 仓库查看使用教程
        </span>
        <p style="margin-top: 16px">
          <a
            style="white-space: normal; word-wrap: break-word"
            href="https://github.com/ToolDelta-Basic/ToolDelta"
            target="_blank"
            >https://github.com/ToolDelta-Basic/ToolDelta
          </a>
        </p>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">Eulogist</div>
      </template>
      <div>
        <span>
          点击以下链接前往 Eulogist 仓库查看使用教程
        </span>
        <p style="margin-top: 16px">
          <a
            style="white-space: normal; word-wrap: break-word"
            href="https://github.com/Happy2018new/Eulogist-Community-Release"
            target="_blank"
            >https://github.com/Happy2018new/Eulogist-Community-Release
          </a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}
a {
  color: inherit;
}
</style>
