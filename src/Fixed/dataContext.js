import {createContext} from 'react';
import * as configData from "=/params.json";
//import webTheme from '=/webTheme'

const dataContext = {
  configData: configData.default,
};

// export const CStrings = createContext(stringsData);
// export const Cfg = createContext(configData);

export const GlobalConfig = createContext(dataContext);

export default dataContext;