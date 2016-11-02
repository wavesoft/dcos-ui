const cluster = 'http://frontend-elasticl-1fxiz8wjrmnfh-1011505372.us-west-1.elb.amazonaws.com';

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
