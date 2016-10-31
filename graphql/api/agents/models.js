export class Agents {
  constructor({ connector }) {
    this.connector = connector;
  }

  getById(id) {
    const dataPromise = this.connector.get();

    return dataPromise.then((state) => {
      return state.slaves.find((slave) => slave.id === id);
    });
  }

  getAll() {
    const dataPromise = this.connector.get();
    // Map data to actual agents
    return dataPromise.then((state) => {
      return state.slaves;
    });
  }
}
