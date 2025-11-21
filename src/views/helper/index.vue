<template>
  <div>
    <el-card shadow="hover" v-loading="createDefaultLoading || queryLoading">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">Bot 账号</span>
        </div>
      </template>

      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >Bot 账号是进入服务器时使用的账号, 建议使用游客登录</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-alert
          :title="alertTitle"
          :type="alertType"
          show-icon
          :closable="false"
        />
        <el-divider border-style="dashed" />
        <div style="display: inline-flex; align-items: center; flex-wrap: wrap">
          <el-button
            @click="getBotStatus"
            type="primary"
            round
            :loading="queryLoading"
            >刷新</el-button
          >
          <el-button
            v-if="helperStore.realname_url"
            @click="realNameLink"
            type="warning"
            round
            >实名</el-button
          >
          <el-button
            v-if="helperStore.set && isLoaded"
            @click="unbindDialog"
            type="danger"
            round
            >解绑</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card
      v-if="!helperStore.set && isLoaded"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
      shadow="hover"
    >
      <template #header>
        <div class="card-header">
          游客登录
          <el-tag type="success" style="margin-left: 5px">推荐</el-tag>
        </div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >新建一个游客账号作为Bot</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-alert
          v-if="createAlertTitle"
          style="margin-bottom: 16px"
          :title="createAlertTitle"
          :type="createAlertType"
          show-icon
          :closable="false"
        />
        <div style="display: inline-flex; align-items: center; flex-wrap: wrap">
          <el-button type="primary" round @click="createBotByDefault"
            >创建</el-button
          >
          <el-button type="warning" round @click="verifyLink" v-if="guestVerify"
            >验证</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-show="!helperStore.set && isLoaded"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">
          手机登录
          <el-tag type="warning" style="margin-left: 5px">人机验证</el-tag>
        </div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray">
            使用您提供的手机账号作为Bot (可自行更换皮肤)
          </span>
        </div>
        <el-divider border-style="dashed" />
        <el-alert
          v-if="phoneAlertTitle"
          style="margin-bottom: 16px"
          :title="phoneAlertTitle"
          :type="phoneAlertType"
          show-icon
          :closable="false"
        />
        <el-form
          @submit.prevent
          class="phone-form-container"
          :model="phoneData"
          :rules="phoneRules"
          ref="phoneform"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="phoneData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="phoneData.code" placeholder="请输入验证码" />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <div
              style="display: inline-flex; align-items: center; flex-wrap: wrap"
            >
              <el-button
                type="primary"
                native-type="submit"
                @click="createBotByPhone"
                >创建</el-button
              >
              <el-popover
                :width="326"
                :visible="!helperStore.set && robotVisible"
                placement="right-end"
              >
                <template #reference>
                  <el-button
                    v-if="!codeTimeShow"
                    type="primary"
                    @click="getCode"
                    :loading="codeloadingflag || captchaExecutingFlag"
                    :disabled="codedisabled"
                    >{{
                      captchaExecutingFlag
                        ? "检查环境中"
                        : codeloadingflag
                          ? "处理中"
                          : "获取验证码"
                    }}
                  </el-button>
                  >
                </template>
                <div class="cf-turnstile"></div>
              </el-popover>
              <el-button v-if="codeTimeShow" type="primary" disabled>{{
                `${codeTimes}s`
              }}</el-button>
              <el-button type="warning" @click="verifyLink" v-if="phoneVerify"
                >验证</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="!helperStore.set && isLoaded"
      v-loading="createDefaultLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">邮箱登录</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用您提供的邮箱账号作为Bot (可自行更换皮肤)</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-alert
          v-if="emailAlertTitle"
          style="margin-bottom: 16px"
          :title="emailAlertTitle"
          :type="emailAlertType"
          show-icon
          :closable="false"
        />

        <el-form
          @submit.prevent
          class="email-form-container"
          :model="emailData"
          :rules="rules"
          ref="emailform"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="emailData.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              show-password
              v-model="emailData.password"
              placeholder="请输入密码"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <div
              style="display: inline-flex; align-items: center; flex-wrap: wrap"
            >
              <el-button
                type="primary"
                native-type="submit"
                @click="createBotByEmail"
                >创建</el-button
              >
              <el-button type="warning" @click="verifyLink" v-if="emailVerify"
                >验证</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-if="helperStore.username && isLoaded"
      v-loading="queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">更改昵称</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >更改 Bot 的游戏昵称</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-form
          @submit.prevent
          class="botname-form-container"
          :model="botnameData"
          :rules="rules2"
          ref="botnameform"
        >
          <el-form-item label="新昵称" prop="username">
            <el-input
              v-model="botnameData.username"
              placeholder="请输入新昵称"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="changeDialog"
              >更改</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="unbindDialogVisible"
      title="解绑"
      align-center
    >
      确定解绑 Bot 吗？当前保存的游戏账号信息将会被彻底清空。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button :loading="unbindLoading" type="danger" @click="unbindBot"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :width="settingStore.createDialogWidth"
      v-model="changeDialogVisible"
      title="更改游戏昵称"
      align-center
    >
      确定更改 Bot 游戏昵称吗？更改成功后会进入30天冷却期。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changeDialogVisible = false">取消</el-button>
          <el-button
            :loading="changeLoading"
            type="danger"
            @click="changeBotName"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入bot仓库
