import DataLoader from 'dataloader';

import config from '../../../config';
import { fetchWithAuth } from '../../../utils/fetch';

export default class GroupsServerConnector {
  constructor({ authToken }) {
    this.authToken = authToken;

    const getGroups = fetchWithAuth(authToken, {
      baseURI:
    });

    this.groupsLoader = new DataLoader(getGroups, {
      batch: false
    });

    this.groupByIdLoader = new DataLoader(fetchWithAuth(authToken), {
      batch: false
    });
  }

  getGroups() {
    return this.groupsLoader.load();
  }

  getGroupById(groupId) {
    return this.groupByIdLoader.load(groupId);
  }
}
