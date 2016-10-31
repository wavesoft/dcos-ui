export class Applications {
  constructor({ connector }) {
    this.connector = connector;
    this.appsById = new Map();
  }

  parseState(state) {
    state.frameworks.forEach((framework) => {
      this.appsById.set(framework.id, framework);
    });
  }

  getById(id) {
    if (this.appsById.size) {
      if (!this.appsById.has(id)) {
        throw new Error(`Application ${id} does not exist`);
      }

      return this.appsById.get(id);
    }

    const dataPromise = this.connector.get();

    return dataPromise.then((state) => {
      this.parseState(state);
      // TODO Dry this up
      if (!this.appsById.has(id)) {
        throw new Error(`Application ${id} does not exist`);
      }

      return this.appsById.get(id);
    });
  }
}
