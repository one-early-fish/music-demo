// 处理歌词
export function parseLyric(data) {
  // 换行分割
  let lines = data.split('\n');
  // 结果数组
  let result = [];
  // 匹配时间戳正则
  let reg = /(\[\d{2}:\d{2}.\d{2,}\])/g;
  // 去掉不含时间的行,不含文本的行
  lines.forEach(function (item, index) {
    let time = item.match(reg);
    let lrc = item.replace(reg, '').trim();
    if (!time) {
      lines.splice(index, 1);
      index--;
    }
    if (lrc === '' && index < lines.length - 1) {
      let nextLrc = lines[index + 1].replace(reg, '').trim();
      lines.splice(index, 2, time + nextLrc);
      index--;
    }
  });
  // 去除最后的空行或者空文本
  lines[lines.length - 1].replace(reg, '').trim() === '' && lines.pop();
  // 遍历数组，分离出时间和歌词
  lines.forEach(function (item, index) {
    // 时间数组
    let time = item.match(reg);
    // 歌词文本数组
    let lrc = item.replace(reg, '').trim();
    // 特殊情况：如果歌词重复时间都在一起的话 [xx:xx:xx][xx:xx:xx]
    time.forEach(function (value) {
      let t = value.slice(1, -1).split(':');
      let json = {};
      json.time = parseInt(t[0]) * 60 + parseFloat(Number(t[1]).toFixed(2));
      json.text = lrc;
      result.push(json);
    });
  });
  result.sort(function (a, b) {
    return a.time - b.time;
  });
  return result;
}
