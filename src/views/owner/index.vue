<template>
  <div>
    <el-card shadow="hover" v-loading="createDefaultLoading || queryLoading">
      <template #header>
        <div class="card-header">
          <span style="margin-right: 16px">游戏账号</span>
        </div>
      </template>

      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >游戏账号是调用部分功能所使用的账号 (不包括进服)</span
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
            v-if="ownerStore.set && isLoaded"
            @click="unbindDialog"
            type="danger"
            round
            >解绑</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card
      shadow="hover"
      v-show="!ownerStore.set && isLoaded"
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
            绑定您的手机账号
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
                >绑定</el-button
              >
              <el-popover
                :width="326"
                :visible="!ownerStore.set && robotVisible"
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
      v-if="!ownerStore.set && isLoaded"
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
            >绑定您的邮箱账号</span
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
                >绑定</el-button
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
      v-if="ownerStore.username && isLoaded"
      v-loading="getMailRewardLoading || queryLoading"
      style="margin-top: 12px"
    >
      <template #header>
        <div class="card-header">邮件领取</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >将所有邮件状态变为已读, 且领取邮件奖励</span
          >
        </div>
        <el-divider border-style="dashed" />

        <el-button type="success" round @click="getMailReward">领取</el-button>
      </div>
    </el-card>

    <el-card
      v-loading="giftCodeLoading || queryLoading"
      style="margin-top: 12px"
      shadow="hover"
      v-if="ownerStore.username && isLoaded"
    >
      <template #header>
        <div class="card-header">礼包兑换码</div>
      </template>
      <div>
        <div class="card-footer">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          <span style="margin-left: 12px; color: dimgray"
            >使用游戏内礼包兑换码</span
          >
        </div>
        <el-divider border-style="dashed" />
        <el-alert
          v-if="giftCodeAlertTitle"
          style="margin-bottom: 16px"
          :title="giftCodeAlertTitle"
          :type="giftCodeAlertType"
          show-icon
          :closable="false"
        />

        <el-form
          @submit.prevent
          class="limited-form-container"
          :model="giftCodeData"
          :rules="giftCodeRules"
          ref="giftCodeform"
        >
          <el-form-item label="礼包兑换码" prop="code">
            <el-input
              v-model="giftCodeData.code"
              placeholder="请输入礼包兑换码"
            />
          </el-form-item>
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" native-type="submit" @click="useGiftCode"
              >兑换</el-button
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
      确定解绑游戏账号吗？当前保存的游戏账号信息将会被彻底清空。
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="unbindDialogVisible = false">取消</el-button>
          <el-button :loading="unbindLoading" type="danger" @click="unbindBot"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入bot仓库
import useOwnerStore from "@/store/modules/owner";
// 导入消息通知组件
import { ElNotification } from "element-plus";
import { onUnmounted, reactive, ref } from "vue";
// 使用设置仓库的移动端适配
import useSettingStore from "@/store/modules/setting";
let settingStore = useSettingStore();
// 人机验证显示
const robotVisible = ref(false);
// 导出本地仓库给HTML使用
let exportedLocalStorage = localStorage;
// bot信息部分
// 使用bot仓库
let ownerStore = useOwnerStore();
// 查询loading
let queryLoading = ref(false);
// 是否请求完成
let isLoaded = ref(false);
// 提示类型
let alertType = ref("warning");
// 提示消息
let alertTitle = ref("点击刷新来查询");
// 验证链接函数
let verify_url = "";
let verifyLink = () => {
  window.open(verify_url, "_blank");
};
// 获取bot信息
let getBotStatus = async () => {
  try {
    queryLoading.value = true;
    let result = await ownerStore.getBot();
    if (result.success) {
      // 获取成功
      if (result.data) {
        alertType.value = "success";
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

// 创建bot部分
// 创建loading
let createDefaultLoading = ref(false);

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
let validateGiftCode = (_: any, value: any, callback: any) => {
  // uuid正则
  const codeReg = /^[0-9a-z]{10}$/;

  if (!codeReg.test(value)) {
    callback(new Error("礼包兑换码格式不正确"));
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
const giftCodeRules = {
  code: [{ required: true, validator: validateGiftCode, trigger: "blur" }]
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
    let result = await ownerStore.botCreateByEmail(emailInfo);
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
// 销毁全局变量
onUnmounted(() => {
  turnstile.remove();
});
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
        let result = await ownerStore.botPhoneCode({
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
      mobile: phoneData.phone,
      smscode: phoneData.code
    };
    // 仓库发起手机登录请求
    let result = await ownerStore.botCreateByPhone(phoneInfo);
    phoneAlertTitle.value = result.message;
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
    let result = await ownerStore.botUnbind();
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

// 领取邮件奖励
let getMailRewardLoading = ref(false);
let getMailReward = async () => {
  try {
    getMailRewardLoading.value = true;
    let result = await ownerStore.botGetMailReward();
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
    getMailRewardLoading.value = false;
  }
};

// 礼包码
let giftCodeAlertType = ref("success");
// 提示消息
let giftCodeAlertTitle = ref("");
// 礼包码卡片loading
let giftCodeLoading = ref(false);
// 表单元素
let giftCodeform: EleFormRef = ref(null);
// 表单数据
let giftCodeData = reactive({
  code: ""
});
// 清空表单
let clearGiftCodeForm = () => {
  giftCodeData.code = "";
  try {
    setTimeout(() => {
      if (giftCodeform.value) {
        giftCodeform.value.clearValidate(["code"]);
      }
    }, 200);
  } catch (error) {}
};
// 使用兑换码
let useGiftCode = async () => {
  try {
    await giftCodeform.value!.validate();
    // 显示加载
    giftCodeLoading.value = true;
    // 仓库发起请求
    let result = await ownerStore.botUseGiftCode({
      code: giftCodeData.code
    });
    if (result.success) {
      giftCodeAlertType.value = "success";
      // 清空表单
      clearGiftCodeForm();
    } else {
      giftCodeAlertType.value = "warning";
    }
    giftCodeAlertTitle.value = result.message;
  } catch (error) {
  } finally {
    giftCodeLoading.value = false;
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
.limited-form-container {
  max-width: 600px;
}
</style>