import useHelperStore from "@/store/modules/helper";
// 导入消息通知组件
import { ElNotification } from "element-plus";
import { onMounted, onUnmounted, reactive, ref } from "vue";
// 使用设置仓库的移动端适配
import useSettingStore from "@/store/modules/setting";
let settingStore = useSettingStore();

// 人机验证显示
const robotVisible = ref(false);
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage;

// bot信息部分
// 使用bot仓库
let helperStore = useHelperStore();
// 查询loading
let queryLoading = ref(false);
// 解绑按钮禁止
let isLoaded = ref(false);
// 提示类型
let alertType = ref("warning");
// 提示消息
let alertTitle = ref("查询中");
// 实名链接函数
let realNameLink = () => {
  window.open(helperStore.realname_url, "_blank");
};
// 验证链接函数
let verify_url = "";
let verifyLink = () => {
  window.open(verify_url, "_blank");
};
// 获取bot信息
let getBotStatus = async () => {
  try {
    queryLoading.value = true;
    let result = await helperStore.getBot();
    if (result.success) {
      alertType.value = "success";
      if (result.data) {
        alertTitle.value =
          result.data.username +
          ` [Lv.${result.data.lv} (${result.data.exp}/${result.data.total_exp})]`;
      }
    } else {
      alertType.value = "warning";
      alertTitle.value = result.message;
    }
    isLoaded.value = true;
  } catch (error: any) {
  } finally {
    queryLoading.value = false;
  }
};
// 初次进入就查询一次
onMounted(() => {
  getBotStatus();
});

// 创建bot部分
// 游客创建
// 游客创建loading
let createDefaultLoading = ref(false);
// 游客卡片提示
// 提示类型
let createAlertType = ref("success");
// 验证按钮
let guestVerify = ref(false);
// 提示消息
let createAlertTitle = ref("");
let createBotByDefault = async () => {
  try {
    createDefaultLoading.value = true;
    let result = await helperStore.botCreate();
    guestVerify.value = false;
    createAlertTitle.value = result.message;
    if (result.success) {
      createAlertType.value = "success";
    } else {
      if (result.data && result.data.verify_url) {
        createAlertType.value = "warning";
        verify_url = result.data.verify_url;
        guestVerify.value = true;
        ElNotification({
          type: "warning",
          title: "Warning",
          message: "请按要求完成验证后再次点击创建按钮",
          duration: 3000
        });
      } else {
        createAlertType.value = "error";
        ElNotification({
          type: "error",
          title: "Error",
          message: result.message,
          duration: 3000
        });
      }
    }
  } catch (error: any) {
  } finally {
    createDefaultLoading.value = false;
    getBotStatus();
  }
};

