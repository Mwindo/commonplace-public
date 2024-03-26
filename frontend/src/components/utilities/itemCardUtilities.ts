import { ItemData } from "../../pages/ItemDetails";

export const ADD_ITEM_ID = -1;

export const itemIsAddItem = (item: ItemData) => {
  return item.id === ADD_ITEM_ID;
};
