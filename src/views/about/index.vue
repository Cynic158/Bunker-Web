<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">FrontEnd</div>
      </template>
      <div>
        <span>
          Powered by Vue3 + Vite + Element Plus, automatically deployed through
          Cloudflare Pages.
        </span>
        <br /><br />
        <span>
          Projcet Repository:
          <a href="https://github.com/Cynic158/Bunker-Web" target="_blank">
            Click Me
          </a>
        </span>
      </div>
    </el-card>
    <el-card shadow="hover" style="margin-top: 12px">
      <template #header>
        <div class="card-header">BackEnd</div>
      </template>
      <div>
        <span>
          Powered by Gin + Gorm, secured behind Cloudflare Reverse Proxy.
        </span>
        <br /><br />
        <span>
          Projcet Repository:
          <a href="https://github.com/CoozillaX/bunker-web" target="_blank">
            Click Me
          </a>
        </span>
      </div>
    </el-card>
    <el-card shadow="hover" style="margin-top: 12px">
      <template #header>
        <div class="card-header">Community</div>
      </template>
      <div>
        <span>您可以通过以下入口加入我们的社区：</span><br /><br />
        <span>
          <a href="https://t.me/+cBXScYSrN9YxMzFl" target="_blank">
            Telegram 群组
          </a>
        </span>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  align-items: center;
}

a:visited {
  color: inherit;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}
.author {
  margin-left: 12px;
  font-size: 18px;
}
</style>
