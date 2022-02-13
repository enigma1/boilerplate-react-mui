import {useReducer as reactReducer, useEffect, useRef, useContext} from 'react';
import {getContext} from '!/useHandlers';
import {GlobalConfig} from '=/dataContext';
import {isTrueObject, isStringArray, sortObject, compareObjects} from '>/utils'

const getConditionFromFilter = filter => {
  if(typeof filter === 'function') return filter();
  return sortObject(filter);
}

const monoDeps = (deps) => {
  if( !deps || !Array.isArray(deps) || !deps.length) return [];
  return deps.map(item => (item && typeof item ==='object')?sortObject(item):item);
}

const defaultReducer = (reducer, initialState, mount) => {
  const [state, setState] = reactReducer(reducer, initialState);
  const error = `Component no longer mounted, cannot use react state`;
  const dispatch = action => mount.current && setState(action);
  return mount.current?[state, dispatch]:[{error},()=>({error})];
}

// executes before first render
export const useOnce = f => {
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
    const dispatcherPromise = new Promise(rs => action.resolver = rs);
    reducer(action);
    return dispatcherPromise.then(data => data).catch(e => e);
  }
}

export const useConfig = (section) => {
  const ctx = useContext(GlobalConfig)
  return ctx.configData[section] || ctx.configData;
}

const createStateDispatch = data => {
  const input = typeof data === 'function'?data():data;
  return getContext('state', input||{}, input && (() => input));
}

const createServiceDispatch = (input) => {
  if( !isStringArray(input) || !input.length ) {
    return ()=>Promise.resolve('Nothing todo - No API service was configured');
  }
  const context = Array.isArray(input)?input:[input];
  const contextMap = context.map(entry => getContext(entry));
  return contextMap.length>1?contextMap:contextMap[0];
}

const localDispatch = (data, area, emptyDispatch=()=>{}) => {
  if(!isTrueObject(area)) {
    console.log(`current reference must be an object to mutate but got:`, area)
    return;
  }

  if(isTrueObject(area.current) && !data) {
    emptyDispatch();
    return;
  }

  if(!isTrueObject(data)) {
    if(!compareObjects(data, area.current)) {
      area.current = data;
      emptyDispatch();
    }
    return area.current;
  }

  const {rs, ...input} = data;

  const update = isTrueObject(area.current)?{...area.current, ...input}:input;
  if(!compareObjects(update, area.current)) {
    area.current = update;
    emptyDispatch();
  }

  rs && typeof rs === 'function' && rs(area.current);
  return area.current;
}

export const useInternals = ({dispatchers, stateParams, viewParams={}, cfgSection, dismount}) => {
  const viewArea = useRef(stateParams);

  // Initialize state and get its dispatcher
  const [state, stateDispatch] = createStateDispatch(stateParams);
  const viewDispatch = data => localDispatch(data, viewArea, stateDispatch);
  // Initialize Services and get equivalent dispatchers
  const serviceDispatchers = createServiceDispatch(dispatchers);

  dismount && useEffect(() => dismount, []);

  return {
    state,
    stateDispatch,
    stage: data => ({toStage: data}),
    view: useRef(viewParams).current,
    viewDispatch,
    cfg: useConfig(cfgSection),
    middleware: Array.isArray(serviceDispatchers)?serviceDispatchers:[serviceDispatchers],
  }
}

const validateSteps = requests => {
  if( !requests.every(value => Array.isArray(value)) ) {
    throw new Error(`Entry not an array - check the sequencer entries, each entry must be an array`);
  }
}

// Each array of the sequence dispatcher can take the following optional arguments
// dispatch - dispatcher (stateDispatch, apiDispatch etc)
// rqData - dispatcher data (state data, action data etc)
// callback - function to be called once dispatcher finishes
// anchor - label/mark in sequence can alter sequence execution
// condition - boolean or function - true/false whether to execute entry
const dispatchSequencer = async requests => {
  validateSteps(requests);
  const pastResults = {
    last: undefined
  };
  const staged = [];

  let result, gotoStep;
  for(const [dispatch, rqData, callback, anchor, condition] of requests) {

    if([
      gotoStep && gotoStep !== anchor,
      typeof condition === 'boolean' && !condition,
      typeof condition === 'function' && !condition(pastResults)
    ].some(r => !!r)) continue;

    let params = pastResults.last;
    if(typeof rqData === 'function') {
      params = rqData(pastResults)
    } else if(rqData) {
      params = rqData;
    }
    //const params = rqData || pastResults.last;

    if(dispatch && typeof dispatch === 'function') {
      result = callback
        ?(await callback(await dispatch(params), pastResults) || {})
        :(result = await dispatch(params) || {});
    } else if(callback) {
      result = await callback({}, pastResults);
    }

    const {abort, goto, toStage} = pastResults.last = result || {};
    if(abort) break;

    if(toStage) {
      staged.push(toStage);
      pastResults.last = undefined;
    }
    anchor && (pastResults[anchor] = result);
    gotoStep = goto;
  }
  return staged;
}

const mergeStaged = stages => {
  const merged = stages.reduce( (p,c) => {
    return {...p, ...c}
  },{})
  return merged
}

const dispatchStaged = async (staged, dispatch) => {
  if(!dispatch) return;
  const mergedState = mergeStaged(await staged)
  dispatch({data: mergedState});
}

export const useSequenceOnce = (requests, dispatch) => {
  const rendered = useRef(false);
  if(!rendered.current) {
    rendered.current = true;
    dispatchStaged(dispatchSequencer(requests), dispatch)
  }
};

export const useSequence = (requests, types = [], dispatch, cleanup) => {
  const deps = monoDeps(types);
  useEffect(()=> {
    dispatchStaged(dispatchSequencer(requests), dispatch)
    return cleanup;
  }, (types !== 'render')?deps:undefined);
};

export const useDefined = (requests, types, filter, dispatch, cleanup) => {
  const deps = monoDeps(types);
  if(!deps.length) return;

  const condition = getConditionFromFilter(filter);
  useEffect(() => {
    deps.every(value => value && value !== condition)
      && dispatchStaged(dispatchSequencer(requests), dispatch)
    return cleanup;
  }, deps);
}

export const useSpecifics = (requests, types, specifics, dispatch, cleanup) => {
  if( !Array.isArray(specifics) || !specifics.length ) {
    return;
  }
  const deps = monoDeps(types);
  useEffect(() => {
    types.some((value,idx) => specifics[idx].includes(value))
      && dispatchStaged(dispatchSequencer(requests), dispatch)
    return cleanup;
  }, deps);
}
