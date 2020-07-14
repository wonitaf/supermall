// 防抖动函数 (节流函数)
export function debounce(func,delay) {
  let timer = null
  return function(...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this,args)
    },delay)
  }
}
// 时间格式化字符串
export function formatDate(date, fmt) {
  // 获取年份
  // +表示至少一个，多了不限 *表示可有可无，多了不限 ?表示可有可无，至多一个
  // 获取几个y
  if (/(y+)/.test(fmt)) {
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个子匹配(以括号为标志)字符串
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  let o = {
    "M+": date.getMonth() + 1,        // 月
    "d+": date.getDate(),            // 日
    "H+": date.getHours(),           // 时
    "m+": date.getMinutes(),         // 分
    "S+": date.getSeconds()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}


// 防抖函数也可以放在此处
