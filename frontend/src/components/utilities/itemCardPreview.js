const PREVIEW_ITEM_SESSION_STORAGE_KEY = "previewData";

export function setItemCardPreviewData(data) {
    sessionStorage.setItem(PREVIEW_ITEM_SESSION_STORAGE_KEY, data);
}

export function getItemCardPreviewData() {
    return JSON.parse(sessionStorage.getItem(PREVIEW_ITEM_SESSION_STORAGE_KEY));
}

export function removeItemCardPreviewData() {
    sessionStorage.removeItem(PREVIEW_ITEM_SESSION_STORAGE_KEY);
}