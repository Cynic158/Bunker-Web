// 管理仓库
import { defineStore } from "pinia";

// 管理请求api
import {
  reqQueryUser,
  reqBanUser,
  reqUnBanUser,
  reqSetUserPermission,
  reqExtendUserExpireTime,
  reqExtendUserUnlimitedTime,
  reqGenerateRedeemCode,
  reqGetUnlimitedRentalServerList,
  reqAddUnlimitedRentalServer,
  reqDeleteUnlimitedRentalServer
} from "@/api/admin";

// 创建仓库
let useAdminStore = defineStore("admin", () => {
  // 查询用户
  let userQuery = async (username: { username: string }) =>
    reqQueryUser(username);

  // 封禁用户
  let userBan = async (banInfo: AdminBanInfo) => reqBanUser(banInfo);

  // 解封用户
  let userUnBan = async (username: { username: string }) =>
    reqUnBanUser(username);

  // 设置用户权限
  let userSetPermission = async (permissionInfo: AdminPermissionInfo) =>
    reqSetUserPermission(permissionInfo);

  // 更新用户有效期
  let userExtendExpireTime = async (
    extendUserExpireTimeInfo: AdminExtendUserExpireTimeInfo
  ) => reqExtendUserExpireTime(extendUserExpireTimeInfo);

  // 更新用户无限制权限有效期
  let userExtendUnlimitedTime = async (
    extendUserUnlimitedTimeInfo: AdminExtendUserUnlimitedTimeInfo
  ) => reqExtendUserUnlimitedTime(extendUserUnlimitedTimeInfo);

  // 生成兑换码
  let genCode = async (codeInfo: AdminCodeInfo) =>
    reqGenerateRedeemCode(codeInfo);

  // 查询无限制服务器列表
  let getUnlimitedRentalServerList = async () =>
    reqGetUnlimitedRentalServerList();

  // 添加无限制服务器
  let addUnlimitedRentalServer = async (info: { server_code: string }) =>
    reqAddUnlimitedRentalServer(info);

  // 删除无限制服务器
  let deleteUnlimitedRentalServer = async (info: {
    rental_server_id: number;
  }) => reqDeleteUnlimitedRentalServer(info);

  return {
    userQuery,
    userBan,
    userUnBan,
    userSetPermission,
    userExtendExpireTime,
    userExtendUnlimitedTime,
    genCode,
    getUnlimitedRentalServerList,
    addUnlimitedRentalServer,
    deleteUnlimitedRentalServer
  };
});

export default useAdminStore;
