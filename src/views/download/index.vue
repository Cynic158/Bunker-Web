<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">neOmega</div>
      </template>
      <div>
        <div>您可以通过以下链接获取 neOmega 的最新版本：</div>
        <el-space wrap style="margin-top: 16px">
          <el-link
            href="https://omega-1259160345.cos.accelerate.myqcloud.com/neomega_public/omega_launcher-windows.exe"
            target="_blank"
            >Windows</el-link
          >

          <el-divider direction="vertical" />
          <el-link
            href="https://omega-1259160345.cos.accelerate.myqcloud.com/neomega_public/omega_launcher-linux"
            target="_blank"
            >Linux</el-link
          >

          <el-divider direction="vertical" />
          <el-link
            href="https://omega-1259160345.cos.accelerate.myqcloud.com/neomega_public/omega_launcher-macos"
            target="_blank"
            >macOS</el-link
          >

          <el-divider direction="vertical" />
          <el-link
            href="https://omega-1259160345.cos.accelerate.myqcloud.com/neomega_public/omega_launcher-android"
            target="_blank"
            >Android</el-link
          >
        </el-space>
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
        <div style="margin-top: 16px">
          <el-link
            href="https://github.com/ToolDelta-Basic/ToolDelta"
            target="_blank"
            >https://github.com/ToolDelta-Basic/ToolDelta</el-link
          >
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">Eulogist</div>
      </template>
      <div>
        <span> 点击以下链接前往 Eulogist 仓库查看使用教程 </span>
        <div style="margin-top: 16px">
          <el-link
            href="https://github.com/Happy2018new/Eulogist-Community-Release"
            target="_blank"
            >https://github.com/Happy2018new/Eulogist-Community-Release</el-link
          >
        </div>
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
