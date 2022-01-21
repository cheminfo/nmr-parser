import { isAnyArray } from 'is-any-array';

export function convertToFloatArray(data) {
  if (isAnyArray(data[0])) {
    return data.map((e) => Float64Array.from(e));
  } else if (isAnyArray(data)) {
    return Float64Array.from(data);
  } else if (typeof data === 'object') {
    let keys = Object.keys(data);
    for (let key of keys) {
      data[key] = convertToFloatArray(data[key]);
    }
    return data;
  }
  return data;
}
