import {createContext} from 'react';
import * as strings from "=/strings.json";
import * as configData from "=/params.json";

const dataContext = {
  strings,
  configData
};

export const CStrings = createContext(strings);
export const Cfg = createContext(configData);

export default dataContext;