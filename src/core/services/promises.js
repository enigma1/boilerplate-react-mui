import {isTrueObject} from "!/services/utils";

export const resolveData = (rs, data) => {
  rs && typeof rs === 'function' && rs(data)
  isTrueObject(rs) && typeof rs.resolve === 'function' && rs.resolve(data);
  return data;
}

export const createPromise = promiseHandlers => {
  const handlers = promiseHandlers || {}
  const promisedData = new Promise((resolve, reject) => Object.assign(handlers, {resolve, reject}));
  return {promisedData, handlers};
}
