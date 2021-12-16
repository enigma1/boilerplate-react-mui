import * as serviceMap from '=/services.json';
import {useReducer} from '!/useServices';
import {isTrueObject} from '>/utils';

// Use stateDispatcher as the default handling
const defaultReducerName = 'state';

// In use services (activeServices)
const activeServices = {};

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
  if(!action) return {...state};

  const {type, data} = action;
  const payload = (!type && !data)
    ?Object.assign({}, action)
    :Object.assign({}, data);

  // If state reset is requested reset with payload initialization
  if(type === 'reset') return {...payload};

  // Check if render-phase must be skipped callback and shallow check
  if(
    (typeof type === 'function' && type(state, payload)) ||
    (data && utils.compareObjects(payload, state, 'shallowCheckFromLeft'))
  ) {
    return state;
  }

  // Render with full state update
  return {...state, ...payload};
}

// 2. Middleware service handling
const serviceActionHandler = (entry) => (action) => {
  const {type, data} = action;
  if(entry && type && !entry[type]) throw `Function [${type}] not defined in service [${entry.getTokenName?entry.getTokenName():'unknown'}]. Make sure you are using the right dispacher and the action is spelled correctly`
  const params = !data || (isTrueObject(data)?Object.assign({}, data):data);
  action.resolver(
    (entry && entry[type])
      //?ifc[type](Object.assign({}, data))
      ?entry[type](params)
      :undefined
  );
}

// Reducers state-based and service/API
const defaultReducer = (reducer, state, initialState) => useReducer(reducer, state, initialState);
const serviceReducer = reducer => useReducer(reducer);

// Types of reducers
const reducerTypes = {
  internal: {
    reducer: defaultReducer,
    actionHandler: defaultActionHandler
  },
  external: {
    reducer: serviceReducer,
    actionHandler: serviceActionHandler
  },
}

const createReducer = (name=defaultReducerName) => {
  if(!activeServices[name] && name !== defaultReducerName) {
    console.log(`%cwarning: No activeServices for service [${name}] found - check if service exists`, 'color: #ffff55')
    const error = `Non-existing service ${name}, cannot process request`;
    activeServices[name] = new Proxy(() => ({error}), {
      get(target, name) {
        console.log(`%cwarning: Providing a default error function for [${name}] call`, 'color: #ffff55')
        return target
      }
    })
    // activeServices[name] = {
    //   get: (props) => {
    //     console.log('error', props)
    //     return {error};
    //   },
    //   set: (props) => ({error})
    // };
  } else if(name === defaultReducerName) {
    activeServices[name] = {};
  }

  // No recreate
  if(activeServices[name].build) return;

  // Process service setup once
  const rType = name !== defaultReducerName?reducerTypes.external:reducerTypes.internal;
  activeServices[name].contextReducer = rType.reducer;
  activeServices[name].reducer = rType.actionHandler(activeServices[name]);
  activeServices[name].build = true;
}

export const getContext = (name, stateSchema, stateFunction) => {
  createReducer(name);
  const {reducer, contextReducer} = activeServices[name];
  return contextReducer(reducer, stateSchema, stateFunction);
}

export const getStore = () => activeServices;

export const serviceImporter = () => {
  const services = serviceMap.default;
  const promisedServices = Object.entries(services).map(async service => {
    const data = await import(`>/${service[1]}`);
    return {[service[0]]: data.default};
  });

  return Promise.all(promisedServices).then(data => {
    data.forEach((entry) => {Object.assign(activeServices, entry)})
    return getStore();
  })
}
