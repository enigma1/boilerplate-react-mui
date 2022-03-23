import {useInternals, useDefined} from '!/useServices'

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

const control = ({interval, counters}) => {
  const internals = useInternals({
    stateParams: initialState,
    viewParams: initialView(counters),
  });

  const {state, actions, view} = internals;
  const {run} = state;
  const {$default} = actions;

  const stop = () => {
    view.timerID && clearInterval(view.timerID)
    delete view.timerID;
  }

  const start = () => {
    if(view.timerID) return;

    view.timerID = setInterval(() => {
      view.counters = updateCounters(++view.trigger, counters)
      $default();
    }, interval);
  }

  useDefined([
    [,start,,run],
    [,stop,,!run],
  ],[run], false, undefined, stop)

  return {
    iterations: view.trigger,
    counters: view.counters,
    isRunning: state.run,
    isPaused: (!state.run && view.trigger),
    onToggle: () => {
      $default({run: !run})
    },
    onReset: () => {
      Object.assign(view, initialView(counters))
      $default(initialState)
    },
    internals,
  }
}

export default control;
