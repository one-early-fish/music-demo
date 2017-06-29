export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let Klass = el.className.split(' ');
  Klass.push(className);
  el.className = Klass.join(' ');
}

export function removeClass(el, className) {
  let Klass = el.className.split(' ');
  Klass = Klass.filter((item) => {
    return item !== className;
  });
  el.className = Klass.join(' ');
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
