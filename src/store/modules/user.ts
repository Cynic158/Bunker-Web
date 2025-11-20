// 用户仓库
import { defineStore } from "pinia";

// 用户请求api
import {
  reqLogout,
  reqNewToken,
  reqRegister,
  reqLogin,
  reqGetStatus,
  reqGetPhoenixToken,
  reqSetResponseTo,
  reqChangePassword,
  reqUseRedeemCode,
  reqDisableApiKey,
  reqGenApiKey,
  reqBindGameId,
  reqRequestEmailVerifyCode,
  reqResetPassword,
  reqEmailBind,
  reqEmailUnbind,
  reqRemoveAccount
} from "@/api/user";
// 导入路由创建动态菜单
import {
  defaultRoutes,
  permissionRoutes,
  defaultRoutes2,
  anyRoute
} from "@/router/routes";
import { ref } from "vue";
import router from "@/router";
import cloneDeep from "lodash/cloneDeep";
// 导入加密
import sha256 from "crypto-js/sha256";
import md5 from "crypto-js/md5";
import type { AxiosResponse } from "axios";
import useSlotStore from "./slot";
import useWebAuthnStore from "./webauthn";

// 过滤权限路由，传入权限路由以及用户所拥有的的路由权限数组
function filterRoute(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = filterRoute(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}
// 过滤没有权限的，由下述移除
function removeFilter(asyncRoutes: any, permission: any) {
  // 循环权限路由，返回一个过滤完成的路由列表
  return asyncRoutes.filter((item: any) => {
    // 如果用户的权限路由数组内有对应权限路由
    if (!permission.includes(item.name)) {
      // 检查此路由是否有子路由，如果有就再循环一遍
      if (item.children && item.children.length > 0) {
        item.children = removeFilter(item.children, permission);
      }
      // 将对应路由添加到要返回的路由中
      return true;
    }
  });
}

// 创建仓库
let useUserStore = defineStore("user", () => {
  // 用户信息部分
  // 用户token，先从本地获取，没有就空字符串
  let token = ref(localStorage.getItem("TOKEN") || "");
  // 用户名
  let uname = ref(localStorage.getItem("UNAME") || "");
  // 游戏id
  let uid = ref(localStorage.getItem("UID") || "");
  // 游戏名
  let clientName = ref(localStorage.getItem("CLIENTNAME") || "");
  // 无限制至
  let uunlimited = ref(localStorage.getItem("UUNLIMITEDFLAG") || "");
  // 权限
  let upermission = ref(localStorage.getItem("UPERMISSION") || "");
  // 是否管理员
  let adminFlag = ref(localStorage.getItem("ADMINFLAG") || "");
  // 用户创建时间
  let ucreate = ref(localStorage.getItem("UCREATE") || "");
  // 用户过期时间
  let uexpire = ref(localStorage.getItem("UEXPIRE") || "");
  // API
  let uapi = ref(localStorage.getItem("UAPI") || "");
  // 是否有邮箱
  let uhasEmail = ref(Boolean(localStorage.getItem("HAS_EMAIL")) || false);

  // 动态路由菜单项
  let menuRoutes = ref([...defaultRoutes]);
  // 动态路由刷新flag
  let refreshFlag = ref(false);

  // 获取会话token
  let getToken = async () => {
    let result = await reqNewToken();
    if (result) {
      token.value = result as any;
      return "success";
    } else {
      return Promise.reject("fail");
    }
  };

  // 请求登录或者注册
  let userRegLog = async (userInfo: UserInfo, type: "login" | "reg") => {
    // 先对密码进行加密
    const hashpassword = sha256(userInfo.password).toString();
    userInfo.password = hashpassword;
    // 发起请求
    try {
      let result = null;
      if (type == "reg") {
        result = await reqRegister(userInfo);
      } else if (type == "login") {
        result = await reqLogin(userInfo);
        localStorage.setItem("TOKEN", token.value);
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求更改密码
  let userPassword = async (passwordInfo: UserPasswordInfo) => {
    // 先对密码进行加密
    passwordInfo.new_password = sha256(passwordInfo.new_password).toString();
    // 发起请求
    return reqChangePassword(passwordInfo);
  };

  // 持久化用户信息
  let setUser = (userInfo: UserDetail | AxiosResponse<any, any>) => {
    uname.value = userInfo.username;
    if (userInfo.is_admin) {
      adminFlag.value = "是";
    } else {
      adminFlag.value = "否";
    }
    if (userInfo.game_id == 0) {
      uid.value = "暂未获取";
    } else {
      uid.value = userInfo.game_id.toString();
    }
    uunlimited.value = userInfo.unlimited_until.toString();
    ucreate.value = userInfo.create_at.toString();
    uexpire.value = userInfo.expire_at.toString();
    uapi.value = userInfo.api_key;
    upermission.value = userInfo.permission.toString();
    uhasEmail.value = userInfo.has_email;
    clientName.value = userInfo.client_username;

    localStorage.setItem("UNAME", userInfo.username);
    localStorage.setItem("UID", uid.value);
    localStorage.setItem("CLIENTNAME", clientName.value);
    localStorage.setItem("UUNLIMITED", uunlimited.value);
    localStorage.setItem("UPERMISSION", upermission.value);
    localStorage.setItem("ADMINFLAG", adminFlag.value);
    localStorage.setItem("UCREATE", ucreate.value);
    localStorage.setItem("UEXPIRE", uexpire.value);
    localStorage.setItem("UAPI", uapi.value);
    localStorage.setItem("HAS_EMAIL", uhasEmail.value.toString());
  };
  // 清空用户信息函数
  let clearUser = () => {
    token.value = "";
    uname.value = "";
    clientName.value = "";
    uid.value = "";
    upermission.value = "";
    adminFlag.value = "";
    uunlimited.value = "";
    ucreate.value = "";
    uexpire.value = "";
    uapi.value = "";
    uhasEmail.value = false;

    localStorage.setItem("TOKEN", token.value);
    localStorage.setItem("UNAME", uname.value);
    localStorage.setItem("CLIENTNAME", clientName.value);
    localStorage.setItem("UID", uid.value);
    localStorage.setItem("UUNLIMITED", uunlimited.value);
    localStorage.setItem("UPERMISSION", upermission.value);
    localStorage.setItem("ADMINFLAG", adminFlag.value);
    localStorage.setItem("UCREATE", ucreate.value);
    localStorage.setItem("UEXPIRE", uexpire.value);
    localStorage.setItem("UAPI", uapi.value);
    localStorage.setItem("HAS_EMAIL", "");

    // 重置flag，使得重新登录会再次动态添加路由
    refreshFlag.value = false;
  };

  // 获取用户信息
  let userInfo = async () => {
    // 发起请求
    let result = await reqGetStatus();
    if (result.success && result.data) {
      // 获取成功，存储用户信息
      setUser(result.data);
      const slotStore = useSlotStore();
      slotStore.slotData = result.data.slots;
      const webauthnStore = useWebAuthnStore();
      webauthnStore.credentialsData = result.data.credentials;
      // 根据得到的用户路由权限来渲染动态路由
      let filterArr: Array<string> = [];
      if (result.data.is_admin) {
        filterArr = ["admin"];
      }
      let userRoutes = filterRoute(cloneDeep(permissionRoutes), filterArr);
      let removePermission = removeFilter(
        cloneDeep(permissionRoutes),
        filterArr
      );
      menuRoutes.value = [...defaultRoutes, ...defaultRoutes2, ...userRoutes];
      // 动态添加路由
      userRoutes.forEach((route: any) => {
        router.addRoute("layout", route);
      });
      defaultRoutes2.forEach((route: any) => {
        router.addRoute("layout", route);
      });
      // 移除没有权限的路由
      removePermission.forEach((route: any) => {
        router.removeRoute(route.name);
      });
      // 通配路由放在最后
      router.addRoute(anyRoute);
    } else {
      // 获取失败，返回一个失败的promise
      return Promise.reject(result);
    }
  };

  // 请求登出
  let userLogout = async () => {
    try {
      // 发起请求
      let result = await reqLogout();
      if (result.success) {
        clearUser();
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求phoenixtoken
  let userReqFBToken = async (fbtokenInfo: UserFbtokenInfo) => {
    // 发起请求
    if (fbtokenInfo.hashed_ip !== "") {
      fbtokenInfo.hashed_ip = md5(fbtokenInfo.hashed_ip).toString();
    }
    return reqGetPhoenixToken(fbtokenInfo);
  };

  // 请求phoenixtoken
  let userSetClientUsername = async (info: UserSetClientUsernameInfo) =>
    reqSetResponseTo(info);

  // 请求绑定游戏ID
  let userGameIDBind = async (bindInfo: { server_code: string }) =>
    reqBindGameId(bindInfo);

  // 请求使用兑换码
  let userCode = async (code: { redeem_code: string }) =>
    reqUseRedeemCode(code);

  // 请求生成api
  let userGenApi = async () => reqGenApiKey();

  // 请求禁用api
  let userDisApi = async () => reqDisableApiKey();

  // 请求邮箱验证码
  let userRequestEmailVerifyCode = async (info: UserEmailVerifyCodeInfo) =>
    reqRequestEmailVerifyCode(info);

  // 请求重置密码
  let userResetPassword = async (resetPasswordInfo: UserResetPasswordInfo) => {
    // 先对密码进行加密
    const hashpassword = sha256(resetPasswordInfo.new_password).toString();
    resetPasswordInfo.new_password = hashpassword;
    // 发起请求
    return reqResetPassword(resetPasswordInfo);
  };

  // 请求邮箱绑定
  let userEmailBind = async (emailBindInfo: UserEmailBindInfo) =>
    reqEmailBind(emailBindInfo);

  // 请求邮箱解绑
  let userEmailUnbind = async (emailUnbindInfo: UserEmailUnbindInfo) =>
    reqEmailUnbind(emailUnbindInfo);

  // 请求删除账户
  let userDeleteAccount = async (deleteAccountInfo: UserRemoveAccountInfo) => {
    // 发起请求
    try {
      let result = await reqRemoveAccount(deleteAccountInfo);
      if (result.success) {
        clearUser();
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return {
    token,
    uname,
    uid,
    clientName,
    userInfo,
    userLogout,
    menuRoutes,
    clearUser,
    refreshFlag,
    getToken,
    userRegLog,
    upermission,
    adminFlag,
    uunlimited,
    ucreate,
    uexpire,
    uapi,
    uhasEmail,
    userReqFBToken,
    userSetClientUsername,
    userPassword,
    userGameIDBind,
    userCode,
    userGenApi,
    userDisApi,
    userRequestEmailVerifyCode,
    userResetPassword,
    userEmailBind,
    userEmailUnbind,
    userDeleteAccount
  };
});

export default useUserStore;
