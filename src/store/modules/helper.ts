// bot 仓库
import { defineStore } from "pinia";
// 导入md5
import md5 from "crypto-js/md5";
// 导入工具函数
import { getPasswordLevel } from "@/utils";

// bot 请求api
import {
  reqBindEmailAccount,
  reqChangeName,
  reqCreate,
  reqGetStatus,
  reqUnbind,
  reqGetLoginSmscode,
  reqBindMobileAccount,
  reqGetLoginQrcode,
  reqBindQrcodeAccount
} from "@/api/helper";

import { ref } from "vue";

// 创建仓库
let useHelperStore = defineStore("helper", () => {
  // 是否设置
  let set = ref(false);

  // 实名认证url
  let realname_url = ref("");

  // 游戏昵称
  let username = ref("");

  // 获取机器人游戏信息
  let getBot = async () => {
    try {
      let result = await reqGetStatus();
      // 设置信息
      set.value = false;
      realname_url.value = "";
      username.value = "";
      if (result.data) {
        set.value = result.data.set;
        realname_url.value = result.data.realname_url;
        username.value = result.data.username;
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 游客创建
  let botCreate = async () => reqCreate();

  // 邮箱创建
  let botCreateByEmail = async (emailInfo: HelperEmailInfo) => {
    // 计算密码强度
    emailInfo.password_level = getPasswordLevel(emailInfo.password);
    // 对密码进行加密
    emailInfo.password = md5(emailInfo.password).toString();
    return reqBindEmailAccount(emailInfo);
  };

  // 获取验证码
  let botPhoneCode = async (codeInfo: HelperCodeInfo) =>
    reqGetLoginSmscode(codeInfo);

  // 手机创建
  let botCreateByPhone = async (phoneInfo: HelperPhoneInfo) =>
    reqBindMobileAccount(phoneInfo);

  // 获取二维码
  let botGetQrcode = async () => reqGetLoginQrcode();

  // 通过二维码绑定账号
  let botBindQrcode = async (qrcodeInfo: HelperQrcodeInfo) =>
    reqBindQrcodeAccount(qrcodeInfo);

  // 解绑
  let botUnbind = async () => reqUnbind();

  // 更名
  let botChangeName = async (username: { username: string }) =>
    reqChangeName(username);

  return {
    set,
    realname_url,
    username,
    getBot,
    botCreate,
    botCreateByEmail,
    botUnbind,
    botChangeName,
    botPhoneCode,
    botCreateByPhone,
    botGetQrcode,
    botBindQrcode
  };
});

export default useHelperStore;