// 邮箱创建
// 表单元素
let emailform: EleFormRef = ref(null);
// 表单数据
let emailData = reactive({
  username: "",
  password: ""
});
// 清空表单
let clearForm = () => {
  emailData.username = "";
  emailData.password = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (emailform.value) {
        emailform.value.clearValidate(["username", "password"]);
      }
    }, 200);
  } catch (error) {}
};
let validateEmail = (_: any, value: any, callback: any) => {
  // 邮箱正则表达式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    callback(new Error("邮箱格式不正确"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = {
  username: [
    {
      required: true,
      message: "账号不能为空",
      trigger: "blur"
    },
    { validator: validateEmail, trigger: "blur" }
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur"
    }
  ]
};
// 邮箱卡片提示
// 提示类型
let emailAlertType = ref("warning");
// 提示消息
let emailAlertTitle = ref("");
// 验证按钮
let emailVerify = ref(false);
// 邮箱登录
let createBotByEmail = async () => {
  try {
    await emailform.value!.validate();
    // 显示加载
    createDefaultLoading.value = true;
    let emailInfo = {
      username: "",
      password: "",
      password_level: -1
    };
    emailInfo.username = emailData.username;
    emailInfo.password = emailData.password;
    // 仓库发起邮箱登录请求
    let result = await helperStore.botCreateByEmail(emailInfo);
    emailVerify.value = false;
    emailAlertTitle.value = result.message;
    if (result.success) {
      emailAlertType.value = "success";
      clearForm();
    } else {
      if (result.data && result.data.verify_url) {
        emailAlertType.value = "warning";
        verify_url = result.data.verify_url;
        emailVerify.value = true;
      } else {
        emailAlertType.value = "error";
      }
    }
  } catch (error: any) {
  } finally {
    createDefaultLoading.value = false;
    getBotStatus();
  }
};

// 手机创建
// 表单元素
let phoneform: EleFormRef = ref(null);
// 表单数据
let phoneData = reactive({
  phone: "",
  code: ""
});
// 清空表单
let clearPhoneForm = () => {
  phoneData.phone = "";
  phoneData.code = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (phoneform.value) {
        phoneform.value.clearValidate(["phone"]);
      }
    }, 200);
  } catch (error) {}
};
let validatePhone = (_: any, value: any, callback: any) => {
  // 手机正则表达式
  const phoneRegex = /^1[3456789]\d{9}$/;
  if (!phoneRegex.test(value)) {
    callback(new Error("手机格式不正确"));
  } else {
    callback();
  }
};
// 表单校验规则
const phoneRules = {
  phone: [
    {
      required: true,
      message: "手机号不能为空",
      trigger: "blur"
    },
    { validator: validatePhone, trigger: "blur" }
  ]
};
// 手机卡片提示
// 提示类型
let phoneAlertType = ref("warning");
// 提示消息
let phoneAlertTitle = ref("");
// 获取验证码加载
let codeloadingflag = ref(false);
// 验证码允许点击
let codedisabled = ref(false);
// 验证码倒计时
let codeTimes = ref(60);
// 显示倒计时
let codeTimeShow = ref(false);
// 人机验证
let captchaExecutingFlag = ref(false);
// 验证按钮
let phoneVerify = ref(false);
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
// 销毁全局变量
onUnmounted(() => {
  turnstile.remove();
});
// 获取验证码
let getCode = async () => {
  // 校验表单
  try {
    await phoneform.value!.validate();
  } catch (error: any) {
    return;
  }
  // 显示加载
  codeloadingflag.value = true;
  codedisabled.value = true;
  // 请求人机验证
  requestWithCaptcha(
    async (token: string) => {
      try {
        // 仓库发起验证码请求
        let result = await helperStore.botPhoneCode({
          mobile: phoneData.phone,
          captcha_token: token
        });
        phoneVerify.value = false;
        phoneAlertTitle.value = result.message;
        if (result.success) {
          phoneAlertType.value = "success";
          // 成功，开始倒计时
          codedisabled.value = true;
          codeTimeShow.value = true;
          const timer = setInterval(() => {
            codeTimes.value--;
            if (codeTimes.value < 1) {
              codeTimes.value = 60;
              codedisabled.value = false;
              codeTimeShow.value = false;
              clearInterval(timer);
            }
          }, 1000);
        } else {
          if (result.data && result.data.verify_url) {
            phoneAlertType.value = "warning";
            verify_url = result.data.verify_url;
            phoneVerify.value = true;
          } else {
            phoneAlertType.value = "error";
          }
          codedisabled.value = false;
        }
      } catch (error: any) {
        codedisabled.value = false;
      } finally {
        codeloadingflag.value = false;
      }
    },
    () => {
      codeloadingflag.value = false;
      codedisabled.value = false;
    }
  );
};
// 手机登录
let createBotByPhone = async () => {
  try {
    await phoneform.value!.validate();
    // 显示加载
    createDefaultLoading.value = true;
    let phoneInfo = {
      mobile: "",
      smscode: ""
    };
    phoneInfo.mobile = phoneData.phone;
    phoneInfo.smscode = phoneData.code;
    // 仓库发起手机登录请求
    let result = await helperStore.botCreateByPhone(phoneInfo);
    if (result.success) {
      phoneAlertType.value = "success";
      phoneVerify.value = false;
      getBotStatus();
      clearPhoneForm();
    } else {
      if (result.data && result.data.verify_url) {
        phoneAlertType.value = "warning";
        verify_url = result.data.verify_url;
        phoneVerify.value = true;
      } else {
        phoneAlertType.value = "error";
      }
    }
  } catch (error: any) {
  } finally {
    createDefaultLoading.value = false;
    getBotStatus();
  }
};

