export const ADD_ITEM_ID = -1;

export const itemCardIsAddItem = (itemCard) => {
  return parseInt(itemCard.key) === ADD_ITEM_ID;
};
