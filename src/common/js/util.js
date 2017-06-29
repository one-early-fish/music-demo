export function tocar(value) {
  let time = parseInt(value);
  let hour = 0;
  let min = 0;
  let sec = 0;
  if (time >= 3600) {
    hour = Math.floor(time / 3600);
    time = time - 3600 * hour;
    min = Math.floor(time / 60);
    sec = parseInt(time % 60);
  } else if (time < 3600 && time > 60) {
    min = Math.floor(time / 60);
    sec = parseInt(time % 60);
  } else {
    sec = parseInt(time % 60);
  }
  min = min > 9 ? min : '0' + min;
  sec = sec > 9 ? sec : '0' + sec;
  if (hour === 0) {
    return min + ':' + sec;
  } else {
    hour = hour > 9 ? hour : '0' + hour;
    return hour + ':' + min + ':' + sec;
  }
}

export function isDuplicates(arr, id) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
}

export function randomNum(len, num) {
  let result = Math.floor(Math.random() * len);
  while (result === num) {
    result = Math.floor(Math.random() * len);
  }
  return result;
}
