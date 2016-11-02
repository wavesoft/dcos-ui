export default class AgentStore {
  constructor({ endpoints }) {
    this.endpoints = endpoints;
    this.agentsById = new Map();
  }

  fetchAgents() {
    this.statePromise = this.endpoints.mesos.state.get()
      .then((state) => this.processAgents(state))
      .then(() => {
        this.statePromise = null;
        this.agentsProcessed = true;
      });

    return this.statePromise;
  }

  getAgentsPromise() {
    if (this.statePromise) {
      return this.statePromise;
    }

    if (!this.agentsProcessed) {
      return this.fetchAgents();
    }

    return Promise.resolve(null);
  }

  processAgents(state) {
    state.slaves.forEach((slave) => this.agentsById.set(slave.id, slave));
  }

  getById(id) {
    return this.getAgentsPromise().then(() => {
      return this.agentsById.get(id);
    });
  }

  getAll() {
    return this.getAgentsPromise().then(() => {
      return [...this.agentsById.values()];
    });
  }
}
