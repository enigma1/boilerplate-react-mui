import {useInternals, useDefined} from '!/useServices'

/* Counter Schema
schema = {
  dir: 1, // incremental directional step, not 0 and within counter's range
  min: 0, // Minimum counter value
  max: 10 // Maximum counter value
}
*/

const transformSchemaToString = (value, counter) => {
  const max = Math.max(counter.min, counter.max);
  const min = Math.min(counter.min, counter.max);
  const range = max-min;
  const step = Math.min(Math.abs(counter.dir), range);
  const current = (value*step)%range+min;
  const result = counter.dir>0?current:max+min-current;
  return result;
}

const initializeCounters = counters => counters.map(counter => transformSchemaToString(0, counter));
const updateCounters = (value, counters) => counters.map(counter => transformSchemaToString(value, counter));

const initialState = {run: false}
const initialView = counters => ({pause: false, counters: initializeCounters(counters), trigger: 0})

const controller = ({interval, counters}) => {
  const internals = useInternals({
    stateParams: initialState,
    viewParams: initialView(counters),
  });

  const {state, stateDispatch, view} = internals;
  const {run} = state;

  const stop = () => {
    view.timerID && clearInterval(view.timerID)
    delete view.timerID;
  }

  const start = () => {
    if(view.timerID) return;

    view.timerID = setInterval(() => {
      view.counters = updateCounters(++view.trigger, counters)
      stateDispatch();
    }, interval);
  }

  useDefined([
    [,,start,,run],
    [,,stop,,!run],
  ],[run], false, stop)

  return {
    iterations: view.trigger,
    counters: view.counters,
    isRunning: state.run,
    isPaused: (!state.run && view.trigger),
    onToggle: () => {
      stateDispatch({run: !run})
    },
    onReset: () => {
      Object.assign(view, initialView(counters))
      stateDispatch(initialState)
    },
    internals,
  }
}

export default controller;
