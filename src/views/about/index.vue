<template>
  <div>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">Community</div>
      </template>
      <div>
        <span>您可以通过以下入口加入我们的社区：</span><br /><br />
        <span>
          <a 
            href="https://t.me/+cBXScYSrN9YxMzFl"
            target="_blank"
            >
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
