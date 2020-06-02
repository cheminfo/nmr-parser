export function toKeyValue(object) {
  let newObject = {};
  for (let key in object) {
    if (typeof object[key] !== 'string') {
      newObject[key] = JSON.stringify(object[key]);
    } else {
      newObject[key] = object[key];
    }
  }
  return newObject;
}
