import {useReducer as reactReducer, useEffect, useRef, useContext} from 'react';
import {getContext} from '!/useHandlers';
import {GlobalConfig} from '=/dataContext';

const isTrueObject = inp => typeof inp === 'object' && !Array.isArray(inp);
const isStringArray = inp => typeof inp === 'string' || Array.isArray(inp);

const monoDeps = (deps) => {
  if( !deps || !Array.isArray(deps) || !deps.length) return [];
  return deps.map(item => typeof item ==='object'?JSON.stringify(item):item);
}

const defaultReducer = (reducer, initialState, mount) => {
  const [state, setState] = reactReducer(reducer, initialState);
  const error = `Component no longer mounted`;
  const dispatch = (action) => mount.current && setState(action);
  return mount.current?[state, dispatch]:[{error},()=>({error})];
}

// executes before first render
export const useOnce = (f) => {
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = true;
    f();
  }
}

export const useMount = () => {
  const mount = useRef(true);
  useEffect(() => {
    return () => {
      mount.current = false
    };
  }, []);
  return mount;
};

export const useMountEffect = (mount, f=()=>{}, types=[]) => {
  const deps = monoDeps(types);
  useEffect(() => {
    mount.current = true;
    f();
    return () => {
      mount.current = false
    };
  }, deps);
};

export const useReducer = (reducer, initialState) => {
  const mount = useMount();
  if(initialState) return defaultReducer(reducer, initialState, mount);

  // Service actions
  return action => {
    if(!action) throw `Error: action passed is undefined`;
    if(!mount.current) {
      const error = `Component no longer mounted, cannot perform action ${action.type}`;
      return () => Promise.resolve({error});
    }
    // Setup a service promise and wait on it for the service to complete
    const dispatcherPromise = new Promise((rs) => action.resolver = rs);
    reducer(action);
    return dispatcherPromise.then(data => data);
  }
}

export const useConfig = (section) => useContext(GlobalConfig).configData[section] || {}

const createStateDispatch = (data) => {
  let input = typeof data === 'function'?data():data;
  input = data || {};
  return getContext('state', input, input && (() => input));
}

const createServiceDispatch = (input) => {
  if( !isStringArray(input) ) {
    return ()=>Promise.resolve('Nothing todo - No API service was configured');
  }
  const context = Array.isArray(input)?input:[input];
  const contextMap = context.map(entry => getContext(entry));
  return contextMap.length>1?contextMap:contextMap[0];
}

export const useInternals = ({dispatchers, stateParams, viewParams}={}, actions={}) => {
  // Initialize state and get its dispatcher
  const [state, stateDispatch] = createStateDispatch(stateParams);
  // Initialize Services and get equivalent dispatchers
  const serviceDispatchers = createServiceDispatch(dispatchers);

  return {
    state,
    stateDispatch,
    gConfig: useContext(GlobalConfig),
    view: useRef(viewParams || {}).current,
    middleware: Array.isArray(serviceDispatchers)?serviceDispatchers:[serviceDispatchers],
  }
}

const validateSteps = requests => {
  if( !requests.every(value => Array.isArray(value)) ) {
    throw new Error(`Entry not an array - check the sequencer, each entry must be an array`);
  }
}

// Each array of the sequence dispatcher can take the following optional arguments
// dispatch - dispatcher (stateDispatch, apiDispatch etc)
// rqData - dispatcher data (state data, action data etc)
// callback - function to be called once dispatcher finishes
// anchor - label/mark in sequence can alter sequence execution
// condition - boolean or function - true/false whether to execute entry
const dispatchSequencer = async (requests) => {
  validateSteps(requests);
  const pastResults = {
    last: undefined
  };
  let result, gotoStep;
  for(const [dispatch, rqData, callback, anchor, condition] of requests) {

    if(gotoStep && gotoStep !== anchor) continue;
    if(typeof condition === 'boolean' && !condition) continue;
    else if(typeof condition === 'function' && !condition(pastResults)) continue;

    const params = rqData || pastResults.last;

    if(dispatch && typeof dispatch === 'function') {
      result = callback
        ?(await callback(await dispatch(params), pastResults) || {})
        :(result = await dispatch(params) || {});
    } else if(callback) {
      result = await callback({}, pastResults);
    }

    const {abort, goto} = pastResults.last = result || {};
    if(abort) break;

    anchor && (pastResults[anchor] = result);
    gotoStep = goto;
  }
}

export const useSequenceOnce = (requests) => {
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = true;
    dispatchSequencer(requests);
  }
};

export const useSequence = (requests, types = []) => {
  const deps = monoDeps(types);
  useEffect(()=> {
    dispatchSequencer(requests);
  }, (types !== 'render')?deps:undefined);
};

export const useDefined = (requests, deps, condition) => {
  useEffect(() => {
    if(deps.every(value => value !== condition)) {
      dispatchSequencer(requests);
    }
  }, deps);
}