// bot解绑
// 解绑对话框dialog
let unbindDialogVisible = ref(false);
// 解绑确认按钮loading
let unbindLoading = ref(false);
// 显示dialog
let unbindDialog = () => {
  unbindDialogVisible.value = true;
};
let unbindBot = async () => {
  try {
    unbindLoading.value = true;
    let result = await helperStore.botUnbind();
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
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
    unbindLoading.value = false;
    unbindDialogVisible.value = false;
    getBotStatus();
  }
};

// 更改游戏昵称
// 更改对话框dialog
let changeDialogVisible = ref(false);
// 更改确认按钮loading
let changeLoading = ref(false);
// 显示dialog
let changeDialog = () => {
  changeDialogVisible.value = true;
};
// 表单元素
let botnameform: EleFormRef = ref(null);
// 表单数据
let botnameData = reactive({
  username: ""
});
// 清空表单
let clearChangeForm = () => {
  botnameData.username = "";
  // 清空校验提示
  try {
    setTimeout(() => {
      if (botnameform.value) {
        botnameform.value.clearValidate(["username"]);
      }
    }, 200);
  } catch (error) {}
};
// 表单校验规则
const rules2 = {
  username: [
    {
      required: true,
      message: "新昵称不能为空",
      trigger: "blur"
    }
  ]
};
let changeBotName = async () => {
  try {
    await botnameform.value!.validate();
    changeLoading.value = true;
    let botname = {
      username: ""
    };
    botname.username = botnameData.username;
    let result = await helperStore.botChangeName(botname);
    if (result.success) {
      ElNotification({
        type: "success",
        title: "Success",
        message: result.message,
        duration: 3000
      });
      clearChangeForm();
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
    changeLoading.value = false;
    changeDialogVisible.value = false;
    getBotStatus();
  }
};
</script>

<style scoped>
.card-header,
.card-footer {
  display: flex;
  align-items: center;
}
.el-alert__title,
.el-alert__content,
.el-alert {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.email-form-container,
.botname-form-container,
.phone-form-container {
  max-width: 600px;
}
:deep(.el-input input:-webkit-autofill) {
  -webkit-text-fill-color: #000000 !important;
}
</style>
