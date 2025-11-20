// 公告仓库
import { defineStore } from "pinia";

// 公告请求api
import { reqQueryByPage, reqCreate, reqDelete, reqEdit } from "@/api/notice";

// 创建仓库
let useNoticeStore = defineStore("notice", () => {
  // 获取公告数组
  let getAnn = async (pageInfo: AnnPageInfo) => reqQueryByPage(pageInfo);

  // 创建公告
  let annCreate = async (noticeInfo: NoticeInfo) => reqCreate(noticeInfo);

  // 编辑公告
  let annEdit = async (noticeInfo: NoticeInfo) => reqEdit(noticeInfo);

  // 删除公告
  let annDelete = async (id: number) => reqDelete({ id });

  return {
    getAnn,
    annCreate,
    annEdit,
    annDelete
  };
});

export default useNoticeStore;
