// 管理 api
import request from "@/utils/request";

// 统一管理url
enum API {
  QUERY_USER = "/admin/user/query",
  BAN_USER = "/admin/user/ban",
  UNBAN_USER = "/admin/user/unban",
  SET_USER_PERMISSION = "/admin/user/set_permission",
  GET_UNLIMITED_RENTAL_SERVER_LIST = "/admin/unlimited_server/get_list",
  ADD_UNLIMITED_RENTAL_SERVER = "/admin/unlimited_server/add",
  DELETE_UNLIMITED_RENTAL_SERVER = "/admin/unlimited_server/delete",
}

// 导出api
// 请求使用管理权限查询用户
export const reqQueryUser = (username: { username: string }) =>
  request.post(API.QUERY_USER, username);
// 请求使用管理权限封禁用户
export const reqBanUser = (banInfo: AdminBanInfo) =>
  request.post(API.BAN_USER, banInfo);
// 请求使用管理权限解封用户
export const reqUnBanUser = (username: { username: string }) =>
  request.post(API.UNBAN_USER, username);
// 请求使用管理权限设置一位用户的权限
export const reqSetUserPermission = (permissionInfo: AdminPermissionInfo) =>
  request.post(API.SET_USER_PERMISSION, permissionInfo);
// 请求获取无限制服务器列表
export const reqGetUnlimitedRentalServerList = () =>
  request.get(API.GET_UNLIMITED_RENTAL_SERVER_LIST);
// 请求添加无限制服务器
export const reqAddUnlimitedRentalServer = (info: { server_code: string }) =>
  request.post(API.ADD_UNLIMITED_RENTAL_SERVER, info);
// 请求删除无限制服务器
export const reqDeleteUnlimitedRentalServer = (info: { rental_server_id: number }) =>
  request.post(API.DELETE_UNLIMITED_RENTAL_SERVER, info);
