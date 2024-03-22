export const ADD_ITEM_ID = -1;

export const itemCardIsAddItem = (itemCard: any) => {
  return parseInt(itemCard.key) === ADD_ITEM_ID;
};
