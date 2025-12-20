<template>
  <div class="login-container">
    <el-row style="height: 100vh">
      <el-col :span="24 - loginColSpan"></el-col>
      <el-col :span="loginColSpan" style="height: 100vh; position: relative">
        <el-popover
          :width="326"
          :visible="
            !loginFormTransacting && robotVisible && currentForm !== 'login'
          "
        >
          <template #reference>
            <div class="login-form">
              <el-form
                @submit.prevent
                :model="forgetData"
                :rules="forgetRules"
                ref="forgetform"
                class="login-page login-forgetpage"
              >
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="forgetData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item prop="email_verify_code">
                    <el-row
                      class="row-bg"
                      justify="center"
                      style="width: 100%"
                      :gutter="10"
                    >
                      <el-col :span="18">
                        <el-input
                          v-model="forgetData.email_verify_code"
                          prefix-icon="Message"
                          placeholder="请输入邮箱验证码"
                          size="large"
                        />
                      </el-col>
                      <el-col :span="6">
                        <el-button
                          type="primary"
                          style="width: 100%"
                          :disabled="codeTimes > 0"
                          :loading="loadingflag || captchaExecutingFlag"
                          @click="requestEmailVerifyCode"
                          size="default"
                        >
                          {{
                            codeTimes > 0
                              ? `${codeTimes}s`
                              : captchaExecutingFlag
                                ? "检查中"
                                : loadingflag
                                  ? "处理中"
                                  : "发送"
                          }}
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="forgetData.password"
                      type="password"
                      placeholder="请输入新密码"
                      show-password
                      prefix-icon="Lock"
                      autocomplete="new-password"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item prop="repassword">
                    <el-input
                      v-model="forgetData.repassword"
                      type="password"
                      placeholder="请确认新密码"
                      show-password
                      prefix-icon="Lock"
                      autocomplete="new-password"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      native-type="submit"
                      class="login-btn"
                      @click="requestResetPassword"
                      :loading="loadingflag"
                      size="default"
                      round
                      >{{ loadingflag ? "处理中" : "修改密码" }}</el-button
                    >
                  </el-form-item>
                  <el-form-item>
                    <el-row class="row-bg" justify="center" style="width: 100%">
                      <el-col :span="20"></el-col>
                      <el-col :span="4">
                        <el-text
                          type="primary"
                          class="login-reg"
                          @click="switchpage('login')"
                          style="float: right"
                          >返回登录
                          <el-icon><ArrowRight /></el-icon>
                        </el-text>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>

              <el-form
                @submit.prevent
                :model="loginData"
                :rules="loginRules"
                ref="loginform"
                class="login-page login-loginpage"
              >
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="loginData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginData.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="Lock"
                      size="large"
                    />
                  </el-form-item>
                  <el-row :gutter="10">
                    <el-col :span="browserSupportsWebAuthn() ? 18 : 24">
                      <el-form-item>
                        <el-button
                          type="primary"
                          native-type="submit"
                          class="login-btn"
                          @click="login"
                          :loading="loadingflag"
                          size="default"
                          round
                        >
                          {{ loadingflag ? "处理中" : "登录" }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="browserSupportsWebAuthn() ? 6 : 0">
                      <el-form-item>
                        <el-button
                          type="success"
                          class="login-btn"
                          @click="webauthnLogin"
                          :loading="loadingflag"
                          size="default"
                          round
                          >{{ loadingflag ? "处理中" : "通行密钥" }}</el-button
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item>
                    <el-row
                      class="row-bg"
                      justify="space-between"
                      style="width: 100%"
                    >
                      <el-col :span="4">
                        <el-text
                          type="primary"
                          class="login-reg"
                          @click="switchpage('forget')"
                          ><el-icon><ArrowLeft /></el-icon>
                          忘记密码
                        </el-text>
                      </el-col>
                      <el-col :span="4">
                        <el-text
                          type="primary"
                          class="login-reg"
                          @click="switchpage('reg')"
                          style="float: right"
                          >用户注册
                          <el-icon><ArrowRight /></el-icon>
                        </el-text>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>
              <el-form
                @submit.prevent
                :model="regData"
                :rules="regRules"
                ref="regform"
                class="login-page login-regpage"
              >
                <div class="input-container">
                  <el-form-item prop="username">
                    <el-input
                      v-model="regData.username"
                      prefix-icon="User"
                      placeholder="请输入用户名"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="regData.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      prefix-icon="Lock"
                      autocomplete="new-password"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item prop="repassword">
                    <el-input
                      v-model="regData.repassword"
                      type="password"
                      placeholder="请确认密码"
                      show-password
                      prefix-icon="Lock"
                      autocomplete="new-password"
                      size="large"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button
                      type="primary"
                      native-type="submit"
                      class="login-btn"
                      @click="register"
                      :loading="loadingflag || captchaExecutingFlag"
                      size="default"
                      round
                    >
                      {{
                        captchaExecutingFlag
                          ? "检查环境中"
                          : loadingflag
                            ? "处理中"
                            : "注册"
                      }}
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-row class="row-bg" justify="center" style="width: 100%">
                      <el-col :span="4">
                        <el-text
                          type="primary"
                          class="login-reg"
                          @click="switchpage('login')"
                          ><el-icon><ArrowLeft /></el-icon>
                          返回登录
                        </el-text>
                      </el-col>
                      <el-col :span="20"></el-col>
                    </el-row>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </template>
          <div class="cf-turnstile"></div>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
// 导入用户仓库
import useUserStore from "@/store/modules/user";
// 导入WebAuthn仓库
import useWebAuthnStore from "@/store/modules/webauthn";
// 使用路由
import { useRouter } from "vue-router";
// element的消息通知组件
import { ElNotification } from "element-plus";
// 获取时间字符串函数
import { getTimeStr } from "@/utils/index";
import {
  browserSupportsWebAuthn,
  startAuthentication
} from "@simplewebauthn/browser";

// 使用user仓库
let userStore = useUserStore();
// 使用WebAuthn仓库
let webAuthnStore = useWebAuthnStore();
// 使用路由
let $router = useRouter();
// 人机验证显示
const robotVisible = ref(false);

// 登录卡片col span
let loginColSpan = ref(8);
// 登录卡片动画状态
let loginFormTransacting = ref(false);

// 函数：根据媒体查询调整 span
const handleMediaQueryChange = () => {
  const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
  if (window.innerWidth <= 768 || mediaQuery.matches) {
    loginColSpan.value = 24;
  } else {
    loginColSpan.value = 12;
  }
};

const handleLoginFormTransitionend = () => {
  loginFormTransacting.value = false;
};

let validateUserName = (_: any, value: any, callback: any) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(value)) {
    callback(new Error("用户名只能是大小英文以及数字"));
  } else {
    callback();
  }
};
let validateRegRePassword = (_: any, value: any, callback: any) => {
  if (value !== regData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
let validateForgetRePassword = (_: any, value: any, callback: any) => {
  if (value !== forgetData.password) {
    callback(new Error("输入的密码不相同"));
  } else {
    callback();
  }
};
// 表单校验规则
const forgetRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" }
  ],
  email_verify_code: [
    { required: true, message: "请输入邮箱验证码", trigger: "blur" },
    { min: 6, max: 6, message: "邮箱验证码有误", trigger: "blur" }
  ],
  password: [
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
    { validator: validateForgetRePassword, trigger: "blur" }
  ]
};
const loginRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    }
  ]
};
const regRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 12, message: "用户名长度为5到12位", trigger: "blur" },
    { validator: validateUserName, trigger: "blur" }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur"
    }
  ],
  repassword: [
    {
      required: true,
      message: "请确认密码",
      trigger: "blur"
    },
    { validator: validateRegRePassword, trigger: "blur" }
  ]
};

