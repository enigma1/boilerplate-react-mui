import {useReducer as reactReducer, useEffect, useRef, useContext} from 'react';
import {Route} from 'react-router-dom';
import {getContext} from '!/useHandlers';
import {GlobalConfig} from '=/dataContext';
import {sharedBus} from '>/comms';
import {createPromise, resolveData} from '>/promises';
import {isTrueObject, sortObject, compareObjects} from '>/utils';

const getConditionFromFilter = filter => {
  if (typeof filter === 'function') return filter();
  return sortObject(filter);
};

const monoDeps = deps => {
  if (!deps || !Array.isArray(deps) || deps.length === 0) return [];
  return deps.map(item => (item && typeof item === 'object' ? sortObject(item) : item));
};

const defaultReducer = (reducer, initialState, mount) => {
  const [state, setState] = reactReducer(reducer, initialState);
  const error = `Error - component no longer mounted, cannot use react state`;
  const dispatch = action => mount.current && setState(action);
  return mount.current ? [state, dispatch] : [{error}, () => ({error})];
};

// executes before first render
export const useOnce = f => {
  const rendered = useRef(false);
  !rendered.current && (rendered.current = f());
  return rendered.current;
};


export const useMount = () => {
  const mount = useRef(true);
  useEffect(() => {
    return () => {
      mount.current = false;
    };
  }, []);
  return mount;
};

export const useMountEffect = (mount, f = () => {}, types = []) => {
  const deps = monoDeps(types);
  useEffect(() => {
    mount.current = true;
    f();
    return () => {
      mount.current = false;
    };
  }, deps);
};

export const useTimeout = (f, types, filter, period) => {
  const deps = monoDeps(types);
  const condition = getConditionFromFilter(filter);
  useEffect(() => {
    if (!deps.length) {
      console.log('Nothing to do - This effect requires at least one valid variable as condition');
      return;
    }
    deps.every(value => value && value !== condition);
    const localTimer = setTimeout(f, period);
    return () => {
      clearTimeout(localTimer);
    };
  }, deps);
};

export const useReducer = (reducer, initialState) => {
  const mount = useMount();
  if (initialState) return defaultReducer(reducer, initialState, mount);

  // Service actions
  return (action, adapter) => {
    if (!action) throw `Error: action passed is undefined`;
    if (!mount.current) {
      const error = `Component no longer mounted, cannot perform action ${action.type}`;
      return () => Promise.resolve({error});
    }
    // Setup a service promise and wait on it for the service to complete
    const dispatcherPromise = new Promise(rs => (action.resolver = rs));
    reducer(action, adapter);
    return dispatcherPromise.then(data => data).catch(e => e);
  };
};

export const useConfig = section => {
  const ctx = useContext(GlobalConfig);
  if (Array.isArray(section)) {
    return section.map(entry => ctx.configData[entry] || {});
  }
  return ctx.configData[section] || ctx.configData;
};

const createStateDispatch = data => {
  const input = typeof data === 'function' ? data() : data;
  return getContext('state', input || {}, input && (() => input));
};

// Component state by mutating a common object
const localDispatch = (data, area, emptyDispatch = () => {}) => {
  if (!isTrueObject(area)) {
    console.log(`current reference must be an object to mutate but got:`, area);
    return;
  }

  if (isTrueObject(area.current) && !data) {
    emptyDispatch();
    return;
  }

  if (!isTrueObject(data)) {
    if (!compareObjects(data, area.current)) {
      area.current = data;
      emptyDispatch();
    }
    return area.current;
  }

  const {rs, ...input} = data.data || data;

  const update = isTrueObject(area.current) ? {...area.current, ...input} : input;
  if (!compareObjects(update, area.current)) {
    area.current = update;
    emptyDispatch();
  }

  return resolveData(rs, area.current);
};

const createActionMap = (actionList, stateDispatch) => {
  const actionMap = {}
  if(!isTrueObject(actionList)) return actionMap;

  for(const [key, fromParams] of Object.entries(actionList)) {
    if(!key || !isTrueObject(fromParams)) continue;
    const {using, action} = fromParams;
    const [serviceName, adapter] = using.split('/');

    const isState = [
      serviceName === 'state',
      serviceName.trim().length === 0,
    ].some(e=>e)

    const dispatch = isState?stateDispatch:getContext(serviceName);

    actionMap[key] = (...props) => ({
      dispatch,
      adapter,
      ...action(...props)
    })
  }
  return actionMap
}

export const useInternals = ({
  actionList, stateParams, viewParams={}, cfgSection, dismount
}={}) => {
  const viewArea = useRef(stateParams);

  // Initialize state and get its dispatcher
  const [state, stateDispatch] = createStateDispatch(stateParams);
  const viewDispatch = data => localDispatch(data, viewArea, stateDispatch);
  const channel = (name, data) => sharedBus(name).notify(data, stateDispatch);

  // Component connection API creation
  const connect = (request, response, name) => {
    const api = {};

    const process = key => (...rest) => {
      const payload = request[key](...rest);
      channel(name, payload);
      response[key](payload.rsp);
    }
    for(const handler of Object.keys(request)) api[handler] = process(handler);
    return api;
  }
  dismount && useEffect(() => dismount, []);

  return {
    state,
    stage: data => ({toStage: data}),
    view: useRef(viewParams).current,
    viewDispatch,
    cfg: useConfig(cfgSection),
    actions: {$default: stateDispatch, ...createActionMap(actionList, stateDispatch)},
    channel, connect
  };
};

