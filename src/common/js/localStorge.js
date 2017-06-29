export function setStorge(key, value) {
  if (!window.localStorage) {
    return;
  }
  let storge = window.localStorage;
  storge.setItem(key, JSON.stringify(value));
}

export function getStorge(key) {
  if (!window.localStorage) {
    return;
  }
  let storge = window.localStorage;
  let item = JSON.parse(storge.getItem(key));
  if (item) {
    return item;
  } else {
    return [];
  }
}

export function removeStorge(key) {
  if (!window.localStorage) {
    return;
  }
  let storge = window.localStorage;
  storge.removeItem(key);
}