//登录部分
// 表单元素
let loginform: EleFormRef = ref(null);
let regform: EleFormRef = ref(null);
let forgetform: EleFormRef = ref(null);
// 当前表单
let currentForm = ref("login");
// 表单数据
let loginData = reactive({
  username: "",
  password: ""
});
let regData = reactive({
  username: "",
  password: "",
  repassword: ""
});
let forgetData = reactive({
  username: "",
  email_verify_code: "",
  password: "",
  repassword: ""
});
// 清空表单
let clearForm = () => {
  regData.username = "";
  regData.password = "";
  regData.repassword = "";
  loginData.username = "";
  loginData.password = "";
  forgetData.username = "";
  forgetData.email_verify_code = "";
  forgetData.password = "";
  forgetData.repassword = "";
};
// 切换注册
let switchpage = (type: "login" | "reg" | "forget") => {
  currentForm.value = type;
  // 清空校验提示
  if (loginform.value) {
    loginform.value.clearValidate(["username", "password"]);
  }
  if (regform.value) {
    regform.value.clearValidate(["username", "password", "repassword"]);
  }
  if (forgetform.value) {
    forgetform.value.clearValidate([
      "username",
      "email_verify_code",
      "password",
      "repassword"
    ]);
  }
  // 清空表单内容
  clearForm();
  // 切换页面
  loginFormTransacting.value = true;
  switch (type) {
    case "reg":
      (document.querySelector(".login-form") as HTMLFormElement).style.height =
        "290px";
      (
        document.querySelector(".login-forgetpage") as HTMLFormElement
      ).style.left = "-200%";
      (
        document.querySelector(".login-loginpage") as HTMLFormElement
      ).style.left = "-100%";
      (document.querySelector(".login-regpage") as HTMLFormElement).style.left =
        "32px";
      break;
    case "login":
      (document.querySelector(".login-form") as HTMLFormElement).style.height =
        "230px";
      (
        document.querySelector(".login-forgetpage") as HTMLFormElement
      ).style.left = "-100%";
      (
        document.querySelector(".login-loginpage") as HTMLFormElement
      ).style.left = "32px";
      (document.querySelector(".login-regpage") as HTMLFormElement).style.left =
        "100%";
      break;
    case "forget":
      (document.querySelector(".login-form") as HTMLFormElement).style.height =
        "346px";
      (
        document.querySelector(".login-forgetpage") as HTMLFormElement
      ).style.left = "32px";
      (
        document.querySelector(".login-loginpage") as HTMLFormElement
      ).style.left = "100%";
      (document.querySelector(".login-regpage") as HTMLFormElement).style.left =
        "200%";
      break;
  }
};
// 登录按钮加载状态
let loadingflag = ref(false);
let captchaExecutingFlag = ref(false);

