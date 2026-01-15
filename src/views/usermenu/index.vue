<template>
  <div>
    <el-popover
      trigger="click"
      placement="top"
      :width="326"
      :virtual-ref="dynamicTurnstileVirtualRef"
      :visible="robotVisible && dynamicTurnstileVirtualRef !== undefined"
      virtual-triggering
    >
      <div class="cf-turnstile"></div>
    </el-popover>
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">我的信息</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray">
            您可以登入绑定的游戏ID下的所有服务器
          </span>
        </div>
        <el-divider border-style="dashed" />
        <el-descriptions
          class="margin-top"
          :direction="settingStore.infoDirection"
          :column="settingStore.infoCol"
          size="default"
          border
        >
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <UserFilled />
                </el-icon>
                用户名
              </div>
            </template>
            {{ userStore.uname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <Coordinate />
                </el-icon>
                游戏ID
              </div>
            </template>
            {{ userStore.uid }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon"> <Tools /> </el-icon>
                用户权限
              </div>
            </template>
            {{ userPermissionStr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="userinfo-cell-item">
                <el-icon class="userinfo-cell-item-icon">
                  <Connection />
                </el-icon>
                创建时间
              </div>
            </template>
            {{ createTime }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <el-card
      v-loading="bindLoading"
      style="margin-top: 12px"
      shadow="hover"
      v-if="userStore.uid == '未绑定'"
    >
      <template #header>
        <div class="card-header">绑定游戏ID</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >将您的游戏ID绑定为当前游戏账号的ID</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-button type="primary" round native-type="submit" @click="gameIDBind"
          >绑定</el-button
        >
      </div>
    </el-card>

    <el-card
      v-loading="unbindLoading"
      style="margin-top: 12px"
      shadow="hover"
      v-else
    >
      <template #header>
        <div class="card-header">解绑游戏ID</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >解绑已绑定的游戏ID</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-button
          type="danger"
          round
          native-type="submit"
          @click="gameIDUnbind"
          >解绑</el-button
        >
      </div>
    </el-card>

    <el-card v-loading="tokenLoading" style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">FBToken</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >为 Minecraft 客户端程序提供的登录凭证</span
          >
        </div>
        <el-divider border-style="dashed" />
        <Precode
          v-if="tokenContent"
          :code="tokenContent"
          :type="'none'"
          style="margin-bottom: 24px"
        />
        <el-button
          type="primary"
          round
          native-type="submit"
          @click="tokenDownload"
          >获取</el-button
        >
      </div>
    </el-card>

    <el-card v-loading="apikeyLoading" style="margin-top: 12px" shadow="hover">
      <template #header>
        <div class="card-header">API Key</div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >为 API 调用提供的用户凭证, API Key 会给予调用者控制您账户的权限,
          请勿随意泄露</span
        >
      </div>
      <el-divider border-style="dashed" />
      <Precode v-if="userStore.uapi" :code="userStore.uapi" :type="'none'" />
      <el-button type="primary" round @click="apikeyGen" v-if="!userStore.uapi"
        >生成</el-button
      >
      <el-button type="danger" round @click="apikeyDis" v-if="userStore.uapi"
        >删除</el-button
      >
    </el-card>

    <el-card style="margin-top: 12px" shadow="hover" v-if="userStore.uhasEmail">
      <template #header>
        <div class="card-header">
          修改密码
          <el-tag type="warning" style="margin-left: 5px">人机验证</el-tag>
        </div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >更新您的登录密码</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-form
          @submit.prevent
          class="password-form-container"
          :model="passwordData"
          :rules="changePasswordRules"
          ref="passwordform"
        >
          <el-form-item label="邮箱验证码" prop="emailVerifyCode">
            <el-row class="row-bg" justify="center" style="width: 100%">
              <el-col :span="18" style="padding-right: 10px">
                <el-input
                  v-model="passwordData.emailVerifyCode"
                  placeholder="输入邮箱验证码"
                />
              </el-col>
              <el-col :span="6">
                <el-button
                  ref="changePasswordEmailCodeBtnRef"
                  type="primary"
                  style="width: 100%"
                  @click="sendEmailCode('changePassword')"
                  :disabled="codeTimes > 0"
                  :loading="emailCodeLoadingFlag"
                >
                  {{ codeTimes > 0 ? `${codeTimes}s` : "发送" }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="输入新密码" prop="newPassword">
            <el-input
              type="password"
              show-password
              v-model="passwordData.newPassword"
              placeholder="请输入新密码"
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="repassword">
            <el-input
              type="password"
              show-password
              v-model="passwordData.repassword"
              placeholder="请确认新密码"
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button
              :loading="passwordloadingflag"
              type="primary"
              native-type="submit"
              @click="changePassword"
              >修改密码</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      style="margin-top: 12px"
      shadow="hover"
      v-if="!userStore.uhasEmail"
    >
      <template #header>
        <div class="card-header">
          绑定邮箱
          <el-tag type="warning" style="margin-left: 5px">人机验证</el-tag>
        </div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray"
          >为您的账户绑定安全邮箱, 绑定后可进行修改密码等操作</span
        >
      </div>
      <el-divider border-style="dashed" />
      <el-form
        @submit.prevent
        class="limited-form-container"
        :model="emailBindData"
        :rules="bindEmailRules"
        ref="emailbindform"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailBindData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%">
            <el-col :span="18" style="padding-right: 10px">
              <el-input
                v-model="emailBindData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                ref="emailBindEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('emailBind')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `${codeTimes}s` : "发送" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="emailbindloadingflag"
            type="primary"
            native-type="submit"
            @click="bindEmail"
          >
            绑定
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 12px" shadow="hover" v-if="userStore.uhasEmail">
      <template #header>
        <div class="card-header">
          解绑邮箱
          <el-tag type="warning" style="margin-left: 5px">人机验证</el-tag>
        </div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray">
          解绑您的账户的安全邮箱, 解绑后无法进行修改密码等操作
        </span>
      </div>
      <el-divider border-style="dashed" />
      <el-form
        @submit.prevent
        class="limited-form-container"
        :model="emailUnbindData"
        :rules="unbindEmailRules"
        ref="emailunbindform"
      >
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%">
            <el-col :span="18" style="padding-right: 10px">
              <el-input
                v-model="emailUnbindData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                ref="emailUnbindEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('emailUnbind')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `${codeTimes}s` : "发送" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="emailunbindloadingflag"
            type="danger"
            native-type="submit"
            @click="unbindEmail"
          >
            解绑
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 12px" shadow="hover" v-if="userStore.uhasEmail">
      <template #header>
        <div class="card-header">
          删除账户
          <el-tag type="warning" style="margin-left: 5px">人机验证</el-tag>
        </div>
      </template>
      <div class="card-footer">
        <el-icon>
          <ChatDotRound />
        </el-icon>
        <span style="margin-left: 12px; color: dimgray">
          立即删除账户的所有信息且无法恢复, 请谨慎操作
        </span>
      </div>
      <el-divider border-style="dashed" />
      <el-form
        @submit.prevent
        class="limited-form-container"
        :model="deleteAccountData"
        :rules="deleteAccountRules"
        ref="deleteaccountform"
      >
        <el-form-item label="邮箱验证码" prop="emailVerifyCode">
          <el-row class="row-bg" justify="center" style="width: 100%">
            <el-col :span="18" style="padding-right: 10px">
              <el-input
                v-model="deleteAccountData.emailVerifyCode"
                placeholder="输入邮箱验证码"
              />
            </el-col>
            <el-col :span="6">
              <el-button
                ref="deleteAccountEmailCodeBtnRef"
                type="primary"
                style="width: 100%"
                @click="sendEmailCode('deleteAccount')"
                :disabled="codeTimes > 0"
                :loading="emailCodeLoadingFlag"
              >
                {{ codeTimes > 0 ? `${codeTimes}s` : "发送" }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 0">
          <el-button
            :loading="deleteaccountloadingflag"
            type="danger"
            native-type="submit"
            @click="deleteAccount"
          >
            删除
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card
      shadow="hover"
      v-loading="webAuthnLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">通行密钥</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >管理绑定至您账户的通行密钥</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-table
          :data="webAuthnStore.credentialsData"
          class="limited-form-container"
          max-height="250"
        >
          <el-table-column prop="create_at" label="创建时间" width="160">
            <template #default="scope">
              {{ getTimeStr2(scope.row.create_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="raw_id" label="RawID" width="480" />
          <el-table-column fixed="right" label="操作" width="60">
            <template #default="scope">
              <el-button
                link
                type="danger"
                size="small"
                @click.prevent="removeWebAuthn(scope?.row?.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="width: 100%; margin-top: 10px"
          class="limited-form-container"
          @click.prevent="addWebAuthn"
        >
          添加
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入设置仓库
import useSettingStore from "@/store/modules/setting";
import {
  computed,
  onActivated,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from "vue";
// 导入WebAuthn仓库
import useWebAuthnStore from "@/store/modules/webauthn";
// 导入时间转换函数
import { getTimeStr2 } from "@/utils";
// 导入消息通知组件
import { ElNotification } from "element-plus";
// 导入路由
import { useRouter } from "vue-router";
// 导入WebAuthn
import {
  startRegistration,
  browserSupportsWebAuthn
} from "@simplewebauthn/browser";
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage;
// 使用设置仓库的移动端适配
let settingStore = useSettingStore();
// 使用用户仓库
let userStore = useUserStore();
// 使用WebAuthn仓库
let webAuthnStore = useWebAuthnStore();
// 使用路由
let $router = useRouter();
// 人机验证动态虚拟ref
let dynamicTurnstileVirtualRef = ref(undefined);
// 人机验证显示
const robotVisible = ref(false);
// 人机验证
let captchaExecutingFlag = ref(false);
// 修改密码发送验证码按钮ref
const changePasswordEmailCodeBtnRef = ref();
// 绑定邮箱发送验证码按钮ref
const emailBindEmailCodeBtnRef = ref();
// 解绑邮箱发送验证码按钮ref
const emailUnbindEmailCodeBtnRef = ref();
// 删除账户发送验证码按钮ref
const deleteAccountEmailCodeBtnRef = ref();

// 请求人机验证
const requestWithCaptcha = (
  successCallback: (token: string) => void,
  failedCallback: () => void
) => {
  captchaExecutingFlag.value = true;
  turnstile.remove();
  turnstile.render(".cf-turnstile", {
    sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    theme:
      exportedLocalStorage.getItem("DARKMODE") === "true" ? "dark" : "light",
    size: "normal",
    callback: async (token: string, _: boolean) => {
      captchaExecutingFlag.value = false;
      robotVisible.value = false;
      turnstile.remove();
      successCallback(token);
    },
    "error-callback": () => {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: "人机验证未通过",
        duration: 3000
      });
      captchaExecutingFlag.value = false;
      robotVisible.value = false;
      turnstile.remove();
      failedCallback();
    },
    "before-interactive-callback": () => {
      robotVisible.value = true;
    },
    "after-interactive-callback": () => {
      robotVisible.value = false;
    }
  });
};

let apikeyLoading = ref(false);
let apikeyGen = async () => {
  apikeyLoading.value = true;
  try {
    let result = await userStore.userGenApi();
    if (result.success && result.data) {
      userStore.uapi = result.data.api_key;
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
    } else {
      // 获取失败
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    apikeyLoading.value = false;
  }
};
let apikeyDis = async () => {
  apikeyLoading.value = true;
  try {
    let result = await userStore.userDisApi();
    if (result.success) {
      userStore.uapi = "";
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
    } else {
      // 获取失败
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    apikeyLoading.value = false;
  }
};

// 用户信息部分
let getInfo = async () => {
  // 获取用户信息
  await userStore.userInfo();
};
// 用户的创建时间以及过期时间
const createTime = computed(() => {
  let timestr = getTimeStr2(Number(userStore.ucreate));
  return timestr;
});
const userPermissionStr = computed(() => {
  if (userStore.upermission === "") {
    return "未知";
  }
  let permission = Number(userStore.upermission);
  switch (permission) {
    case 0:
      return `普通用户(${permission})`;
    case 1:
      return `开发者(${permission})`;
    case 2:
      return `系统管理员(${permission})`;
    default:
      return `未知(${permission})`;
  }
});

// token部分
// Alert Title
let tokenContent = ref("");
// token获取loading
let tokenLoading = ref(false);
// 请求phoenixtoken
let tokenDownload = async () => {
  tokenLoading.value = true;
  try {
    let result = await userStore.userReqFBToken();
    if (!result.message) {
      ElNotification({
        type: "success",
        title: "Success",
        message: "请留意浏览器下载内容",
        duration: 3000
      });
      tokenContent.value = result.toString();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
      tokenContent.value = "";
    }
  } catch (error) {
    //console.log(error);
  } finally {
    tokenLoading.value = false;
  }
};

// 修改密码部分
// 表单元素
let passwordform: EleFormRef = ref(null);
// 表单数据
let passwordData = reactive({
  emailVerifyCode: "",
  newPassword: "",
  repassword: ""
});
// 清空表单
let clearForm = () => {
  passwordData.emailVerifyCode = "";
  passwordData.newPassword = "";
  passwordData.repassword = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (passwordform.value) {
        passwordform.value.clearValidate([
          "emailVerifyCode",
          "newPassword",
          "repassword"
        ]);
      }
    }, 200);
  } catch (error) {
    //console.log(error);
  }
};
// 每次进入子页面就清空表单
onActivated(() => {
  clearForm();
});
let validateRePassword = (_: any, value: any, callback: any) => {
  if (value !== passwordData.newPassword) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// 表单校验规则
const bindEmailRules = {
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur"
    },
    {
      type: "email",
      message: "请输入正确的邮箱",
      trigger: ["blur", "change"]
    }
  ],
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur"
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" }
  ]
};
const unbindEmailRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur"
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" }
  ]
};
const changePasswordRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur"
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" }
  ],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur"
    }
  ],
  repassword: [
    {
      required: true,
      message: "请确认新密码",
      trigger: "blur"
    },
    { validator: validateRePassword, trigger: "blur" }
  ]
};
const deleteAccountRules = {
  emailVerifyCode: [
    {
      required: true,
      message: "请输入邮箱验证码",
      trigger: "blur"
    },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" }
  ]
};

let emailCodeLoadingFlag = ref(false);
let codeTimes = ref(0);
// 发送邮箱验证码
let sendEmailCode = async (type: String) => {
  emailCodeLoadingFlag.value = true;
  // 切换动态虚拟ref
  switch (type) {
    case "emailBind":
      dynamicTurnstileVirtualRef.value = emailBindEmailCodeBtnRef.value;
      break;
    case "emailUnbind":
      dynamicTurnstileVirtualRef.value = emailUnbindEmailCodeBtnRef.value;
      break;
    case "changePassword":
      dynamicTurnstileVirtualRef.value = changePasswordEmailCodeBtnRef.value;
      break;
    case "deleteAccount":
      dynamicTurnstileVirtualRef.value = deleteAccountEmailCodeBtnRef.value;
      break;
    default:
      break;
  }
  // // 如果人机验证正在执行
  // if (captchaExecutingFlag.value) {
  //   // 等待完成
  //   let result = await new Promise((resolve) => {
  //     let timer = setInterval(() => {
  //       // 如果人机验证完成
  //       if (!captchaExecutingFlag.value) {
  //         clearInterval(timer);
  //         resolve(true);
  //       }
  //       if (dynamicTurnstileVirtualRef.value === undefined){
  //         clearInterval(timer);
  //         resolve(false);
  //       }
  //     }, 1000);
  //   });
  //   if (!result) {
  //     return;
  //   }
  // }
  // 尝试获取验证码
  // 解绑动态虚拟ref
  dynamicTurnstileVirtualRef.value = undefined;
  // 根据类型组装请求参数
  let requestEmailVerifyCodeInfo = {
    email: "",
    action_type: 0,
    captcha_token: ""
  };
  switch (type) {
    case "emailBind":
      requestEmailVerifyCodeInfo.action_type = 0;
      requestEmailVerifyCodeInfo.email = emailBindData.email;
      break;
    case "emailUnbind":
      requestEmailVerifyCodeInfo.action_type = 1;
      break;
    case "changePassword":
      requestEmailVerifyCodeInfo.action_type = 2;
      break;
    case "deleteAccount":
      requestEmailVerifyCodeInfo.action_type = 4;
      break;
    default:
      break;
  }
  // 发送验证码
  requestWithCaptcha(
    async (token: string) => {
      requestEmailVerifyCodeInfo.captcha_token = token;
      try {
        // 仓库发起邮箱验证码请求
        let result = await userStore.userRequestEmailVerifyCode(
          requestEmailVerifyCodeInfo
        );
        if (result.success) {
          // 请求成功，清空表单
          clearForm();
          // 消息提示
          ElNotification({
            type: "success",
            title: "Success",
            message: result.message,
            duration: 3000
          });
          // 开始倒计时
          codeTimes.value = 60;
          let timer = setInterval(() => {
            codeTimes.value--;
            if (codeTimes.value < 1) {
              clearInterval(timer);
            }
          }, 1000);
        } else {
          // 请求失败，消息提示
          ElNotification({
            type: "warning",
            title: "Warning",
            message: result.message,
            duration: 3000
          });
        }
      } catch (error: any) {
      } finally {
        // 请求完成，关闭加载
        emailCodeLoadingFlag.value = false;
      }
    },
    () => {
      emailCodeLoadingFlag.value = false;
    }
  );
};

// 绑定邮箱
let emailbindform: EleFormRef = ref(null);
let emailbindloadingflag = ref(false);
let emailBindData = reactive({
  email: "",
  emailVerifyCode: ""
});
let bindEmail = async () => {
  try {
    await emailbindform.value!.validate();
    // 显示加载
    emailbindloadingflag.value = true;
    // 仓库发起绑定邮箱请求
    let result = await userStore.userEmailBind({
      email: emailBindData.email,
      email_verify_code: emailBindData.emailVerifyCode
    });
    if (result.success) {
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 刷新信息
      getInfo();
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    emailbindloadingflag.value = false;
  }
};

// 解绑邮箱
let emailunbindform: EleFormRef = ref(null);
let emailunbindloadingflag = ref(false);
let emailUnbindData = reactive({
  emailVerifyCode: ""
});
let unbindEmail = async () => {
  try {
    await emailunbindform.value!.validate();
    // 显示加载
    emailunbindloadingflag.value = true;
    // 仓库发起解绑邮箱请求
    let result = await userStore.userEmailUnbind({
      email_verify_code: emailUnbindData.emailVerifyCode
    });
    if (result.success) {
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 刷新信息
      getInfo();
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    emailunbindloadingflag.value = false;
  }
};

// 修改密码
// 修改按钮加载状态
let passwordloadingflag = ref(false);
let changePassword = async () => {
  try {
    await passwordform.value!.validate();
    // 显示加载
    passwordloadingflag.value = true;
    let passwordInfo = {
      email_verify_code: "",
      new_password: ""
    };
    passwordInfo.email_verify_code = passwordData.emailVerifyCode;
    passwordInfo.new_password = passwordData.newPassword;
    // 仓库发起修改密码请求
    let result = await userStore.userPassword(passwordInfo);
    if (result.success) {
      // 请求成功，清空表单
      clearForm();
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error: any) {
  } finally {
    // 请求完成，关闭加载
    passwordloadingflag.value = false;
  }
};

// WebAuthn信息列表
let webAuthnLoading = ref(false);

// 添加通行密钥
let addWebAuthn = async () => {
  // 检查浏览器是否支持WebAuthn
  if (!browserSupportsWebAuthn()) {
    ElNotification({
      type: "warning",
      title: "Warning",
      message: "当前浏览器不支持WebAuthn",
      duration: 3000
    });
    return;
  }
  webAuthnLoading.value = true;
  try {
    // 仓库请求注册 WebAuthn Options
    let result = await webAuthnStore.registerOptions();
    // 向验证器发起挑战
    let attResp = await startRegistration(result.data.publicKey);
    // 仓库发起验证注册请求
    let registerResult = await webAuthnStore.registerVerification(attResp);
    if (registerResult.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: registerResult.message,
        duration: 3000
      });
      // 请求刷新列表
      getInfo();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: registerResult.message,
        duration: 3000
      });
    }
  } catch (error: any) {
    ElNotification({
      type: "warning",
      title: "Warning",
      message: error.message,
      duration: 3000
    });
  } finally {
    // 请求完成，关闭加载
    webAuthnLoading.value = false;
  }
};

