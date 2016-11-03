const cluster = 'http://frontend-elasticl-15c0azoo348bq-1648430063.us-west-2.elb.amazonaws.com';

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