// 请求人机验证
const requestWithCaptcha = (
  successCallback: (token: string) => void,
  failedCallback: () => void
) => {
  captchaExecutingFlag.value = true;
  turnstile.remove();
  turnstile.render(".cf-turnstile", {
    sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    theme: "light",
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

let codeTimes = ref(0);
// 请求邮箱验证码
let requestEmailVerifyCode = async () => {
  // 校验表单
  let usernameLength = forgetData.username.length;
  if (usernameLength < 5 || usernameLength > 12) {
    // 消息提示
    ElNotification({
      type: "warning",
      title: "Warning",
      message: "用户名长度为5到12位",
      duration: 3000
    });
    return;
  }
  // 请求邮箱验证码
  loadingflag.value = true;
  requestWithCaptcha(
    async (token: string) => {
      try {
        // 发起请求
        let result = await userStore.userRequestEmailVerifyCode({
          username: forgetData.username,
          action_type: 3,
          captcha_token: token
        });
        if (result.success) {
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
        loadingflag.value = false;
      }
    },
    () => {
      loadingflag.value = false;
    }
  );
};

// 请求重置密码
let requestResetPassword = async () => {
  // 校验表单
  try {
    await forgetform.value!.validate();
  } catch (error: any) {
    return;
  }
  // 显示加载
  loadingflag.value = true;
  try {
    // 发起请求
    let result = await userStore.userResetPassword({
      username: forgetData.username,
      email_verify_code: forgetData.email_verify_code,
      new_password: forgetData.password
    });
    if (result.success) {
      // 消息提示
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      // 重置成功，返回登录
      switchpage("login");
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
    loadingflag.value = false;
  }
};

// 登录事件, 登录不需要人机验证
let login = async () => {
  // 校验表单
  try {
    await loginform.value!.validate();
  } catch (error: any) {
    return;
  }
  // 直接请求登录
  // 显示加载
  loadingflag.value = true;
  // 已通过人机验证，进行登录
  let loginInfo = {
    username: loginData.username,
    password: loginData.password,
    captcha_token: ""
  };
  try {
    // 仓库发起登录请求
    let result = await userStore.userRegLog(loginInfo, "login");
    if (result!.success) {
      // 获取当前时段字符串
      let timestr: string = getTimeStr();
      // 消息提示
      ElNotification({
        type: "success",
        title: timestr,
        message: result!.message,
        duration: 3000
      });
      // 请求成功，进入首页
      $router.push("/");
      return;
    } else {
      // 请求失败，消息提示
      ElNotification({
        type: "warning",
        title: "Warning",
        message: result!.message,
        duration: 3000
      });
    }
  } catch (error: any) {
    //console.log(error);
  } finally {
    // 关闭加载
    loadingflag.value = false;
  }
};

// WebAuthn登录
let webauthnLogin = async () => {
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
  loadingflag.value = true;
  try {
    // 仓库请求登录 WebAuthn Options
    let result = await webAuthnStore.loginOptions();
    // 向验证器发起挑战
    let attResp = await startAuthentication(result.data.publicKey);
    // 仓库发起验证注册请求
    let registerResult = await webAuthnStore.loginVerification(attResp);
    if (registerResult.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: registerResult.message,
        duration: 3000
      });
      // 请求成功，进入首页，且无需解锁登录按钮
      $router.push("/");
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
    loadingflag.value = false;
  }
};

let register = async () => {
  // 校验表单
  try {
    await regform.value!.validate();
  } catch (error: any) {
    return;
  }
  // 渲染人机验证
  loadingflag.value = true;
  requestWithCaptcha(
    async (token: string) => {
      // 已通过人机验证，进行注册
      let regInfo = {
        username: regData.username,
        password: regData.password,
        captcha_token: token
      };
      try {
        // 仓库发起注册请求
        let result = await userStore.userRegLog(regInfo, "reg");
        if (result!.success) {
          // 消息提示
          ElNotification({
            type: "success",
            title: "Success",
            message: result!.message,
            duration: 3000
          });
          // 注册成功，返回登录
          switchpage("login");
        } else {
          // 请求失败，消息提示
          ElNotification({
            type: "warning",
            title: "Warning",
            message: result!.message,
            duration: 3000
          });
        }
      } catch (error: any) {
      } finally {
        // 请求完成，关闭加载
        loadingflag.value = false;
      }
    },
    () => {
      loadingflag.value = false;
    }
  );
};

// 销毁全局变量
onUnmounted(() => {
  turnstile.remove();
});

onMounted(() => {
  handleMediaQueryChange();
  window.addEventListener("resize", handleMediaQueryChange);
  document
    .querySelector(".login-form")
    ?.addEventListener("transitionend", handleLoginFormTransitionend);

  // 清空校验提示，防止登出时回到登录页还有校验提示
  loginform.value!.clearValidate(["username", "password"]);
  regform.value!.clearValidate(["username", "password", "repassword"]);
  forgetform.value!.clearValidate([
    "username",
    "email_verify_code",
    "password",
    "repassword"
  ]);

  const darkbg = localStorage.getItem("DARKMODE") === "true";
  const element = document.querySelector(".login-container") as HTMLDivElement;

  if (element) {
    if (darkbg) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  }
  document.documentElement.className = "light";

  // 初始化卡片
  switchpage("login");
});
</script>

<style scoped lang="scss">
@media only screen and (max-width: 768px), (hover: none) and (pointer: coarse) {
  .login-container {
    background-image: url("../../assets/images/bg_m.webp") !important;
  }
  .login-form {
    width: 94% !important;
    padding: 20px 16px !important;
    h1 {
      font-size: 30px !important;
    }
    h2 {
      font-size: 16px !important;
    }
  }
}
:deep(.el-input__wrapper) {
  background-color: var(--el-mask-color-extra-light) !important;
  // --el-input-placeholder-color: var(--el-text-color-primary) !important;
  --el-input-icon-color: var(--el-text-color-primary) !important;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: $color-deep-gray !important;
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}
.login-container {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/images/bg.webp");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  &.dark {
    background-image: url("../../assets/images/bg_dark.webp");
  }
  .login-form {
    width: 80%;
    min-width: 360px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s;
    border-radius: 10px;
    background-color: $login-form-bgcolor;
    padding: 20px 32px;
    box-shadow: $login-form-shadow;
    overflow: hidden;
    white-space: nowrap;
    .login-page {
      transition: all 0.3s;
      width: calc(100% - 64px);
      display: inline-block;
      position: absolute;
    }
    .login-page.login-forgetpage {
      left: -100%;
      overflow: hidden;
    }
    .login-page.login-loginpage {
      left: 32px;
      overflow: hidden;
    }
    .login-page.login-regpage {
      left: 100%;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
      border: 0;
      transition: all 0.3s;
    }
    .login-reg {
      cursor: pointer;
    }
    .login-reg:hover {
      color: #1e90ff;
    }
  }
}
</style>
