// bot 仓库
import { defineStore } from "pinia";
// 导入md5
import md5 from "crypto-js/md5";
// 导入工具函数
import { getPasswordLevel } from "@/utils";

// bot 请求api
import {
  reqBindEmailAccount,
  reqGetStatus,
  reqUnbind,
  reqBindMobileAccount,
  reqGetLoginSmscode,
  reqGetMailReward,
  reqUseGiftCode
} from "@/api/owner";

import { ref } from "vue";

// 创建仓库
let useOwnerStore = defineStore("owner", () => {
  // 是否设置
  let set = ref(false);

  // 游戏昵称
  let username = ref("");

  // 获取机器人游戏信息
  let getBot = async () => {
    try {
      let result = await reqGetStatus();
      // 设置信息
      set.value = false;
      username.value = "";
      if (result.data) {
        set.value = result.data.set;
        username.value = result.data.username;
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 邮箱创建
  let botCreateByEmail = async (emailInfo: HelperEmailInfo) => {
    // 计算密码强度
    emailInfo.password_level = getPasswordLevel(emailInfo.password);
    // 对密码进行加密
    emailInfo.password = md5(emailInfo.password).toString();
    return reqBindEmailAccount(emailInfo);
  };

  // 手机创建
  let botCreateByPhone = async (phoneInfo: HelperPhoneInfo) =>
    reqBindMobileAccount(phoneInfo);

  // 获取验证码
  let botPhoneCode = async (codeInfo: HelperCodeInfo) =>
    reqGetLoginSmscode(codeInfo);

  // 解绑
  let botUnbind = async () => reqUnbind();

  // 获取邮件奖励
  let botGetMailReward = async () => reqGetMailReward();

  // 使用礼包码
  let botUseGiftCode = async (giftCodeIndo: OwnerGiftCodeIndo) =>
    reqUseGiftCode(giftCodeIndo);

  return {
    set,
    username,
    getBot,
    botCreateByEmail,
    botUnbind,
    botCreateByPhone,
    botPhoneCode,
    botGetMailReward,
    botUseGiftCode
  };
});

export default useOwnerStore;
