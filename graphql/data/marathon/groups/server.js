import DataLoader from 'dataloader';

import config from '../../../config';
import { fetchWithAuth } from '../../../utils/fetch';

export default class GroupsServerConnector {
  constructor({ authToken }) {

    const getGroup = fetchWithAuth(authToken, {
      baseURI: config.endpoints.marathon.groups
    });

    this.groupsLoader = new DataLoader(getGroup, { batch: false });
  }

  get(groupId = '/') {
    if (groupId === '/') {
      // Load root /groups endpoint
      groupId = '';
    } else {
      // Load /groups/groupId endpoint
      groupId = `/${encodeURIComponent(groupId)}`;
    }

    return this.groupsLoader.load(groupId);
  }
}
