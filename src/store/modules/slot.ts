// slot仓库
import { defineStore } from "pinia";

// Slot 请求api
import {
  reqDeleteSlot,
  reqSetSlotGameId,
  reqExtendSlotExpireTime
} from "@/api/slot";
import { ref } from "vue";

// 创建仓库
let useSlotStore = defineStore("slot", () => {
  // 请求删除Slot
  let deleteSlot = async (info: DeleteSlotInfo) => reqDeleteSlot(info);

  // 请求设置Slot游戏ID
  let setSlotGameID = async (info: SetSlotGameIdInfo) => reqSetSlotGameId(info);

  // 请求删除Slot
  let extendSlotExpireTime = async (info: ExtendSlotExpireTime) =>
    reqExtendSlotExpireTime(info);

  // slot数据
  let slotData = ref<Array<Slot>>([]);

  // 导出
  return {
    deleteSlot,
    setSlotGameID,
    extendSlotExpireTime,
    slotData
  };
});

export default useSlotStore;
