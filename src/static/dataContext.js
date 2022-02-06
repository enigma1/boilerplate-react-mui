import {createContext} from 'react';
import configData from "=/params.json";

const dataContext = {
  configData,
};

export const GlobalConfig = createContext(dataContext);
export default dataContext;