const commonBus = {};

const commonWatch = (member, dispatchers) => {
  const index = dispatchers.findIndex(current => current === member);
  index === -1 && dispatchers.push(member);
  return () => member => {
    const index = dispatchers.findIndex(current => current === member);
    index > -1 && dispatchers.splice(index, 1)
  };
};

export const sharedBus = name => {
  const idx = name || 'global';
  !commonBus[idx] && (commonBus[idx] = {dispatchers: []});
  const {dispatchers} = commonBus[idx];

  const notify = (data, excluding) => {
    for (const member of dispatchers) member !== excluding && member({[idx]: data});
  };

  return {
    notify,
    monitor: member => commonWatch(member, dispatchers),
  };
};
