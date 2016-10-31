import groupsResponse from '../../../mock-data/groups';
import stateResponse from '../../../mock-data/state';

class AgentsConnector {
  getState() {
    return Promise.resolve(stateResponse);
  }

  getGroups() {
    return Promise.resolve(groupsResponse);
  }
}

export default AgentsConnector;
