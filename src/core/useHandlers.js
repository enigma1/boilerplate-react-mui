import configMap from '=/config.json';
import {useReducer} from '!/useServices';
import {resolveData} from '>/promises';
import {isTrueObject, compareObjects} from '>/utils';

// Use stateDispatcher as the default handling
const defaultReducerName = 'state';
const defaultStateCheck = 'shallowCheckFromLeft';

// In use services (activeServices)
const activeServices = {};
// const commonBus = {};
// const commonSpace = {};

// Action Handlers

// 1. Default State Handling
// - Passing an empty state causes a render phase
// - Passing a reset request causes a render phase
// - State differences will cause a render phase
// - If callback function returns true skip render phase
// - If callback function returns false do render phase
//
// Examples:
// StateDispatch() -> forces render phase
// StateDispatch({ready:true}) -> forces render phase
// StateDispatch(data: {ready:true}) ->
//   Compares current/new states and renders only if different (shallow object compare on payload part)
// StateDispatch({type: callbackRender(currentState, newState)}) ->
//   true = overrides any other state setting, skips state merge and skips render phase
//   false = for a render phase regardless of state difference.
const defaultActionHandler = () => (state, action) => {
  if (!action) return {...state};
  const {type, data, rs} = action;

  // Extract the new state
  const payload = !type && !data ? Object.assign({}, action) : Object.assign({}, data);

  // If state reset is requested reset with payload initialization
  if (type === 'reset') {
    return resolveData(rs, {...payload});
  }

  // Check if render-phase must be skipped using component callback and shallow check from left
  if (
    [typeof type === 'function' && type(data, payload), data && compareObjects(payload, state, defaultStateCheck)].some(
      e => e,
    )
  )
    return resolveData(rs, state);

  // Otherwise render with full state update
  return resolveData(rs, {...state, ...payload});
};

// 2. Middleware service interface
const serviceActionHandler = api => (action, adapter) => {
  const {type, data} = action;
  const invalidRequest = [api, type, !api[type]].every(e => !!e);
  if (invalidRequest) {
    action.resolver({
      error: `Function [${type}] not defined in service [${
        api?.getTokenName()
      }]. Make sure you are using the right dispacher and the action is spelled correctly`
    })
    return;
  }

  const params = !data || (isTrueObject(data) ? Object.assign({}, data) : data);

  // Create a path for the request and api adapter needed
  const path = adapter?[type, adapter].join('/'):type;
  // const result = api && api[type] ? api[type](params) : undefined;
  const result = api && api[path] && api[path](params);
  action.resolver(result);
};

// Reducers state-based and service/API
const defaultReducer = (reducer, state, initialState) => useReducer(reducer, state, initialState);
const serviceReducer = reducer => useReducer(reducer);

// Types of reducers
const reducerTypes = {
  internal: {
    reducer: defaultReducer,
    actionHandler: defaultActionHandler,
  },
  external: {
    reducer: serviceReducer,
    actionHandler: serviceActionHandler,
  },
};

const createReducer = (name = defaultReducerName) => {
  if (!activeServices[name] && name !== defaultReducerName) {
    console.log(`%cwarning: No activeServices for service [${name}] found - check if service exists`, 'color: #ffff55');
    const error = `Non-existing service ${name}, cannot process request`;
    activeServices[name] = new Proxy(() => ({error}), {
      get(target, name) {
        console.log(`%cwarning: Providing a default error function for [${name}] call`, 'color: #ffff55');
        return target;
      },
    });
  } else if (name === defaultReducerName) {
    activeServices[name] = {};
  }

  // No recreate
  if (activeServices[name].build) {
    console.log(`invalid re-entry on active service ${name}`);
    return;
  }

  // Process service setup once
  const rType = name === defaultReducerName ? reducerTypes.internal : reducerTypes.external;
  activeServices[name].contextReducer = rType.reducer;
  activeServices[name].reducer = rType.actionHandler(activeServices[name]);
  activeServices[name].build = true;
};

export const getContext = (name, stateSchema, stateFunction) => {
  (!activeServices[name] || !activeServices[name].build) && createReducer(name);
  const {reducer, contextReducer} = activeServices[name];
  return contextReducer(reducer, stateSchema, stateFunction);
};

export const getActiveServices = () => activeServices;

export const serviceImporter = async () => {
  const services = configMap.services;
  const promisedServices = Object.entries(services).map(async ([name, path]) => {
    const data = await import(`>/${path}`);
    return {[name]: data.default};
  });

  const data = await Promise.all(promisedServices);
  for (const entry of data) Object.assign(activeServices, entry);
  return getActiveServices();
};

