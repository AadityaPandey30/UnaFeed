const { cookies } = require('next/headers');

function getOrCreateDeviceId() {
  // Access request cookies; if missing, generate a new ID and return it to be set by the caller
  const cookieStore = cookies();
  const existing = cookieStore.get('deviceId');
  if (existing && existing.value) return { deviceId: existing.value, isNew: false };
  // Use crypto.randomUUID if available; fallback to simple random
  let deviceId;
  try {
    deviceId = require('node:crypto').randomUUID();
  } catch {
    deviceId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
  return { deviceId, isNew: true };
}

module.exports = { getOrCreateDeviceId };


