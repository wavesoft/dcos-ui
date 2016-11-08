export default class Frameworks {
  constructor({ store }) {
    this.store = store;
  }

  getMapByName() {
    return this.store.Frameworks.getMapByName();
  }
}