export const useSharedBus = (name, dispatcher) => {
  useEffect(() => sharedBus(name).monitor(dispatcher), []);
};

export const useDebounce = (entry, ms=10000) => {
  const stash = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      typeof entry === 'function'
      ? entry(stash.current)
      : sharedBus(entry).notify(stash.current);
    }, ms);
    return () => {clearTimeout(timer)}
  }, [entry, stash.current, ms])

  return data => {stash.current = data}
}

const validateSteps = requests => {
  if (!requests.every(value => Array.isArray(value))) {
    throw new Error(`Entry not an array - check the sequencer entries, each entry must be an array`);
  }
};

// Each array of the sequence dispatcher can take the following optional arguments
// rqData - function or object that holds the state or service dispatcher & data (state/action data etc)
// callback - function to be called once dispatcher finishes execution receives data retrieved
// anchor - label/mark in sequence can alter/redirect sequence execution
// condition - boolean or function - true/false whether to execute sequencer's entry
const dispatchSequencer = async requests => {
  validateSteps(requests);
  const pastResults = {
    last: undefined,
  };
  const staged = [];
  let result, gotoStep;

  for(const [rqData, callback, anchor, condition] of requests) {
    if([
        gotoStep && gotoStep !== anchor,
        typeof condition === 'boolean' && !condition,
        typeof condition === 'function' && !condition(pastResults),
      ].some(r => !!r)
    ) continue;

    const params = [
      typeof rqData === 'function' && rqData(pastResults),
      rqData && rqData,
      {}
    ].find(e => e)

    const {dispatch, adapter, ...rest} = params;
    if (dispatch && typeof dispatch === 'function') {
      result = callback
        ? (await callback(await dispatch(rest, adapter), pastResults)) || {}
        : (result = (await dispatch(rest, adapter)) || {});
    } else if (callback) {
      result = await callback({}, pastResults);
    }

    const {abort, goto, toStage} = (pastResults.last = result || {});

    if (abort) break;

    if (toStage) {
      staged.push(toStage);
      pastResults.last = undefined;
    }

    anchor && (pastResults[anchor] = result);
    gotoStep = goto;
  }
  return staged;
};

const mergeStaged = stages => {
  const merged = stages.reduce((p, c) => {
    return {...p, ...c};
  }, {});
  return merged;
};

const dispatchStaged = async (staged, dispatch, ready) => {
  if (!dispatch) return;
  const mergedState = mergeStaged(await staged);
  dispatch(ready ? {...mergedState, ready} : {data: mergedState});
};

export const useSequenceOnce = (requests, dispatch) => {
  const rendered = useRef(false);
  if (!rendered.current) {
    rendered.current = true;
    dispatchStaged(dispatchSequencer(requests), dispatch);
  }
};

export const useSequence = (requests, types = [], dispatch, cleanup) => {
  const deps = monoDeps(types);
  useEffect(
    () => {
      dispatchStaged(dispatchSequencer(requests), dispatch);
      return cleanup;
    },
    !types.includes('render') ? deps : undefined,
  );
};

export const useDefined = (requests, types, filter, dispatch, cleanup) => {
  const deps = monoDeps(types);
  if (!deps.length) return;

  const condition = getConditionFromFilter(filter);
  useEffect(() => {
    deps.every(value => value && value !== condition) && dispatchStaged(dispatchSequencer(requests), dispatch);
    return cleanup;
  }, deps);
};

export const useSpecifics = (requests, types, specifics, dispatch, cleanup) => {
  if (!Array.isArray(specifics) || !specifics.length) {
    return;
  }
  const deps = monoDeps(types);
  useEffect(() => {
    types.some((value, idx) => specifics[idx].includes(value)) && dispatchStaged(dispatchSequencer(requests), dispatch);
    return cleanup;
  }, deps);
};


export const useRouting = (dispatch, data, importer) => {
  useEffect(() => {
    const {promisedData, handlers} = createPromise();
    const promisedRoutes = ({routes}) => routes.map((entry, idx) => {
      const props = {...entry, Component:importer(entry)};
      const {Component, path} = props;

      return(
        <Route path={path} element={<Component />} key={[idx, entry.path].join('-')}>
          {entry.children && promisedRoutes({routes: entry.children})}
        </Route>
      );
    });
    handlers.resolve(promisedRoutes(data));
    promisedData.then(data => dispatch(data)).catch(e=>console.log(e))
    return () => {
      handlers.reject('Error component no longer mounted, routing aborted')
    }
  },[]);
}
