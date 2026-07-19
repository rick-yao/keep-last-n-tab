const DEFAULT_PROTECTED_TAB_COUNT = 1;
const STORAGE_KEY = "protectedTabCount";

const input = document.getElementById("protectedTabCount");
const status = document.getElementById("status");
let statusTimerId = 0;

document.addEventListener("DOMContentLoaded", restore);
input.addEventListener("change", save);
input.addEventListener("input", clearStatus);

async function restore() {
  const current = await chrome.storage.sync.get(STORAGE_KEY);
  const value = sanitizeCount(current[STORAGE_KEY]);
  input.value = String(value);

  if (current[STORAGE_KEY] !== value) {
    await chrome.storage.sync.set({ [STORAGE_KEY]: value });
  }
}

async function save() {
  const value = sanitizeCount(input.value);
  input.value = String(value);
  await chrome.storage.sync.set({ [STORAGE_KEY]: value });
  showStatus("已保存");
}

function sanitizeCount(value) {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue < 1) {
    return DEFAULT_PROTECTED_TAB_COUNT;
  }

  return Math.min(numberValue, 50);
}

function showStatus(message) {
  status.textContent = message;
  clearTimeout(statusTimerId);
  statusTimerId = setTimeout(clearStatus, 1600);
}

function clearStatus() {
  status.textContent = "";
}
