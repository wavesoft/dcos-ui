const cluster = 'http://frontend-elasticl-1rdg2xb95xpfl-1160942300.us-west-2.elb.amazonaws.com';

export default {
  mockEndpoints: false,
  runInClient: false,
  endpoints: {
    marathon: {
      groups: `${cluster}/marathon/v2/groups`
    },
    mesos: {
      state: `${cluster}/mesos/master/state`
    }
  }
};
