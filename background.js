const DEFAULT_PROTECTED_TAB_COUNT = 1;
const STORAGE_KEY = "protectedTabCount";
const scheduledWindows = new Map();

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.sync.get(STORAGE_KEY);
  if (!Number.isInteger(current[STORAGE_KEY])) {
    await chrome.storage.sync.set({
      [STORAGE_KEY]: DEFAULT_PROTECTED_TAB_COUNT,
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) {
    return;
  }

  scheduleWindowCheck(removeInfo.windowId);
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

function scheduleWindowCheck(windowId) {
  if (scheduledWindows.has(windowId)) {
    clearTimeout(scheduledWindows.get(windowId));
  }

  const timerId = setTimeout(() => {
    scheduledWindows.delete(windowId);
    reconcileWindow(windowId);
  }, 100);

  scheduledWindows.set(windowId, timerId);
}

async function reconcileWindow(windowId) {
  const protectedTabCount = await getProtectedTabCount();

  let windowInfo;
  try {
    windowInfo = await chrome.windows.get(windowId);
  } catch {
    return;
  }

  if (windowInfo.type !== "normal") {
    return;
  }

  const tabs = await chrome.tabs.query({ windowId });
  if (tabs.length <= protectedTabCount) {
    await chrome.tabs.create({ windowId, active: false });
  }
}

async function getProtectedTabCount() {
  const current = await chrome.storage.sync.get(STORAGE_KEY);
  const value = Number(current[STORAGE_KEY]);

  if (Number.isInteger(value) && value >= 1) {
    return value;
  }

  await chrome.storage.sync.set({ [STORAGE_KEY]: DEFAULT_PROTECTED_TAB_COUNT });
  return DEFAULT_PROTECTED_TAB_COUNT;
}
