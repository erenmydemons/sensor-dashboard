export function flattenObject(data: { [k: string]: any } = {}, _flag: string = '') {
  let results: { [k: string]: any } = {};

  for (let key in data) {
    const value = data[key];
    let flag = !_flag ? key : `${_flag}.${key}`;

    if (typeof value !== 'object') {
      results[flag] = value;
    } else {
      results = { ...results, ...flattenObject(value, flag) };
    }
  }

  return results;
}
