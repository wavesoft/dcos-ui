export class Frameworks {
  constructor({ connector }) {
    this.connector = connector;
    this.frameworksById = new Map();
  }

  parseState(state) {
    state.frameworks.forEach((framework) => {
      this.frameworksById.set(framework.id, framework);
    });
  }

  getById(id) {
    if (this.frameworksById.size) {
      if (!this.frameworksById.has(id)) {
        throw new Error(`Framework ${id} does not exist`);
      }

      return this.frameworksById.get(id);
    }

    const dataPromise = this.connector.get();

    return dataPromise.then((state) => {
      this.parseState(state);
      // TODO Dry this up
      if (!this.frameworksById.has(id)) {
        throw new Error(`Framework ${id} does not exist`);
      }

      return this.frameworksById.get(id);
    });
  }
}
