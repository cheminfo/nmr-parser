const isValidKey = (key) => {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
};

const isObject = (val) => {
  return typeof val === 'object';
};
const isPrimitive = (val) => {
  return typeof val === 'object' ? val === null : typeof val !== 'function';
};

export function assignDeep(target, ...args) {
  let index = 0;
  if (isPrimitive(target)) target = args[index++];
  if (!target) target = {};
  for (; index < args.length; index++) {
    if (!isObject(args[index])) continue;
    for (const key in args[index]) {
      if (!isValidKey(key)) continue;
      if (isObject(target[key]) && isObject(args[index][key])) {
        assignDeep(target[key], args[index][key]);
      } else {
        target[key] = args[index][key];
      }
    }
  }
  return target;
}