// 移除 WenAuthn
let removeWebAuthn = async (credentialID: number) => {
  webAuthnLoading.value = true;
  try {
    // 仓库请求删除 WebAuthn
    let result = await webAuthnStore.removeById({
      credential_id: credentialID
    });
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 请求刷新列表
      getInfo();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error: any) {
  } finally {
    // 请求完成，关闭加载
    webAuthnLoading.value = false;
  }
};

// 绑定游戏账号
// 绑定卡片loading
let bindLoading = ref(false);
// 绑定游戏ID
let gameIDBind = async () => {
  try {
    // 显示加载
    bindLoading.value = true;
    // 仓库发起请求
    let result = await userStore.userGameIDBind();
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000,
        dangerouslyUseHTMLString: true
      });
      // 刷新信息
      getInfo();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    bindLoading.value = false;
  }
};

// 解绑游戏账号
let unbindLoading = ref(false);
let gameIDUnbind = async () => {
  try {
    // 显示加载
    unbindLoading.value = true;
    // 仓库发起请求
    let result = await userStore.userGameIDUnbind();
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 刷新信息
      getInfo();
    } else {
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error) {
    //console.log(error);
  } finally {
    unbindLoading.value = false;
  }
};

// 删除账户
let deleteaccountform: EleFormRef = ref(null);
let deleteaccountloadingflag = ref(false);
let deleteAccountData = reactive({
  emailVerifyCode: ""
});
let deleteAccount = async () => {
  try {
    await deleteaccountform.value!.validate();
    // 显示加载
    deleteaccountloadingflag.value = true;
    // 仓库发起解绑邮箱请求
    let result = await userStore.userDeleteAccount({
      email_verify_code: deleteAccountData.emailVerifyCode
    });
    if (result.success) {
      // 请求成功，登出
      $router.push("/login");
      // 通知
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result.message,
        duration: 3000
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 请求完成，关闭加载
    deleteaccountloadingflag.value = false;
  }
};

onUnmounted(() => {
  turnstile.remove();
});
onMounted(() => {
  getInfo();
});
</script>

<style scoped lang="scss">
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.userinfo-cell-item {
  display: flex;
  align-items: center;
  .userinfo-cell-item-icon {
    margin-right: 8px;
  }
}
.password-form-container,
.limited-form-container {
  max-width: 600px;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
