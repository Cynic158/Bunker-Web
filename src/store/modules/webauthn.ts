// WebAuthn 仓库
import { defineStore } from "pinia";

// WebAuthn 请求api
import {
  reqRegisterOptions,
  reqRegisterVerification,
  reqGetLoginOptions,
  reqLoginVerification,
  reqRemoveById
} from "@/api/webauthn";

import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON
} from "@simplewebauthn/types";

import { ref } from "vue";

// 创建仓库
let useWebAuthnStore = defineStore("webauthn", () => {
  // 请求通行密钥注册Options
  let registerOptions = async () => reqRegisterOptions();

  // 请求通行密钥注册验证
  let registerVerification = async (data: RegistrationResponseJSON) =>
    reqRegisterVerification(data);

  // 请求通行密钥登录Options
  let loginOptions = async () => reqGetLoginOptions();

  // 请求通行密钥登录验证
  let loginVerification = async (data: AuthenticationResponseJSON) => {
    try {
      let result = await reqLoginVerification(data);
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // 请求通行密钥删除
  let removeById = async (info: WebauthnRemoveInfo) => reqRemoveById(info);

  // credentials数据
  let credentialsData = ref<Array<WebCredential>>([]);

  // 导出
  return {
    registerOptions,
    registerVerification,
    loginOptions,
    loginVerification,
    removeById,
    credentialsData
  };
});

export default useWebAuthnStore;
