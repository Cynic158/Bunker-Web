// bot api
import request from "@/utils/request";

// 统一管理url
enum API {
  GET_STATUS = "/helper/get_status",
  CHANGE_NAME = "/helper/change_name",
  BIND_GUEST_ACCOUNT = "/helper/bind_account/guest",
  BIND_EMAIL_ACCOUNT = "/helper/bind_account/email",
  UNBIND = "/helper/unbind",
  GET_LOGIN_SMSCODE = "/helper/bind_account/send_sms",
  BIND_MOBILE_ACCOUNT = "/helper/bind_account/mobile",
  GET_LOGIN_QRCODE = "/helper/bind_account/get_qrcode",
  BIND_QRCODE_ACCOUNT = "/helper/bind_account/qrcode",
}

// 导出api
// 请求机器人游戏信息
export const reqGetStatus = () => request.get(API.GET_STATUS);
// 请求更改机器人的游戏昵称
export const reqChangeName = (username: { username: string }) =>
  request.post(API.CHANGE_NAME, username);
// 请求以游客登录的形式创建机器人
export const reqCreate = () => request.get(API.BIND_GUEST_ACCOUNT);
// 请求以网易邮箱账号登录的形式创建机器人
export const reqBindEmailAccount = (emailInfo: HelperEmailInfo) =>
  request.post(API.BIND_EMAIL_ACCOUNT, emailInfo);
// 获取手机验证码
export const reqGetLoginSmscode = (codeInfo: HelperCodeInfo) =>
  request.post(API.GET_LOGIN_SMSCODE, codeInfo);
// 请求以手机账号登录的形式创建机器人
export const reqBindMobileAccount = (phoneInfo: HelperPhoneInfo) =>
  request.post(API.BIND_MOBILE_ACCOUNT, phoneInfo);
// 获取二维码
export const reqGetLoginQrcode = () => request.get(API.GET_LOGIN_QRCODE);
// 通过二维码绑定账号
export const reqBindQrcodeAccount = (qrcodeInfo: HelperQrcodeInfo) =>
  request.post(API.BIND_QRCODE_ACCOUNT, qrcodeInfo);
// 请求解绑机器人
export const reqUnbind = () => request.get(API.UNBIND);

