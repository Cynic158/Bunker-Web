// 通用路由
import { RouteRecordRaw } from 'vue-router';

export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    name: "login",
    meta: {
      title: "用户登录",
      hidden: true,
      icon: "Tools",
    },
  },
  {
    path: "/",
    component: () => import("@/views/layout/index.vue"),
    name: "layout",
    redirect: "/home",
    meta: {
      title: "首页",
      hidden: true,
      icon: "Tools",
    },
    children: [
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
        name: "home",
        meta: {
          title: "首页",
          hidden: false,
          icon: "HomeFilled",
        },
      },
      {
        path: "/user",
        component: () => import("@/views/usermenu/index.vue"),
        name: "user",
        meta: {
          title: "用户菜单",
          hidden: false,
          icon: "UserFilled",
        },
      },
      {
        path: "/helper",
        component: () => import("@/views/helper/index.vue"),
        name: "helper",
        meta: {
          title: "Bot 账号",
          hidden: false,
          icon: "Cpu",
        },
      },
      {
        path: "/owner",
        component: () => import("@/views/owner/index.vue"),
        name: "owner",
        meta: {
          title: "游戏账号",
          hidden: false,
          icon: "SwitchFilled",
        },
      },
    ],
  },
];

// 权限路由
export const permissionRoutes = [
  {
    path: "/admin",
    component: () => import("@/views/admin/index.vue"),
    name: "admin",
    meta: {
      title: "管理菜单",
      hidden: false,
      icon: "Tools",
    },
  },
  {
    path: "/neomega",
    component: () => import("@/views/neomega/index.vue"),
    name: "neomega",
    meta: {
      title: "NeOmega",
      hidden: false,
      icon: "Tools",
    },
  },
];

// 通用路由2
export const defaultRoutes2 = [
  {
    path: "/download",
    component: () => import("@/views/download/index.vue"),
    name: "download",
    meta: {
      title: "下载",
      hidden: false,
      icon: "Download",
    },
  },
  {
    path: "/openapi",
    component: () => import("@/views/openapi/index.vue"),
    name: "openapi",
    meta: {
      title: "OpenAPI",
      hidden: false,
      icon: "ElementPlus",
    },
  },
  {
    path: "/about",
    component: () => import("@/views/about/index.vue"),
    name: "about",
    meta: {
      title: "关于",
      hidden: false,
      icon: "InfoFilled",
    },
  },
];

// 通配路由
export const anyRoute = {
  path: "/:pathMatch(.*)*",
  redirect: "/home",
  meta: {
    hidden: true,
  },
};
