export class Tasks {
  constructor({ connector }) {
    this.connector = connector;
    this.agentsById = new Map();
    this.appsById = new Map();
    this.frameworksById = new Map();
    this.tasksById = new Map();
  }

  filterTasks(filter) {
    return [...this.tasksById.values()].filter((task) => {
      let keys = Object.keys(filter);

      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];

        if (task[key] !== filter[key]) {
          return false;
        }
      }

      return true;
    });
  }

  mergeTasks(taskList) {
    taskList.forEach((task) => {
      if (task.slave_id) {
        // Add agent as a property to task
        task.agent = this.agentsById.get(task.slave_id);
      }
      if (task.framework_id) {
        // Add Framework as a property
        task.framework = this.frameworksById.get(task.framework_id);
      }
      if (task.appId) {
        // Add Application as a property
        task.application = this.appsById.get(task.appId);
      }

      if (this.tasksById.has(task.id)) {
        task = Object.assign({}, this.tasksById.get(task.id), task);
      }
      this.tasksById.set(task.id, task);
    });
  }

  parseGroups(group) {
    group.apps.forEach(app => {
      this.appsById.set(app.id, app);
      this.mergeTasks(app.tasks);
    });
    group.groups.forEach(subGroup => this.parseGroups(subGroup));
  }

  parseState(state) {
    // Parse agents
    state.slaves.forEach((slave) => this.agentsById.set(slave.id, slave));
    // Parse tasks
    state.frameworks.forEach((framework) => {
      this.frameworksById.set(framework.id, framework);

      this.mergeTasks(framework.tasks);
      this.mergeTasks(framework.completed_tasks);
    });
  }

  getById(id) {
    if (this.tasksById.size) {
      if (!this.tasksById.has(id)) {
        throw new Error(`Task ${id} does not exist`);
      }

      return this.tasksById.get(id);
    }

    const dataPromise = Promise.all([
      this.connector.getState(),
      this.connector.getGroups()
    ]);
    // Map data to actual agents
    return dataPromise.then(([state, groups]) => {
      // Merge Mesos data second
      this.parseGroups(groups);
      this.parseState(state);

      if (!this.tasksById.has(id)) {
        throw new Error(`Task ${id} does not exist`);
      }

      return this.tasksById.get(id);
    });
  }

  getByAgentId(agentId) {
    if (this.tasksById.size) {
      return this.filterTasks({ slave_id: agentId });
    }

    const dataPromise = Promise.all([
      this.connector.getState(),
      this.connector.getGroups()
    ]);
    // Map data to actual agents
    return dataPromise.then(([state, groups]) => {
      // Merge Mesos data second
      this.parseGroups(groups);
      this.parseState(state);

      return this.filterTasks({ slave_id: agentId });
    });
  }
}
