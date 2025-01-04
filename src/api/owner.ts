// owner api
import request from "@/utils/request";

// 统一管理url
enum API {
  GET_STATUS = "/owner/get_status",
  BIND_EMAIL_ACCOUNT = "/owner/bind_account/email",
  UNBIND = "/owner/unbind",
  BIND_MOBILE_ACCOUNT = "/owner/bind_account/mobile",
  GET_LOGIN_SMSCODE = "/owner/bind_account/send_sms",
  GET_MAIL_REWARD = "/owner/get_mail_reward",
  USE_GIFT_CODE = "/owner/use_gift_code",
}

// 导出api
// 请求机器人游戏信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求以网易邮箱账号登录的形式创建机器人
export const reqBindEmailAccount = (emailInfo: HelperEmailInfo) =>
  request.post(API.BIND_EMAIL_ACCOUNT, emailInfo);
// 请求以手机账号登录的形式创建机器人
export const reqBindMobileAccount = (phoneInfo: HelperPhoneInfo) =>
  request.post(API.BIND_MOBILE_ACCOUNT, phoneInfo);
// 请求解绑机器人
export const reqUnbind = () => request.get(API.UNBIND);
// 获取验证码
export const reqGetLoginSmscode = (codeInfo: HelperCodeInfo) =>
  request.post(API.GET_LOGIN_SMSCODE, codeInfo);
// 获取邮件奖励
export const reqGetMailReward = () => request.get(API.GET_MAIL_REWARD);
// 使用礼包码
export const reqUseGiftCode = (giftCodeIndo: OwnerGiftCodeIndo) =>
  request.post(API.USE_GIFT_CODE, giftCodeIndo);
