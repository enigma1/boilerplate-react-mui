import DOMPurify from 'dompurify'

export const isTrueObject = inp => inp && typeof inp === 'object' && !Array.isArray(inp);
export const isStringArray = inp => typeof inp === 'string' || Array.isArray(inp);

const comparisonTypes = {
  jsonCompare: (a,b) => JSON.stringify(a)===JSON.stringify(b),
  keysCompare: (a,b) => {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    return JSON.stringify(ak)===JSON.stringify(bk)
  },
  shallowCheckFromLeft: (a,b) => {
    return Object.entries(a).every((entry, key) => {
      return (b[key] === entry);
    })
  }
};
export const compareObjects = (a,b, type=jsonCompare) =>
  comparisonTypes[type]
    ? comparisonTypes[type](a,b)
    : false;

export const sortObject = (input, json=true) => {
  if(!isTrueObject(input)) return input;
  const result = {};
  Object.keys(input).sort().forEach(key => result[key] = input[key]);
  return json?JSON.stringify(result):result;
}

const getRandomID = ({selection='a#', size=16}) => {
  const patterns = {
    'a': 'abcdefghijklmnopqrstuvwxyz',
    'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '#': '0123456789',
    '-': '-_',
    '!': '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\',
    'x': '0123456789abcdef',
    'X': '0123456789ABCDEF',
    '0': '01',
    'd': Date.now()
  }

  let result = '';
  let combo = [...selection].map(entry => patterns[entry]);
  let comboString = combo.join('');
  for(let i = 0; i<size; i++) {
    result += comboString[Math.floor(Math.random() * (i?comboString.length:combo[0].length))];
  }
  return result;
}

const getParamsFromQuery = (query, param=null) => {
  const result = query.slice(1).split('&').reduce((acc, s) => {
    const [k, v] = s.split('=')
    return Object.assign(acc, {[k]: v})
  }, {});
  if( param ) {
    return result[param];
  }
  return result;
}

const isValidEmail = ({email, min, max}) => {
  if( typeof email !== 'string'||
    email.length < min ||
    email.length > max
  ) return false;

  const filterChars = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  const matches = email.match(filterChars);
  return Array.isArray(matches)?matches[0]:false;
}

const isValidName = ({name, min, max}) => {
  if(
    typeof name !== 'string'||
    name.length < min ||
    name.length > max
  ) return false;

  if(name.length < min || name.length > max) return false;

  const filterChars = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")/
  const matches = name.match(filterChars);
  return Array.isArray(matches)?true:false;
}

const isValidPassword = ({password, min, max}) => {
  return(
    typeof password === 'string' &&
    password.length >= min &&
    password.length <= max
  );
}

const safeStringFiltering = (s, r='-') => {
  if(!s) return s;
  const filterChars = /([^a-z0-9-_]+)/gi;
  return s.replace(filterChars, r);
}

const getUniqueID = (prefix, sep='*') => {
  return [prefix, Date.now()].filter(Boolean).join(sep);
}

const getLocationID = ({id}) => {
  return safeStringFiltering(getParamsFromQuery(location.search, id))
}
const splitUniqueID = (id, index=0, sep='*') => id.split(sep)[index];

const sanitize = content => {
  if(typeof content !== 'string' || !content.length) return "";
  return DOMPurify.sanitize(content)
}


const convertStrings = (stringsArray, matchPattern=/\$\{(\w+)\}/g) => {
  let input = stringsArray;
  isTrueObject(input) && (input = [stringsArray]);

  if(!Array.isArray(input)) {
    throw `Error: invalid data type on convertStrings got ${typeof stringsArray} instead of an Array or Object`;
  }

  const resultArray = input.map(({str, params}) => {
    str = str || '';
    if(!params) return str;

    const matches = str.matchAll(matchPattern);
    const segments = [];
    let offset=0;
    for (const match of matches) {
      segments.push(str.substr(offset, match.index-offset))
      segments.push(params[match[1]])
      offset = match.index + match[0].length;
    }
    offset<str.length && segments.push(str.substr(offset));
    return segments.join("");

  });

  return resultArray.length>1?resultArray:resultArray.join("");
}

const remapStringInput = input => {
  if(isTrueObject(input)) return input;

  const defaultEntry = {str: '', params: {}};
  let result = defaultEntry;

  if(typeof input === 'string') {
    result.str = input;
  } else if(Array.isArray(input)) {
    result = input.map(entry => {
      if(typeof entry === 'string') return {str: entry, params:{}}
      else if(isTrueObject(entry)) return entry;
      else return defaultEntry;
    })
  }
  return result;
}

const stringsTransformer = (input) => {
  const converted = convertStrings(remapStringInput(input));
  let result;
  if(Array.isArray(converted)) {
    result = converted.map(entry => sanitize(entry))
  } else {
    result = sanitize(converted);
  }
  return result;
}

export default {
  getRandomID,
  getUniqueID,
  getLocationID,
  splitUniqueID,
  getParamsFromQuery,
  isValidEmail,
  isValidPassword,
  isValidName,
  convertStrings,
  stringsTransformer,
  sanitize
}
