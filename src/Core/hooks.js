import {useEffect, useRef, useContext} from 'react';
import {Cfg, CStrings} from '=/dataContext';

const monoDeps = (deps) => {
  if( !deps || !Array.isArray(deps) || !deps.length) return [];
  return deps.map(item => typeof item ==='object'?JSON.stringify(item):item);
}

const useCfg = (config) => useContext(Cfg)[config] || {};
const useStrings = (section) => useContext(CStrings)[section] || {};

const useMount = () => {
  const mount = useRef(true);
  useEffect(() => {
    return () => {
      mount.current = false
    };
  }, []);
  return mount;
};

const useMountEffect = (mount, f=()=>{}, types=[]) => {
  const deps = monoDeps(types);
  useEffect(() => {
    mount.current = true;
    f();
    return () => {
      mount.current = false
    };
  }, deps);
};

export {
  useCfg,
  useStrings,
  useMount,
  useMountEffect,
}
