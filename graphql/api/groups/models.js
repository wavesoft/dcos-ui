export default class Groups {
  constructor({ store }) {
    this.store = store;
  }

  getById(id) {
    return this.store.Groups.getById(id);
  }

  getAll(id) {
    const groupsPromise = this.store.Groups.getAll();
    const isChildGroup = new RegExp(`^${id}`);

    return groupsPromise.then((groups) => {
      return groups.filter((group) => group.id.match(isChildGroup));
    });
  }
}
