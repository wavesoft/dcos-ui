const cluster = 'http://35.162.168.62';

export default {
  mockEndpoints: false,
  runInClient: false,
  endpoints: {
    marathon: {
      groups: `${cluster}/marathon/v2/groups`
    },
    mesos: {
      state: `${cluster}/mesos/master/state`
    },
    dcos: {
      history: `${cluster}/dcos-history-service/history/last`,
    }
  }
};
