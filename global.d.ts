// axios
import "axios";
declare module "axios" {
  interface DefaultRes {
    success: boolean;
    message: string;
  }
  interface AxiosResponse<T = any, D = any> extends DefaultRes {
    data: T;
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
    config: InternalAxiosRequestConfig<D>;
    request?: any;
    [key: string]: any;
  }
}

import type { FormContext } from "element-plus";
import type { Ref } from "vue";
import type { TurnstileObject } from "turnstile-types";

declare global {
  // 通用
  // 表单
  interface EleHTMLFormElement extends HTMLFormElement {
    value: FormContext;
  }
  type EleFormRef = Ref<EleHTMLFormElement | null>;
  // 人机校验
  declare var turnstile: TurnstileObject;

  // admin相关
  // 请求封禁用户
  interface AdminBanInfo {
    username: string;
    seconds: number;
    reason: string;
  }
  // 请求设置权限
  interface AdminPermissionInfo {
    username: string;
    permission: number;
  }

  // notice相关
  // 请求公告
  interface AnnPageInfo {
    page_num: number;
    page_size: number;
  }
  // 请求创建或者编辑公告
  interface NoticeInfo {
    id: number;
    title: string;
    content: string;
  }
  // 公告对象
  interface AnnOnj {
    id: number;
    title: string;
    content: string;
    author_name: string;
    create_at: number;
  }

  // helper相关
  // 请求邮箱创建bot
  interface HelperEmailInfo {
    username: string;
    password: string;
    password_level: number;
  }
  // 请求验证码
  interface HelperCodeInfo {
    mobile: string;
    captcha_token: string;
  }
  // 请求手机创建bot
  interface HelperPhoneInfo {
    mobile: string;
    smscode: string;
  }
  // 请求二维码创建bot
  interface HelperQrcodeInfo {
    uuid: string;
  }
  // bot信息
  interface HelperRobotInfo {
    success: boolean;
    message: string;
    set: boolean;
    realname_url: string;
    username: string;
  }

  // owner相关
  // 请求使用礼包码
  interface OwnerGiftCodeIndo {
    code: string;
  }
  // bot信息
  interface OwnerRobotInfo {
    set: boolean;
    username: string;
  }

  // setting相关
  interface SettingTab {
    path: string;
    title: string;
  }

  // user相关
  // 请求登录或者注册
  interface UserInfo {
    username: string;
    password: string;
    captcha_token: string;
  }
  // 请求更改密码
  interface UserPasswordInfo {
    email_verify_code: string;
    new_password: string;
  }
  // 请求邮箱验证码
  interface UserEmailVerifyCodeInfo {
    email?: string;
    username?: string;
    action_type: number;
    captcha_token: string;
  }
  // 请求重置密码
  interface UserResetPasswordInfo {
    username: string;
    email_verify_code: string;
    new_password: string;
  }
  // 请求绑定邮箱
  interface UserEmailBindInfo {
    email: string;
    email_verify_code: string;
  }
  // 请求解绑邮箱
  interface UserEmailUnbindInfo {
    email_verify_code: string;
  }
  // 请求注销
  interface UserRemoveAccountInfo {
    email_verify_code: string;
  }
  // 用户信息
  interface UserDetail {
    username: string;
    game_id: number;
    permission: number;
    is_admin: boolean;
    create_at: number;
    api_key: string;
    has_email: boolean;
    client_username: string;
    credentials: Array<WebCredential>;
  }
  interface UserQueryDetail {
    username: string;
    permission: number;
    game_id: number;
    create_at: number;
    ban_until: number;
    ban_reason: string;
  }

  // webauthn相关
  interface WebauthnRemoveInfo {
    credential_id: number;
  }
  interface WebCredential{
    id: number;
    create_at: number;
    raw_id: string;
  }

  // 无限制服务器相关
  interface UnlimitedRentalServer{
    id: number;
    create_at: number;
    server_code: string;
  }
}
