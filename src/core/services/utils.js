import DOMPurify from 'dompurify';

export const isTrueObject = inp => inp && typeof inp === 'object' && !Array.isArray(inp);
export const isStringArray = inp => typeof inp === 'string' || Array.isArray(inp);

export const sortObject = (input, json = true) => {
  if (!isTrueObject(input)) return input;
  const result = {};
  const list = Object.keys(input).sort();
  for (const key of list) result[key] = input[key];
  return json ? JSON.stringify(result) : result;
};

const comparisonTypes = {
  jsonCompare: (a, b) => sortObject(a) === sortObject(b),
  keysCompare: (a, b) => {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    return JSON.stringify(ak) === JSON.stringify(bk);
  },
  shallowCheckFromLeft: (a, b) => {
    return Object.entries(a).every((entry, key) => {
      return b[key] === entry;
    });
  },
};

export const compareObjects = (a, b, type = 'jsonCompare') =>
  comparisonTypes[type] ? comparisonTypes[type](a, b) : false;

const compareItems = ({items, type}) => compareObjects(items[0], items[1], type);

export const getRandomID = ({selection = 'a#', size = 16}) => {
  const patterns = {
    'a': 'abcdefghijklmnopqrstuvwxyz',
    'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '#': '0123456789',
    '-': '-_',
    '!': '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\',
    'x': '0123456789abcdef',
    'X': '0123456789ABCDEF',
    '0': '01',
    'd': Date.now().toString(),
  };

  let result = '';
  let combo = [...selection].map(entry => patterns[entry]);
  let comboString = combo.join('');
  for (let i = 0; i < size; i++) {
    result += comboString[Math.floor(Math.random() * (i ? comboString.length : combo[0].length))];
  }
  return result;
};

const getParamsFromQuery = (query, param = null) => {
  const result = query
    .slice(1)
    .split('&')
    .reduce((acc, s) => {
      const [k, v] = s.split('=');
      return Object.assign(acc, {[k]: v});
    }, {});
  if (param) {
    return result[param];
  }
  return result;
};

export const getQueryFromParams = params => {
  if (!isTrueObject(params)) return '';

  const result = Object.entries(params).reduce((p, [key, value]) => {
    const previous = p ? `${p}&` : '';
    return `${previous}${key}=${value}`;
  }, '');
  return result;
};

const safeStringFiltering = (s, r = '-') => {
  if (!s) return s;
  const filterChars = /([^a-z0-9-_]+)/gi;
  return s.replace(filterChars, r);
};

const getUniqueID = (prefix, sep = '*') => {
  return [prefix, Date.now()].filter(Boolean).join(sep);
};

const getLocationID = ({id}) => {
  return safeStringFiltering(getParamsFromQuery(location.search, id));
};
const splitUniqueID = (id, index = 0, sep = '*') => id.split(sep)[index];

const sanitize = content => {
  if (typeof content !== 'string' || !content.length) return '';
  return DOMPurify.sanitize(content);
};

const convertStrings = (stringsArray, matchPattern = /\$\{(\w+)\}/g) => {
  let input = stringsArray;
  isTrueObject(input) && (input = [stringsArray]);

  if (!Array.isArray(input)) {
    throw `Error: invalid data type on convertStrings got ${typeof stringsArray} instead of an Array or Object`;
  }

  const resultArray = input.map(({str, params}) => {
    str = str || '';
    if (!params) return str;

    const matches = str.matchAll(matchPattern);
    const segments = [];
    let offset = 0;
    for (const match of matches) {
      segments.push(str.substr(offset, match.index - offset));
      segments.push(params[match[1]]);
      offset = match.index + match[0].length;
    }
    offset < str.length && segments.push(str.substr(offset));
    return segments.join('');
  });

  return resultArray.length > 1 ? resultArray : resultArray.join('');
};

const remapStringInput = input => {
  if (isTrueObject(input)) return input;

  const defaultEntry = {str: '', params: {}};
  let result = defaultEntry;

  if (typeof input === 'string') {
    result.str = input;
  } else if (Array.isArray(input)) {
    result = input.map(entry => {
      if (typeof entry === 'string') return {str: entry, params: {}};
      else if (isTrueObject(entry)) return entry;
      else return defaultEntry;
    });
  }
  return result;
};

const stringsTransformer = input => {
  const converted = convertStrings(remapStringInput(input));
  let result;
  if (Array.isArray(converted)) {
    result = converted.map(entry => sanitize(entry));
  } else {
    result = sanitize(converted);
  }
  return result;
};

export default {
  getRandomID,
  getUniqueID,
  getLocationID,
  splitUniqueID,
  getParamsFromQuery,
  convertStrings,
  stringsTransformer,
  sanitize,
  compareItems,
};
