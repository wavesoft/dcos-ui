const cluster = 'http://35.162.168.62';

export default {
  mockEndpoints: false,
  runLocally: false,
  endpoints: {
    groups: `${cluster}/marathon/v2/groups`,
    history: `${cluster}/dcos-history-service/history/last`,
    state: `${cluster}/mesos/master/state`
  }
};
