import ServiceUtil from '../../utils/ServiceUtil';

export default class GroupsStore {
  constructor({ endpoints }) {
    this.endpoints = endpoints;
    this.groupsById = new Map();
  }

  fetchGroups() {
    this.groupsPromise = this.endpoints.marathon.groups.get()
      .then((group) => this.parseGroups(group))
      .then(() => {
        this.groupsPromise = null;
        this.groupsProcessed = true;
      });

    return this.groupsPromise;
  }

  parseGroups(root) {
    const stack = [];
    // Top down depth-first
    const parseDepthFirst => (group, parentId = null) {
      group.parentId = parentId;

      this.groupsById.set(group.id, group);

      stack.push(group);

      group.groups.forEach((subGroup) => {
        parseDepthFirst(subGroup, group.id);
      });
    }
    parseDepthFirst(root);

    // Bottom up breadth-first
    while(stack.length) {
      const group = stack.pop();

      const resources = this.getGroupResources(group);
      const status = this.getGroupStatus(group);

      group.resources = resources;
      group.status = status;

      if (group.parentId) {
        const parent = this.groupsById.get(group.parentId);
        // Add to parents resources
        parent.resources = Object.keys(parent.resources)
          .reduce((memo, resource) => {
            memo[resource] += group.resources[resource];

            return memo;
          }, parent.resources);
      }
    }
  }

  getGroupResources(group) {
    return group.apps.reduce((resources, service) {
      const {cpus = 0, mem = 0, disk = 0} = service;

      resources.cpus += cpus;
      resources.mem += mem;
      resources.disk += disk;

      return resources;
    }, {cpus: 0, mem: 0, disk: 0});
  }

  getGroupStatus(group) {
    return group.apps.reduce((groupStatus, service) => {
      const status = ServiceUtil.getServiceStatus(service);

      return Object.keys(groupStatus).reduce((memo, statusType) => {
        memo[statusType] += status[statusType];

        return memo;
      }, groupStatus);

    },
    {
      tasksHealthy: 0,
      tasksRunning: 0,
      tasksStaged: 0,
      tasksUnhealthy: 0,
      tasksUnknown: 0,
      tasksOverCapacity: 0
    });
  }

  getGroupsPromise() {
    if (this.groupsPromise) {
      return this.groupsPromise;
    }

    if (!this.groupsProcessed) {
      return this.fetchGroups();
    }

    return Promise.resolve(null);
  }

  getById(id) {
    return this.getGroupsPromise().then(() => {
      return this.groupsById.get(id);
    });
  }

  getAll() {
    return this.getGroupsPromise().then(() => {
      return [...this.groupsById.values()];
    });
  }
}
